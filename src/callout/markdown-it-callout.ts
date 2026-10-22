import type MarkdownIt = require('markdown-it');

const ICONS: Record<string, string> = {
  bug: '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 0 1 6 0v1"/><path d="M12 20v-6"/><path d="M6 13H2"/><path d="M22 13h-4"/><path d="M6 8H2"/><path d="M22 8h-4"/><path d="M6 18H2"/><path d="M22 18h-4"/><rect x="6" y="8" width="12" height="12" rx="6"/>',
  book: '<path d="M12 7v14"/><path d="M3 18V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13"/><path d="M3 18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2"/><path d="M3 18a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'file-warning':
    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 12v4"/><path d="M12 19h.01"/>',
  flask:
    '<path d="M9 3h6"/><path d="M10 9V3"/><path d="M14 9V3"/><path d="M8.5 9h7l4.2 9.2A2 2 0 0 1 17.9 21H6.1a2 2 0 0 1-1.8-2.8z"/><path d="M8 16h8"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  lightbulb:
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14a6 6 0 1 0-6.18 0c.57.36.99.92 1.09 1.59l.16 1.41h3.68l.16-1.41c.1-.67.52-1.23 1.09-1.59"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  pause:
    '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  quote:
    '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H5c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 2-1 3-3 3v5Z"/><path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-3c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 2-1 3-3 3v5Z"/>',
  square: '<rect x="3" y="3" width="18" height="18" rx="2"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  'square-check':
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  warning:
    '<path d="m10.29 3.86-8.47 14.1A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3.04l-8.47-14.1a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  x: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
};

const ICON_FOR_TYPE: Record<string, string> = {
  abstract: 'book',
  attention: 'warning',
  bug: 'bug',
  caution: 'x',
  cite: 'quote',
  danger: 'x',
  done: 'check',
  doing: 'arrow-right',
  error: 'x',
  example: 'flask',
  fail: 'x',
  failure: 'x',
  giveup: 'ban',
  missing: 'file-warning',
  faq: 'help',
  help: 'help',
  idea: 'lightbulb',
  hint: 'lightbulb',
  important: 'star',
  info: 'info',
  note: 'info',
  question: 'help',
  quote: 'quote',
  success: 'check',
  summary: 'book',
  tldr: 'book',
  tip: 'lightbulb',
  todo: 'square',
  waitting: 'pause',
  warning: 'warning',
};

interface Callout {
  type: string;
  canonicalType: string;
  title: ReturnType<MarkdownIt['parseInline']>;
  collapsed: boolean;
  hasBody: boolean;
}

export type CalloutAliases = Record<string, string | string[]>;
export const BUILTIN_CALLOUT_TYPES = [
  'note',
  'tip',
  'important',
  'warning',
  'caution',
] as const;
type BuiltinCalloutType = (typeof BUILTIN_CALLOUT_TYPES)[number];
export type BuiltinCalloutAliases = Partial<Record<BuiltinCalloutType, string>>;
export const CONFIG_CALLOUT_ALIASES = 'aliases.custom';
export const CONFIG_CALLOUT_BUILTIN_ALIASES = 'aliases.builtin';
export const CONFIG_CALLOUT_ALIASES_ENABLED = 'aliases.enabled';
export const CONFIG_CALLOUT_GITHUB_ONLY = 'githubOnly';
export const DEFAULT_BUILTIN_CALLOUT_ALIASES: Record<
  BuiltinCalloutType,
  string
> = {
  note: 'info',
  tip: 'hint',
  important: 'must',
  warning: '!,warn,attention',
  caution: '!!!,danger',
};

export function readBuiltinCalloutAliases(
  aliases: BuiltinCalloutAliases = {}
): CalloutAliases {
  return Object.fromEntries(
    BUILTIN_CALLOUT_TYPES.map(type => [
      type,
      typeof aliases[type] === 'string'
        ? aliases[type]
        : DEFAULT_BUILTIN_CALLOUT_ALIASES[type],
    ])
  );
}

export const DEFAULT_CUSTOM_CALLOUT_ALIASES: CalloutAliases = {
  abstract: ['summary', 'tldr'],
  bug: [],
  doing: ['>>'],
  done: ['success', '√', 'V'],
  error: ['x', 'fail', 'failure'],
  example: [],
  faq: ['help', 'question', '?'],
  giveup: [],
  idea: [],
  missing: [],
  quote: ['cite'],
  todo: [],
  waitting: ['=='],
};
export const DEFAULT_CALLOUT_ALIASES: CalloutAliases = {
  ...DEFAULT_CUSTOM_CALLOUT_ALIASES,
  ...DEFAULT_BUILTIN_CALLOUT_ALIASES,
};

