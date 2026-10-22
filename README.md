# Markdown Callouts

Flexible callout rendering and editing for the Visual Studio Code Markdown preview.

> This is an independent extension. It is not affiliated with or endorsed by the Foam project or its maintainers.

## Features

- Render GitHub-style and custom callout types.
- Add aliases, including punctuation aliases, and choose between extended and GitHub-only rendering.
- Use foldable (`-`) and nested callouts.
- Customize colors and icons with Markdown preview CSS.
- Add or remove callout markup around selected Markdown text.

## Syntax

```markdown
> [!note] A title
> Callout content.

> [!idea]- Foldable idea
> This callout starts collapsed.

> [!question] Nested example
> > [!tip] Inner callout
> > Callouts can be nested.
```

If no title is supplied, the callout type is used as the title. A plain blockquote that does not begin with a callout marker is left unchanged.

The default extended mode recognizes custom types and aliases. Set `markdownCallouts.githubOnly` to `true` to render only `note`, `tip`, `important`, `warning`, and `caution`.

## Commands

- **Markdown Callouts: Add Callout to Selection** wraps selected lines using `markdownCallouts.defaultType` (default: `info`).
- **Markdown Callouts: Remove Callout from Selection** removes the marker and quote prefixes from selected callout lines.

## Aliases

Built-in aliases can be changed in `markdownCallouts.aliases.builtin`. Custom types and aliases are configured in `markdownCallouts.aliases.custom`:

```json
{
  "markdownCallouts.aliases.custom": {
    "idea": "thought,proposal",
    "done": "complete,√"
  }
}
```

Alias matching ignores case and surrounding whitespace. Comma-separated values are supported. Set `markdownCallouts.aliases.enabled` to `false` to disable aliases in extended mode.

## Styling

Built-in types have distinct colors. Custom callouts use a blue default and can be styled in a workspace stylesheet configured through VS Code's `markdown.styles` setting:

```css
.markdown-callout[data-callout="idea"] {
  --callout-color: 244, 114, 182;
}
```

The `--callout-color` value uses comma-separated RGB components. To change an icon, set `--callout-icon` on `.markdown-callout-icon` to a CSS mask URL. Custom styles can target `.markdown-callout[data-callout="your-type"]`.

## Development

```sh
npm install
npm run compile
npm run lint
npm test
```

Callout rendering and selection-editing code in this extension is adapted from the MIT-licensed Foam project. See [LICENSE](./LICENSE) and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for attribution and license details.
