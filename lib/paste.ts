/**
 * Paste encoding
 *
 * Bracketed paste (DEC mode 2004) fences pasted text between ESC[200~ and
 * ESC[201~ so the application can tell pasted data from typed input and
 * does not execute it line by line.
 */

const PASTE_START = '\x1b[200~';
const PASTE_END = '\x1b[201~';

/**
 * Remove every end-of-paste marker from text that is about to be pasted.
 *
 * Clipboard content containing ESC[201~ would close the bracket early, and
 * whatever follows would reach the application as if it had been typed:
 * the paste injection attack. Native Ghostty never trusts such a paste
 * (see `isSafe` in src/input/paste.zig). Removal repeats until no marker is
 * left, so one split around another cannot be reassembled by a single pass.
 */
export function stripPasteEnd(text: string): string {
  let result = text;
  while (result.includes(PASTE_END)) {
    result = result.split(PASTE_END).join('');
  }
  return result;
}

/**
 * Encode text for pasting into the PTY.
 *
 * @param text - The pasted text
 * @param bracketed - Whether the application enabled bracketed paste mode
 */
export function encodePaste(text: string, bracketed: boolean): string {
  if (!bracketed) {
    return text;
  }
  return PASTE_START + stripPasteEnd(text) + PASTE_END;
}
