# Markdown Callouts: Current Features

This document describes the Callout behavior, settings, and code locations that are currently implemented in the extension. It describes the current state; it does not mean that the extension has been packaged or released.

## Feature overview

The extension uses the VS Code Markdown extension API to add a `markdown-it` plugin and preview styles. Callout content is written as standard Markdown blockquotes. Regular blockquotes are not affected.

```markdown
> [!note] Important information
> This is the body. You can use **Markdown formatting**.
> Each source line in a Callout is shown on a separate line.

> [!idea]- A collapsible idea
> It starts collapsed. Click the title to expand it.

> [!question] Nested example
> > [!tip] Inner tip
> > Callouts can be nested.
```

- The marker format is `> [!type]`. An optional title can be added after `]`.
- If no title is provided, the Callout type name is used as the title.
- Type and alias matching ignores letter case and spaces at the start or end. Unicode text is normalized too.
- Any custom type can be rendered. In extension mode, unknown types are kept as Callouts.
- Each source Markdown line in a Callout body starts on a new line. Regular blockquotes keep Markdown's default line-break behavior.

## Types, modes, and aliases

Extension mode is enabled by default. It can render GitHub types, preset types, and custom types. When `markdownCallouts.githubOnly` is set to `true`, only the five GitHub types are handled: `note`, `tip`, `important`, `warning`, and `caution`. `info` is also accepted as another name for `note`. Other types remain regular blockquotes.

Aliases are enabled by default. You can set `markdownCallouts.aliases.enabled` to `false` to turn off alias lookup in extension mode. Aliases are not used in GitHub-only mode. The `info` to `note` compatibility mapping still works in that mode.

### Default aliases for built-in types

Built-in type names cannot be changed. You can change their comma-separated aliases with `markdownCallouts.aliases.builtin`:

| Type | Default aliases |
| --- | --- |
| `note` | `info` |
| `tip` | `hint` |
| `important` | `must` |
| `warning` | `!`, `warn`, `attention` |
| `caution` | `!!!`, `danger` |

If both `warning` and `caution` use `!!!`, this alias is treated as `caution`.

### Custom type presets

`markdownCallouts.aliases.custom` accepts an object that maps type names to comma-separated aliases. The default presets are:

| Type | Default aliases |
| --- | --- |
| `abstract` | `summary`, `tldr` |
| `doing` | `>>` |
| `done` | `success`, `√`, `V` |
| `error` | `x`, `fail`, `failure` |
| `faq` | `help`, `question`, `?` |
| `quote` | `cite` |
| `waitting` | `==` |
| `bug`, `example`, `giveup`, `idea`, `missing`, `todo` | No default aliases |

Example:

```json
{
  "markdownCallouts.aliases.custom": {
    "idea": "thought,proposal",
    "done": "complete,√"
  }
}
```

You can add, change, or remove custom types. An alias can have several comma-separated values, or it can be empty.

## Collapsible and nested Callouts

Add `-` after `]` in the Callout marker, for example `> [!warning]- Title`. If the body is not empty, the Callout starts collapsed and uses native HTML `<details>` and `<summary>` elements for interaction. If there is a title but no body, no broken collapse control is shown. Nested Callouts follow the same rules.

## Styles and icons

The extension uses [callouts.css](../media/callouts.css) to set colors, borders, titles, icons, and collapsed styles. The styles use VS Code preview theme variables. Custom types are blue by default.

The Callout root element keeps the `.callout` class and also uses `.markdown-callout`. `data-callout` stores the original type from the document. `data-callout-type` stores the standard type after alias lookup. This lets you write CSS for either the original type or the standard type.

You can load workspace CSS through VS Code's `markdown.styles` setting to change colors or icons:

```css
.markdown-callout[data-callout="idea"] {
  --callout-color: 244, 114, 182;
}

.markdown-callout[data-callout="idea"] .markdown-callout-icon {
  --callout-icon: url("data:image/svg+xml;base64,...");
}
```

`--callout-color` uses comma-separated RGB values. `--callout-icon` accepts a CSS mask image URL, such as an SVG data URL. The extension includes default SVG icons, so it does not need images from the internet.

## Editing commands

- **Markdown Callouts: Add Callout to Selection**: Wraps the selected Markdown lines in a `> [!type]` blockquote. The type comes from `markdownCallouts.defaultType`, which is `info` by default. The command keeps the file's existing line endings.
- **Markdown Callouts: Remove Callout from Selection**: Removes the first-line marker and the blockquote prefixes from each line when a complete Callout is selected. The title and body are kept.

If there is no active editor, no text is selected, or the selection is not a valid Callout, the command shows a message. If VS Code cannot apply the edit, it shows an error. The commands do not have default keyboard shortcuts.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `markdownCallouts.githubOnly` | `false` | Render only GitHub types and the compatible `info` type. |
| `markdownCallouts.defaultType` | `"info"` | The type inserted by “Add Callout to Selection”. |
| `markdownCallouts.aliases.enabled` | `true` | Enable alias lookup in extension mode. |
| `markdownCallouts.aliases.builtin` | See table above | Aliases for the fixed built-in types. |
| `markdownCallouts.aliases.custom` | See table above | Custom types and aliases. |

## Code locations

- [Markdown-it rendering and alias lookup](../src/callout/markdown-it-callout.ts)
- [Selected text conversion](../src/callout/callout-edit.ts)
- [VS Code command registration](../src/callout/callout-commands.ts)
- [Extension activation, settings, and Markdown plugin setup](../src/extension.ts)
- [Extension manifest and setting definitions](../package.json)
- [Preview styles](../media/callouts.css)
- [Third-party code and license information](../THIRD_PARTY_NOTICES.md)