const GITHUB_CALLOUT_TYPES = new Set([
  'note',
  'tip',
  'important',
  'warning',
  'caution',
  // The editor command defaults to "info", an alias for GitHub's note type.
  'info',
]);

function normalizeType(type: string): string {
  return type.normalize('NFKC').trim().toLowerCase();
}

function createCanonicalTypeResolver(aliases: CalloutAliases) {
  const configuredAliases =
    aliases && typeof aliases === 'object' && !Array.isArray(aliases)
      ? aliases
      : {};
  const aliasesByType: CalloutAliases = {};
  for (const [type, typeAliases] of Object.entries(configuredAliases)) {
    const normalizedType = normalizeType(type);
    const parsedAliases = Array.isArray(typeAliases)
      ? typeAliases
      : typeof typeAliases === 'string'
      ? typeAliases.split(',')
      : [];
    if (normalizedType) {
      const currentAliases = aliasesByType[normalizedType];
      const existingAliases = Array.isArray(currentAliases)
        ? currentAliases
        : typeof currentAliases === 'string'
        ? currentAliases.split(',')
        : [];
      aliasesByType[normalizedType] = [...existingAliases, ...parsedAliases];
    }
  }

  const configuredTypes = Object.keys(aliasesByType)
    .map(normalizeType)
    .filter(Boolean);
  const reservedTypes = new Set([...GITHUB_CALLOUT_TYPES, ...configuredTypes]);
  const aliasToType = new Map<string, string>();
  const aliasPriority = (type: string) => (type === 'caution' ? 0 : 1);

  const aliasesByTypeEntries = Object.entries(aliasesByType).sort(
    ([left], [right]) => aliasPriority(left) - aliasPriority(right)
  );
  for (const [type, typeAliases] of aliasesByTypeEntries) {
    const canonicalType = normalizeType(type);
    if (!canonicalType) {
      continue;
    }

    const parsedAliases = Array.isArray(typeAliases)
      ? typeAliases
      : typeof typeAliases === 'string'
      ? typeAliases.split(',')
      : [];
    for (const alias of parsedAliases) {
      if (typeof alias !== 'string') {
        continue;
      }
      const normalizedAlias = normalizeType(alias.trim());
      if (
        normalizedAlias &&
        !reservedTypes.has(normalizedAlias) &&
        !aliasToType.has(normalizedAlias)
      ) {
        aliasToType.set(normalizedAlias, canonicalType);
      }
    }
  }

  return (type: string) => {
    const normalizedType = normalizeType(type);
    return aliasToType.get(normalizedType) ?? normalizedType;
  };
}

export function combineCalloutAliases(
  ...sources: CalloutAliases[]
): CalloutAliases {
  const combined: CalloutAliases = {};
  for (const source of sources) {
    for (const [type, aliases] of Object.entries(source)) {
      const normalizedType = normalizeType(type);
      if (!normalizedType) {
        continue;
      }
      const parsedAliases = Array.isArray(aliases)
        ? aliases
        : typeof aliases === 'string'
        ? aliases.split(',')
        : [];
      const currentAliases = combined[normalizedType];
      const existingAliases = Array.isArray(currentAliases)
        ? currentAliases
        : typeof currentAliases === 'string'
        ? currentAliases.split(',')
        : [];
      combined[normalizedType] = [...existingAliases, ...parsedAliases];
    }
  }
  return combined;
}

function titleForType(type: string): string {
  return type[0].toUpperCase() + type.slice(1);
}

