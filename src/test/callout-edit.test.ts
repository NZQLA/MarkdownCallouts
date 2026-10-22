import { strict as assert } from 'assert';
import {
  getCalloutTypeForCurrentMode,
  removeCalloutMarkup,
  wrapSelectionInCallout,
} from '../callout/callout-edit';

suite('Callout editing', () => {
  test('wraps selected lines and preserves the line ending', () => {
    assert.equal(
      wrapSelectionInCallout('First line\r\nSecond line\r\n', 'info', '\r\n'),
      '> [!info]\r\n> First line\r\n> Second line\r\n'
    );
  });

  test('does not wrap empty selected text', () => {
    assert.equal(wrapSelectionInCallout('', 'info', '\n'), null);
  });

  test('removes callout syntax while retaining title and body text', () => {
    assert.equal(
      removeCalloutMarkup(
        '> [!warning]- A title\n> Body line\n> Second line\n'
      ),
      'A title\nBody line\nSecond line\n'
    );
  });

  test('leaves ordinary blockquotes unchanged', () => {
    assert.equal(removeCalloutMarkup('> Ordinary quote\n> More quote\n'), null);
  });

  test('falls back to info when the configured type is unavailable', () => {
    const aliases = { note: 'memo', warning: 'warn' };

    assert.equal(getCalloutTypeForCurrentMode('warn', true, true, aliases), 'info');
    assert.equal(getCalloutTypeForCurrentMode('memo', false, false, aliases), 'info');
    assert.equal(getCalloutTypeForCurrentMode('warning', true, false, aliases), 'warning');
    assert.equal(getCalloutTypeForCurrentMode('memo', false, true, aliases), 'memo');
  });
});
