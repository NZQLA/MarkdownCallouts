import * as vscode from 'vscode';
import type MarkdownIt = require('markdown-it');
import type {
  BuiltinCalloutAliases,
  CalloutAliases,
} from './callout/markdown-it-callout';
import {
  combineCalloutAliases,
  DEFAULT_BUILTIN_CALLOUT_ALIASES,
  DEFAULT_CUSTOM_CALLOUT_ALIASES,
  markdownItCallout,
  readBuiltinCalloutAliases,
} from './callout/markdown-it-callout';
import activateCalloutCommands from './callout/callout-commands';

export function activate(context: vscode.ExtensionContext) {
  activateCalloutCommands(context);
  return {
    extendMarkdownIt(md: MarkdownIt): MarkdownIt {
      const config = vscode.workspace.getConfiguration('markdownCallouts');
      const aliases = combineCalloutAliases(
        readBuiltinCalloutAliases(
          config.get<BuiltinCalloutAliases>(
            'aliases.builtin',
            DEFAULT_BUILTIN_CALLOUT_ALIASES
          )
        ),
        config.get<CalloutAliases>(
          'aliases.custom',
          DEFAULT_CUSTOM_CALLOUT_ALIASES
        )
      );
      markdownItCallout(
        md,
        aliases,
        config.get<boolean>('githubOnly', false),
        config.get<boolean>('aliases.enabled', true)
      );
      return md;
    },
  };
}

export function deactivate() {}