function renderIcon(type: string): string {
  const iconName = ICON_FOR_TYPE[type] ?? 'info';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[iconName]}</svg>`;
  const iconUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return `<span class="markdown-callout-icon callout-icon" data-icon="${iconName}" style="--markdown-callout-default-icon: url('${iconUrl}')"></span>`;
}

export function markdownItCallout(
  md: MarkdownIt,
  aliases: CalloutAliases = DEFAULT_CALLOUT_ALIASES,
  githubOnly = false,
  aliasesEnabled = true
): void {
  const inlineParser = md.inline;
  if (!inlineParser) {
    throw new Error('Markdown inline parser is not available.');
  }
  const resolveCanonicalType = aliasesEnabled
    ? createCanonicalTypeResolver(aliases)
    : normalizeType;

  md.core.ruler.push('markdown-callout', state => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const open = tokens[i];
      if (
        open.type !== 'blockquote_open' ||
        tokens[i + 1]?.type !== 'paragraph_open' ||
        tokens[i + 2]?.type !== 'inline' ||
        tokens[i + 3]?.type !== 'paragraph_close'
      ) {
        continue;
      }

      const inline = tokens[i + 2];
      const firstLineEnd = inline.content.indexOf('\n');
      const firstLine =
        firstLineEnd === -1
          ? inline.content
          : inline.content.slice(0, firstLineEnd);
      const match = firstLine.match(
        /^[ \t]*\[![ \t]*([^\]\s]+)[ \t]*\](-?)(?:[ \t]+(.*))?$/u
      );
      if (!match) {
        continue;
      }

      const type = match[1].trim();
      const normalizedType = normalizeType(type);
      if (githubOnly && !GITHUB_CALLOUT_TYPES.has(normalizedType)) {
        continue;
      }
      const canonicalType = githubOnly
        ? normalizedType === 'info'
          ? 'note'
          : normalizedType
        : resolveCanonicalType(type);
      const titleText = match[3]?.trim() || titleForType(type);
      const title: ReturnType<MarkdownIt['parseInline']> = [];
      inlineParser.parse(titleText, state.md, state.env, title);

      const collapsed = match[2] === '-';

      let depth = 0;
      let closeIndex = i;
      for (let j = i; j < tokens.length; j++) {
        if (tokens[j].type === 'blockquote_open') {
          depth++;
        } else if (tokens[j].type === 'blockquote_close' && --depth === 0) {
          closeIndex = j;
          break;
        }
      }

      const bodyText =
        firstLineEnd === -1 ? '' : inline.content.slice(firstLineEnd + 1);
      const hasBody =
        !!bodyText.trim() || tokens.slice(i + 4, closeIndex).length > 0;
      const meta: Callout = {
        type,
        canonicalType,
        title,
        collapsed,
        hasBody,
      };
      open.meta = { ...open.meta, markdownCallout: meta };
      tokens[closeIndex].meta = {
        ...tokens[closeIndex].meta,
        markdownCallout: meta,
      };
      if (!bodyText.trim()) {
        tokens.splice(i + 1, 3);
        closeIndex -= 3;
      } else {
        const bodyBreak = inline.children?.findIndex(
          token => token.type === 'softbreak' || token.type === 'hardbreak'
        );
        inline.content = bodyText;
        if (bodyBreak !== undefined && bodyBreak >= 0 && inline.children) {
          inline.children = inline.children.slice(bodyBreak + 1);
        } else {
          const children: NonNullable<typeof inline.children> = [];
          inlineParser.parse(bodyText, state.md, state.env, children);
          inline.children = children;
        }
      }

      for (let j = i + 1; j < closeIndex; j++) {
        const children = tokens[j].children;
        if (tokens[j].type === 'inline' && children) {
          for (const child of children) {
            if (child.type === 'softbreak') {
              child.type = 'hardbreak';
            }
          }
        }
      }
    }
  });

  const renderOpen = md.renderer.rules.blockquote_open;
  const renderClose = md.renderer.rules.blockquote_close;

  md.renderer.rules.blockquote_open = (tokens, idx, options, env) => {
    const token = tokens[idx];
    const callout = token.meta?.markdownCallout as Callout | undefined;
    if (!callout) {
      return renderOpen
        ? renderOpen(tokens, idx, options, env, md.renderer)
        : md.renderer.renderToken(tokens, idx, options);
    }

    const isCollapsible = callout.collapsed && callout.hasBody;
    token.tag = isCollapsible ? 'details' : 'aside';
    token.attrJoin('class', 'markdown-callout callout');
    token.attrSet('data-callout', callout.type);
    token.attrSet('data-callout-type', callout.canonicalType);
    const tag = isCollapsible ? 'summary' : 'div';
    const title = md.renderer.renderInline(callout.title, options, env);
    return `${md.renderer.renderToken(
      tokens,
      idx,
      options
    )}<${tag} class="markdown-callout-title callout-title">${renderIcon(
      callout.canonicalType
    )}<span class="markdown-callout-title-text callout-title-text">${title}</span>${
      isCollapsible
        ? '<span class="markdown-callout-chevron callout-chevron" aria-hidden="true"></span>'
        : ''
    }</${tag}>\n<div class="markdown-callout-content callout-content">\n`;
  };

  md.renderer.rules.blockquote_close = (tokens, idx, options, env) => {
    const token = tokens[idx];
    if (!token.meta?.markdownCallout) {
      return renderClose
        ? renderClose(tokens, idx, options, env, md.renderer)
        : md.renderer.renderToken(tokens, idx, options);
    }

    const callout = token.meta.markdownCallout as Callout;
    token.tag = callout.collapsed && callout.hasBody
      ? 'details'
      : 'aside';
    return `</div>\n${md.renderer.renderToken(tokens, idx, options)}`;
  };
}
