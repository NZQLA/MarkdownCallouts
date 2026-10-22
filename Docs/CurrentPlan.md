# Markdown Callouts 当前功能说明

本文记录新扩展目前已实现的 Callout 行为、设置和代码位置。它是现状说明，不代表扩展已经打包或发布。

## 功能概览

扩展通过 VS Code 的 Markdown 扩展接口，为 Markdown 预览注册 `markdown-it` 插件和预览样式。Callout 内容仍以标准 Markdown 引用块编写；普通引用块不受影响。

```markdown
> [!note] 重要信息
> 这里是正文，可以使用 **Markdown 格式**。
> 连续的引用行会分行显示。

> [!idea]- 可折叠的想法
> 初始状态为折叠，点击标题可展开。

> [!question] 嵌套示例
> > [!tip] 内层提示
> > Callout 可以嵌套。
```

- 标记格式为 `> [!类型]`，可选标题写在 `]` 后面。
- 未填写标题时，标题取 Callout 类型名称。
- 类型和别名匹配时会忽略大小写和首尾空白，并支持 Unicode 规范化。
- 任意自定义类型都可以渲染；未识别的类型在扩展模式下也会保留。
- Callout 正文每个源 Markdown 行会单独换行；普通引用块保留 Markdown 默认的换行行为。

## 类型、模式与别名

默认使用扩展模式：GitHub 类型、预设类型和自定义类型均可渲染。将 `markdownCallouts.githubOnly` 设为 `true` 后，只处理 GitHub 的五种类型：`note`、`tip`、`important`、`warning`、`caution`；`info` 也作为 `note` 的兼容写法。其他类型保持普通引用块。

别名默认启用，可通过 `markdownCallouts.aliases.enabled` 关闭扩展模式下的别名解析。GitHub-only 模式不应用别名；其中 `info` 到 `note` 的兼容映射仍然有效。

### 内置类型默认别名

内置类型名称固定，可用 `markdownCallouts.aliases.builtin` 修改各自的逗号分隔别名：

| 类型 | 默认别名 |
| --- | --- |
| `note` | `info` |
| `tip` | `hint` |
| `important` | `must` |
| `warning` | `!`、`warn`、`attention` |
| `caution` | `!!!`、`danger` |

如果 `warning` 与 `caution` 同时配置 `!!!`，此别名优先解析为 `caution`。

### 自定义类型预设

`markdownCallouts.aliases.custom` 接受“类型名到逗号分隔别名”的对象。默认预设包括：

| 类型 | 默认别名 |
| --- | --- |
| `abstract` | `summary`、`tldr` |
| `doing` | `>>` |
| `done` | `success`、`√`、`V` |
| `error` | `x`、`fail`、`failure` |
| `faq` | `help`、`question`、`?` |
| `quote` | `cite` |
| `waitting` | `==` |
| `bug`、`example`、`giveup`、`idea`、`missing`、`todo` | 无默认别名 |

示例：

```json
{
  "markdownCallouts.aliases.custom": {
    "idea": "thought,proposal",
    "done": "complete,√"
  }
}
```

自定义类型可新增、修改或删除；别名既可使用多个逗号分隔值，也可留空。

## 折叠与嵌套

在 Callout 标记的 `]` 后添加 `-`，例如 `> [!warning]- 标题`，正文存在时会以折叠状态显示，并使用原生 HTML `<details>` / `<summary>` 交互。只有标题而没有正文时，不显示无效的折叠控件。嵌套 Callout 各自按同一规则渲染。

## 样式与图标

扩展通过 [callouts.css](../media/callouts.css) 提供颜色、边框、标题、图标和折叠状态样式。样式使用 VS Code 预览主题变量；自定义类型默认使用蓝色。

Callout 根元素保留 `.callout` 类，同时使用 `.markdown-callout`；`data-callout` 保存文档中写的原类型，`data-callout-type` 保存别名解析后的规范类型，便于按原类型或规范类型编写 CSS。

可通过 VS Code 的 `markdown.styles` 加载工作区 CSS，覆盖颜色或图标：

```css
.markdown-callout[data-callout="idea"] {
  --callout-color: 244, 114, 182;
}

.markdown-callout[data-callout="idea"] .markdown-callout-icon {
  --callout-icon: url("data:image/svg+xml;base64,...");
}
```

`--callout-color` 使用逗号分隔的 RGB 分量；`--callout-icon` 接受 CSS mask 图片 URL，例如 SVG data URL。扩展内置 SVG 图标作为默认值，不依赖网络图片。

## 编辑命令

- **Markdown Callouts: Add Callout to Selection**：将选中的 Markdown 行包成 `> [!类型]` 引用块；类型来自 `markdownCallouts.defaultType`，默认是 `info`。会保留文件原有换行符。
- **Markdown Callouts: Remove Callout from Selection**：选中完整 Callout 后，移除首行标记和各行引用前缀，保留标题及正文。

若没有活动编辑器、没有选择文本、选区不是有效 Callout，命令会显示提示；VS Code 编辑失败时会显示错误。命令未绑定默认快捷键。

## 设置一览

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| `markdownCallouts.githubOnly` | `false` | 仅渲染 GitHub 类型及 `info` 兼容写法。 |
| `markdownCallouts.defaultType` | `"info"` | “Add Callout to Selection”插入的类型。 |
| `markdownCallouts.aliases.enabled` | `true` | 在扩展模式中启用别名解析。 |
| `markdownCallouts.aliases.builtin` | 见上表 | 固定内置类型的别名。 |
| `markdownCallouts.aliases.custom` | 见上表 | 自定义类型和别名。 |

## 代码位置

- [Markdown-it 渲染与别名解析](../src/callout/markdown-it-callout.ts)
- [选区文本转换](../src/callout/callout-edit.ts)
- [VS Code 命令注册](../src/callout/callout-commands.ts)
- [扩展激活、设置读取和 Markdown 插件接入](../src/extension.ts)
- [扩展清单及设置定义](../package.json)
- [预览样式](../media/callouts.css)
- [第三方代码与许可证说明](../THIRD_PARTY_NOTICES.md)

