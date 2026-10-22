import type { CalloutAliases } from './markdown-it-callout';

const INFO_CALLOUT_TYPE = 'info';
const GITHUB_CALLOUT_TYPES = new Set([
  'note',
  'tip',
  'important',
  'warning',
  'caution',
  INFO_CALLOUT_TYPE,
]);

export function getCalloutTypeForCurrentMode(
  configuredType: string,
  githubOnly: boolean,
  aliasesEnabled: boolean,
  aliases: CalloutAliases
): string {
  const type = normalizeCalloutType(configuredType);
  if (!type) {
    return INFO_CALLOUT_TYPE;
  }
  if (githubOnly && !GITHUB_CALLOUT_TYPES.has(type)) {
    return INFO_CALLOUT_TYPE;
  }
  if (!githubOnly && !aliasesEnabled && isCalloutAlias(type, aliases)) {
    return INFO_CALLOUT_TYPE;
  }
  return type;
}

function isCalloutAlias(type: string, aliases: CalloutAliases): boolean {
  const canonicalTypes = new Set(
    Object.keys(aliases).map(normalizeCalloutType).filter(Boolean)
  );
  if (canonicalTypes.has(type)) {
    return false;
  }

  return Object.values(aliases).some(value => {
    const values = Array.isArray(value) ? value : value.split(',');
    return values.some(alias => normalizeCalloutType(alias) === type);
  });
}

function normalizeCalloutType(type: string): string {
  const normalized = type.normalize('NFKC').trim().toLowerCase();
  return /^[^\s\]]+$/u.test(normalized) ? normalized : '';
}

export function wrapSelectionInCallout(
  selectedText: string,
  type: string,
  lineEnding: string
): string | null {
  const normalizedType = normalizeCalloutType(type);
  if (!selectedText.trim() || !normalizedType) {
    return null;
  }

  const hasTrailingLineEnding = /(?:\r\n|\n|\r)$/u.test(selectedText);
  const lines = selectedText.split(/\r\n|\n|\r/u);
  if (hasTrailingLineEnding) {
    lines.pop();
  }

  const wrappedLines = [
    `> [!${normalizedType}]`,
    ...lines.map(line => `> ${line}`),
  ];
  return `${wrappedLines.join(lineEnding)}${
    hasTrailingLineEnding ? lineEnding : ''
  }`;
}

export function removeCalloutMarkup(selectedText: string): string | null {
  const hasTrailingLineEnding = /(?:\r\n|\n|\r)$/u.test(selectedText);
  const lineEnding = selectedText.match(/\r\n|\n|\r/u)?.[0] ?? '\n';
  const lines = selectedText.split(/\r\n|\n|\r/u);
  if (hasTrailingLineEnding) {
    lines.pop();
  }

  const firstLine = lines.shift();
  const header = firstLine?.match(
    /^[ \t]*>[ \t]*\[![^\]\s]+\]-?(?:[ \t]+(.*))?[ \t]*$/u
  );
  if (!header) {
    return null;
  }

  const unwrappedLines: string[] = [];
  const title = header[1]?.trim();
  if (title) {
    unwrappedLines.push(title);
  }
  unwrappedLines.push(
    ...lines.map(line => line.replace(/^([ \t]*)>[ \t]?/u, '$1'))
  );

  return `${unwrappedLines.join(lineEnding)}${
    hasTrailingLineEnding && unwrappedLines.length > 0 ? lineEnding : ''
  }`;
}
