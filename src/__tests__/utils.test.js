import { clampOtpValue, sanitizeOtpInput } from '../utils';

describe('clampOtpValue', () => {
  it('strips whitespace and truncates', () => {
    expect(clampOtpValue('  12 34 56  ', 6)).toBe('123456');
    expect(clampOtpValue('123456789', 6)).toBe('123456');
  });

  it('handles non-strings', () => {
    expect(clampOtpValue(/** @type {any} */ (null), 6)).toBe('');
  });
});

describe('sanitizeOtpInput', () => {
  it('applies pasteTransformer and digitsOnly', () => {
    const out = sanitizeOtpInput('12-34-56', 6, {
      digitsOnly: true,
      pasteTransformer: (t) => t.replace(/-/g, ''),
    });
    expect(out).toBe('123456');
  });
});
