/**
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function clampOtpValue(text, length) {
  if (typeof text !== 'string') {
    return '';
  }
  return text.replace(/\s/g, '').slice(0, length);
}

/**
 * Normalizes OTP input: optional paste transform, whitespace strip, optional digits-only, truncate.
 * @param {string} text
 * @param {number} length
 * @param {{ digitsOnly?: boolean, pasteTransformer?: (s: string) => string }} [options]
 * @returns {string}
 */
export function sanitizeOtpInput(text, length, options = {}) {
  const { digitsOnly = false, pasteTransformer } = options;
  let t = typeof text === 'string' ? text : '';
  if (pasteTransformer) {
    t = pasteTransformer(t);
  }
  t = t.replace(/\s/g, '');
  if (digitsOnly) {
    t = t.replace(/\D/g, '');
  }
  return t.slice(0, length);
}

/**
 * For controlled `value` / initial state: no pasteTransformer (that applies to user paste only).
 * @param {string} text
 * @param {number} length
 * @param {boolean} [digitsOnly]
 * @returns {string}
 */
export function normalizeStoredOtpValue(text, length, digitsOnly = false) {
  let t = clampOtpValue(text, length);
  if (digitsOnly) {
    t = t.replace(/\D/g, '').slice(0, length);
  }
  return t;
}

/**
 * @param {{ nativeEvent: { key: string } }} e
 * @returns {boolean}
 */
export function isBackspaceKeyPress(e) {
  const key = e.nativeEvent.key;
  return key === 'Backspace' || key === 'BackSpace';
}
