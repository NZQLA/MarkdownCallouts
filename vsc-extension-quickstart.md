# Extension development

## Run and debug

- Press **F5** to open an Extension Development Host with this extension loaded.
- Open a Markdown preview to test callout rendering.
- Use **Markdown Callouts: Add Callout to Selection** and **Markdown Callouts: Remove Callout from Selection** to test the editing commands.
- Set breakpoints in `src/` and use the Debug Console to inspect extension output.

## Build and test

```sh
npm install
npm run compile
npm run lint
npm test
```

The extension tests run in a VS Code test host. Test files are in `src/test/`.

## Package and publish

See the [VS Code publishing guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) before packaging or publishing.

### Build the extension
```
npx @vscode/vsce package
```