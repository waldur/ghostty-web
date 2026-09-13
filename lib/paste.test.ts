/**
 * Paste Encoding Tests
 *
 * Tests for encodePaste, which fences pasted text for bracketed paste mode
 * and keeps clipboard content from closing the fence early.
 */

import { describe, expect, test } from 'bun:test';
import { encodePaste, stripPasteEnd } from './paste';

describe('encodePaste', () => {
  test('passes text through unchanged without bracketed paste', () => {
    expect(encodePaste('ls\nid\n', false)).toBe('ls\nid\n');
  });

  test('fences text in bracketed paste mode', () => {
    expect(encodePaste('hello', true)).toBe('\x1b[200~hello\x1b[201~');
  });

  test('removes an end marker hidden in the pasted text', () => {
    expect(encodePaste('ls\x1b[201~id\r', true)).toBe('\x1b[200~lsid\r\x1b[201~');
  });
});

describe('stripPasteEnd', () => {
  test('removes every end marker', () => {
    expect(stripPasteEnd('a\x1b[201~b\x1b[201~c')).toBe('abc');
  });

  test('does not let removal reassemble a marker', () => {
    expect(stripPasteEnd('\x1b[20\x1b[201~1~id')).toBe('id');
  });

  test('leaves other escape sequences alone', () => {
    expect(stripPasteEnd('\x1b[31mred\x1b[0m')).toBe('\x1b[31mred\x1b[0m');
  });
});
