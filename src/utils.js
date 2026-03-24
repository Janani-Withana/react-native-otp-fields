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
 * @param {{ nativeEvent: { key: string } }} e
 * @returns {boolean}
 */
export function isBackspaceKeyPress(e) {
  const key = e.nativeEvent.key;
  return key === 'Backspace' || key === 'BackSpace';
}
