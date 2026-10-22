import { strict as assert } from 'assert';
import MarkdownIt = require('markdown-it');
import type { CalloutAliases } from '../callout/markdown-it-callout';
import {
  DEFAULT_CALLOUT_ALIASES,
  DEFAULT_CUSTOM_CALLOUT_ALIASES,
  markdownItCallout,
  readBuiltinCalloutAliases,
} from '../callout/markdown-it-callout';

function build(
  aliases: CalloutAliases = DEFAULT_CALLOUT_ALIASES,
  options: { githubOnly?: boolean; aliasesEnabled?: boolean } = {}
): MarkdownIt {
  const md = new MarkdownIt();
  markdownItCallout(
    md,
    aliases,
    options.githubOnly ?? false,
    options.aliasesEnabled ?? true
  );
  return md;
}

suite('Markdown callout rendering', () => {
  test('keeps built-in alias names fixed while allowing alias values to be empty', () => {
    assert.deepEqual(
      readBuiltinCalloutAliases({ note: ' memo ', warning: '' }),
      {
        note: ' memo ',
        tip: 'hint',
        important: 'must',
        warning: '',
        caution: '!!!,danger',
      }
    );
  });

  test('renders typed callouts and preserves custom types', () => {
    const md = build();
    const standard = md.render('> [!info] Details\n> Body text\n');
    const custom = md.render('> [!my-custom-type] Custom\n> Body text\n');

    assert.ok(standard.includes('class="markdown-callout callout"'));
    assert.ok(standard.includes('data-callout="info"'));
    assert.ok(standard.includes('class="markdown-callout-title callout-title"'));
    assert.ok(standard.includes('Details'));
    assert.ok(standard.includes('Body text'));
    assert.ok(!standard.includes('[!info]'));
    assert.ok(custom.includes('data-callout="my-custom-type"'));
    assert.ok(custom.includes('Custom'));
  });

  test('resolves case-insensitive aliases while preserving the source identifier', () => {
    const md = build({
      ' Error ': [' X ', ' Failure '],
      Info: [' Information '],
    });
    const alias = md.render('> [! x ] Failed\n> Body\n');
    const differentlyCasedAlias = md.render('> [!INFORMATION]\n> Body\n');

    assert.ok(alias.includes('data-callout="x"'));
    assert.ok(alias.includes('data-callout-type="error"'));
    assert.ok(alias.includes('data-icon="x"'));
    assert.ok(differentlyCasedAlias.includes('data-callout="INFORMATION"'));
    assert.ok(differentlyCasedAlias.includes('data-callout-type="info"'));
  });

  test('splits comma-separated aliases and trims surrounding whitespace', () => {
    const md = build({ note: ' information, memo ' });

    assert.ok(
      md.render('> [! INFORMATION ]\n> Body\n').includes(
        'data-callout-type="note"'
      )
    );
    assert.ok(
      md.render('> [!memo]\n> Body\n').includes('data-callout-type="note"')
    );
  });

  test('resolves punctuation aliases without conflating different values', () => {
    const md = build({
      warning: '!,warn,attention,!!!',
      caution: '!!!,danger',
      waitting: '==',
      faq: 'help,question,?',
    });
    const warning = md.render('> [!!]\n> Warning.\n');
    const caution = md.render('> [!!!!]\n> Caution.\n');
    const waiting = md.render('> [!==]\n> Waiting.\n');
    const faq = md.render('> [!?]\n> FAQ.\n');

    assert.ok(warning.includes('data-callout-type="warning"'));
    assert.ok(caution.includes('data-callout-type="caution"'));
    assert.ok(waiting.includes('data-callout-type="waitting"'));
    assert.ok(faq.includes('data-callout-type="faq"'));
  });

  test('prefers caution for the shared legacy warning alias', () => {
    const md = build({
      warning: '!,warn,attention,!!!',
      caution: '!!!,danger',
    });

    assert.ok(
      md.render('> [!!]\n> Warning.\n').includes(
        'data-callout-type="warning"'
      )
    );
    assert.ok(
      md.render('> [!!!!]\n> Caution.\n').includes(
        'data-callout-type="caution"'
      )
    );
  });

  test('uses the configured workflow aliases by default', () => {
    const md = build();

    assert.deepEqual(DEFAULT_CUSTOM_CALLOUT_ALIASES.faq, ['help', 'question', '?']);
    assert.deepEqual(DEFAULT_CUSTOM_CALLOUT_ALIASES.waitting, ['==']);
    assert.ok(md.render('> [!?]\n> FAQ.\n').includes('data-callout-type="faq"'));
    assert.ok(
      md.render('> [!==]\n> Waiting.\n').includes(
        'data-callout-type="waitting"'
      )
    );
    assert.ok(
      md.render('> [! =]\n> Not an alias.\n').includes(
        'data-callout-type="="'
      )
    );
  });

  test('does not restore aliases removed from the settings map', () => {
    const html = build({ done: '' }).render('> [!complete]\n> Body\n');

    assert.ok(html.includes('data-callout-type="complete"'));
    assert.ok(!html.includes('data-callout-type="done"'));
  });

  test('renders only GitHub-supported alerts in GitHub-only mode', () => {
    const md = build({}, { githubOnly: true });
    for (const type of ['note', 'tip', 'important', 'warning', 'caution']) {
      assert.ok(
        md.render(`> [!${type}]\n> Body\n`).includes(
          'class="markdown-callout callout"'
        )
      );
    }

    const unsupported = md.render('> [!danger]\n> Body\n');
    assert.ok(unsupported.includes('<blockquote>'));
    assert.ok(!unsupported.includes('markdown-callout'));
    assert.ok(
      md
        .render('> [!info]\n> Body\n')
        .includes('data-callout-type="note"')
    );
  });

  test('does not resolve aliases in GitHub-only mode', () => {
    const md = build(
      { note: ['info'] },
      { githubOnly: true, aliasesEnabled: true }
    );

    assert.ok(
      md.render('> [!INFO]\n> Body\n').includes('data-callout-type="note"')
    );
    assert.ok(md.render('> [!X]\n> Body\n').includes('<blockquote>'));
    assert.ok(md.render('> [!NOTE]\n> Body\n').includes('data-callout="NOTE"'));
  });

  test('applies aliases only when enabled in extended mode', () => {
    const aliases = { error: ['x'] };
    const withoutAliases = build(aliases, { aliasesEnabled: false }).render(
      '> [!X]\n> Failed.\n'
    );
    const withAliases = build(aliases, { aliasesEnabled: true }).render(
      '> [!X]\n> Failed.\n'
    );

    assert.ok(withoutAliases.includes('data-callout-type="x"'));
    assert.ok(!withoutAliases.includes('data-callout-type="error"'));
    assert.ok(withAliases.includes('data-callout-type="error"'));
  });

  test('provides common aliases and workflow presets', () => {
    const md = build();
    for (const [type, canonical] of [
      ['X', 'error'],
      ['!', 'warning'],
      ['warn', 'warning'],
      ['attention', 'warning'],
      ['!!!', 'caution'],
      ['danger', 'caution'],
      ['must', 'important'],
      ['hint', 'tip'],
      ['success', 'done'],
      ['>>', 'doing'],
      ['==', 'waitting'],
      ['√', 'done'],
      ['V', 'done'],
    ]) {
      assert.ok(
        md
          .render(`> [!${type}]\n> Content.\n`)
          .includes(`data-callout-type="${canonical}"`),
        `${type} should resolve to ${canonical}`
      );
    }
    assert.ok(md.render('> [!giveup]\n> Content.\n').includes('data-icon="ban"'));
  });

  test('renders icons through an overridable CSS mask', () => {
    const html = build().render('> [!info]\n> Body\n');

    assert.ok(html.includes('class="markdown-callout-icon callout-icon"'));
    assert.ok(html.includes('--markdown-callout-default-icon: url('));
    assert.ok(html.includes('data:image/svg+xml,'));
  });

  test('uses distinct icons for different callout meanings', () => {
    const md = build();

    assert.ok(md.render('> [!tip]\n> Body\n').includes('data-icon="lightbulb"'));
    assert.ok(md.render('> [!question]\n> Body\n').includes('data-icon="help"'));
    assert.ok(md.render('> [!warning]\n> Body\n').includes('data-icon="warning"'));
    assert.ok(md.render('> [!important]\n> Body\n').includes('data-icon="star"'));
    assert.ok(md.render('> [!caution]\n> Body\n').includes('data-icon="x"'));
  });

  test('preserves Markdown formatting in callout titles and bodies', () => {
    const html = build().render(
      '> [!info] **Important**\n> Body with **emphasis**.\n'
    );

    assert.ok(html.includes('<strong>Important</strong>'));
    assert.ok(html.includes('Body with <strong>emphasis</strong>.'));
  });

  test('renders source body lines separately and supports nested callouts', () => {
    const html = build().render(
      '> [!warning]- Details\n> First line\n> Second line\n'
    );
    const nested = build().render(
      '> [!note] Outer\n> > [!tip] Inner\n> > Text\n'
    );

    assert.ok(html.includes('First line<br>\nSecond line'));
    assert.ok(nested.includes('data-callout="note"'));
    assert.ok(nested.includes('data-callout="tip"'));
  });

  test('renders collapsed callouts as native disclosures', () => {
    const html = build().render('> [!info]- Details\n> Body text\n');
    const separatedBody = build().render(
      '> [!info]- Details\n>\n> Body text\n'
    );

    assert.ok(html.includes('<details class="markdown-callout callout"'));
    assert.ok(
      html.includes('<summary class="markdown-callout-title callout-title"')
    );
    assert.ok(html.includes('class="markdown-callout-chevron callout-chevron"'));
    assert.ok(!html.includes('<details open'));
    assert.ok(html.includes('Details'));
    assert.ok(html.includes('Body text'));
    assert.ok(separatedBody.includes('<details class="markdown-callout callout"'));
    assert.ok(separatedBody.includes('Body text'));
  });

  test('renders title-only collapsed callouts without disclosure interaction', () => {
    const html = build().render('> [!info]- Details\n');

    assert.ok(html.includes('<aside class="markdown-callout callout"'));
    assert.ok(html.includes('<div class="markdown-callout-title callout-title"'));
    assert.ok(!html.includes('<details'));
    assert.ok(!html.includes('<summary'));
    assert.ok(!html.includes('markdown-callout-chevron'));
    assert.ok(html.includes('Details'));
  });

  test('uses the callout type as the title when none is provided', () => {
    const html = build().render('> [!info]\n> Body text\n');

    assert.ok(html.includes('markdown-callout-title-text callout-title-text">Info</span>'));
    assert.ok(html.includes('Body text'));
  });

  test('leaves ordinary, malformed, and multiline blockquotes unchanged', () => {
    const md = build();
    const ordinary = md.render('> A regular quote.\n');
    const multiline = md.render('> First quote line\n> Second quote line\n');
    const malformed = md.render('> [!info]without a title separator\n');

    assert.ok(ordinary.includes('<blockquote>'));
    assert.ok(!ordinary.includes('markdown-callout'));
    assert.ok(multiline.includes('First quote line\nSecond quote line'));
    assert.ok(!multiline.includes('First quote line<br>'));
    assert.ok(malformed.includes('[!info]without a title separator'));
    assert.ok(!malformed.includes('markdown-callout'));
  });
});
