import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { clampOtpValue, isBackspaceKeyPress } from './utils';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').TextStyle} TextStyle
 */

/**
 * @typedef {Object} OTPInputProps
 * @property {number} [length]
 * @property {string} [value]
 * @property {string} [defaultValue]
 * @property {(value: string) => void} [onChangeText]
 * @property {(value: string) => void} [onComplete]
 * @property {boolean} [autoFocus]
 * @property {boolean} [editable]
 * @property {boolean} [secureTextEntry]
 * @property {import('react-native').TextInputProps['keyboardType']} [keyboardType]
 * @property {string} [placeholder]
 * @property {boolean} [hasError]
 * @property {string} [testID]
 * @property {ViewStyle} [containerStyle]
 * @property {ViewStyle} [cellStyle]
 * @property {ViewStyle} [focusedCellStyle]
 * @property {ViewStyle} [filledCellStyle]
 * @property {ViewStyle} [errorCellStyle]
 * @property {TextStyle} [textStyle]
 */

/**
 * @param {OTPInputProps} props
 */
export function OTPInput({
  length = 6,
  value,
  defaultValue = '',
  onChangeText,
  onComplete,
  autoFocus = false,
  editable = true,
  secureTextEntry = false,
  keyboardType = 'number-pad',
  placeholder = '',
  hasError = false,
  testID,
  containerStyle,
  cellStyle,
  focusedCellStyle,
  filledCellStyle,
  errorCellStyle,
  textStyle,
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    clampOtpValue(defaultValue, length)
  );
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputRefs = useRef(/** @type {Array<import('react-native').TextInput | null>} */ ([]));
  const lastCompleteRef = useRef(/** @type {string | null} */ (null));

  const currentValue = isControlled
    ? clampOtpValue(value ?? '', length)
    : internalValue;

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  useEffect(() => {
    if (!autoFocus) {
      return undefined;
    }
    const id = requestAnimationFrame(() => {
      inputRefs.current[0]?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [autoFocus]);

  const cells = useMemo(() => {
    return Array.from({ length }, (_, i) => currentValue[i] ?? '');
  }, [currentValue, length]);

  const updateValue = useCallback(
    (nextRaw) => {
      const cleaned = clampOtpValue(nextRaw, length);

      if (!isControlled) {
        setInternalValue(cleaned);
      }

      onChangeText?.(cleaned);

      if (cleaned.length === length) {
        if (lastCompleteRef.current !== cleaned) {
          lastCompleteRef.current = cleaned;
          onComplete?.(cleaned);
        }
      } else {
        lastCompleteRef.current = null;
      }
    },
    [isControlled, length, onChangeText, onComplete]
  );

  const focusIndex = useCallback(
    (index) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus();
        setFocusedIndex(index);
      }
    },
    [length]
  );

  const handleChange = useCallback(
    (text, index) => {
      const cleaned = text.replace(/\s/g, '');

      if (cleaned.length > 1) {
        const next = clampOtpValue(cleaned, length);
        updateValue(next);
        focusIndex(Math.min(next.length, length - 1));
        return;
      }

      const chars = currentValue.split('');
      chars[index] = cleaned;
      const next = chars.join('').slice(0, length);

      updateValue(next);

      if (cleaned && index < length - 1) {
        focusIndex(index + 1);
      }
    },
    [currentValue, focusIndex, length, updateValue]
  );

  const handleKeyPress = useCallback(
    (e, index) => {
      if (!isBackspaceKeyPress(e)) {
        return;
      }

      if (cells[index]) {
        const chars = currentValue.split('');
        chars[index] = '';
        updateValue(chars.join(''));
        return;
      }

      if (index > 0) {
        const chars = currentValue.split('');
        chars[index - 1] = '';
        updateValue(chars.join(''));
        focusIndex(index - 1);
      }
    },
    [cells, currentValue, focusIndex, updateValue]
  );

  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const isFilled = Boolean(cells[index]);

        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={cells[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            maxLength={length}
            keyboardType={keyboardType}
            editable={editable}
            secureTextEntry={secureTextEntry}
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
            autoCorrect={false}
            spellCheck={false}
            selectTextOnFocus
            caretHidden={false}
            importantForAutofill="yes"
            style={[
              styles.cell,
              cellStyle,
              isFocused && styles.focusedCell,
              isFocused && focusedCellStyle,
              isFilled && filledCellStyle,
              hasError && styles.errorCell,
              hasError && errorCellStyle,
              textStyle,
            ]}
            placeholder={placeholder}
            placeholderTextColor="#999"
            testID={testID ? `${testID}-cell-${index}` : undefined}
            accessibilityLabel={
              testID ? `${testID} digit ${index + 1} of ${length}` : undefined
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
  },
  focusedCell: {
    borderColor: '#101828',
  },
  errorCell: {
    borderColor: '#F04438',
  },
});
