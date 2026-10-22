import { strict as assert } from 'assert';
import * as vscode from 'vscode';
import {
  ADD_CALLOUT_COMMAND,
  REMOVE_CALLOUT_COMMAND,
} from '../callout/callout-commands';

suite('Callout editor commands', () => {
  test('adds the default callout around selected lines', async () => {
    const document = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: 'First line\nSecond line',
    });
    const editor = await vscode.window.showTextDocument(document);
    editor.selection = new vscode.Selection(0, 0, 1, 4);

    await vscode.commands.executeCommand(ADD_CALLOUT_COMMAND);

    assert.equal(
      editor.document.getText(),
      '> [!info]\n> First line\n> Second line'
    );
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('removes callout syntax from selected lines', async () => {
    const document = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: '> [!warning] Title\n> First line\n> Second line',
    });
    const editor = await vscode.window.showTextDocument(document);
    editor.selection = new vscode.Selection(0, 0, 2, 13);

    await vscode.commands.executeCommand(REMOVE_CALLOUT_COMMAND);

    assert.equal(
      editor.document.getText(),
      'Title\nFirst line\nSecond line'
    );
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });
});
