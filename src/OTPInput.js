import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  isBackspaceKeyPress,
  normalizeStoredOtpValue,
  sanitizeOtpInput,
} from './utils';

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
 * @property {number} [gap]
 * @property {number} [cellWidth]
 * @property {number} [cellHeight]
 * @property {number} [borderRadius]
 * @property {number} [borderWidth]
 * @property {string} [borderColor]
 * @property {string} [backgroundColor]
 * @property {string} [textColor]
 * @property {string} [placeholderTextColor]
 * @property {string} [focusedBorderColor]
 * @property {string} [focusedBackgroundColor]
 * @property {string} [filledBorderColor]
 * @property {string} [filledBackgroundColor]
 * @property {string} [errorBorderColor]
 * @property {number} [fontSize]
 * @property {string} [fontFamily]
 * @property {boolean} [caretHidden]
 * @property {boolean} [digitsOnly]
 * @property {(pasted: string) => string} [pasteTransformer]
 * @property {number[]} [splitAfterIndexes]
 * @property {import('react').ReactNode} [separator]
 * @property {(info: { afterIndex: number }) => import('react').ReactNode} [renderSeparator]
 * @property {ViewStyle} [separatorContainerStyle]
 * @property {ViewStyle} [separatorStyle]
 * @property {number} [separatorWidth]
 * @property {number} [separatorHeight]
 * @property {string} [separatorColor]
 */

/**
 * @typedef {Object} OTPInputRef
 * @property {(index?: number) => void} focus
 * @property {() => void} blur
 * @property {() => void} clear
 * @property {() => string} getValue
 */

const defaultSeparator = {
  width: 12,
  height: 4,
  color: '#D0D5DD',
};

/**
 * @param {OTPInputProps} props
 * @param {React.Ref<OTPInputRef>} ref
 */
function OTPInputInner(props, ref) {
  const {
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
    gap = 8,
    cellWidth = 48,
    cellHeight = 56,
    borderRadius = 12,
    borderWidth = 1,
    borderColor = '#D0D5DD',
    backgroundColor,
    textColor = '#101828',
    placeholderTextColor = '#999',
    focusedBorderColor = '#101828',
    focusedBackgroundColor,
    filledBorderColor,
    filledBackgroundColor,
    errorBorderColor = '#F04438',
    fontSize = 20,
    fontFamily,
    caretHidden = false,
    digitsOnly = false,
    pasteTransformer,
    splitAfterIndexes,
    separator,
    renderSeparator,
    separatorContainerStyle,
    separatorStyle,
    separatorWidth = defaultSeparator.width,
    separatorHeight = defaultSeparator.height,
    separatorColor = defaultSeparator.color,
  } = props;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    normalizeStoredOtpValue(defaultValue, length, digitsOnly)
  );
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputRefs = useRef(/** @type {Array<import('react-native').TextInput | null>} */ ([]));
  const lastCompleteRef = useRef(/** @type {string | null} */ (null));

  const currentValue = isControlled
    ? normalizeStoredOtpValue(value ?? '', length, digitsOnly)
    : internalValue;

  const valueRef = useRef(currentValue);

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

  useEffect(() => {
    valueRef.current = currentValue;
  }, [currentValue]);

  const cells = useMemo(() => {
    return Array.from({ length }, (_, i) => currentValue[i] ?? '');
  }, [currentValue, length]);

  const splitSet = useMemo(() => {
    if (!splitAfterIndexes?.length) {
      return null;
    }
    return new Set(
      splitAfterIndexes.filter((i) => i >= 0 && i < length - 1)
    );
  }, [splitAfterIndexes, length]);

  const updateValue = useCallback(
    (nextRaw) => {
      const cleaned = sanitizeOtpInput(nextRaw, length, {
        digitsOnly,
        pasteTransformer: undefined,
      });

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
    [digitsOnly, isControlled, length, onChangeText, onComplete]
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

  useImperativeHandle(
    ref,
    () => ({
      focus: (index = 0) => {
        focusIndex(Math.min(Math.max(0, index), length - 1));
      },
      blur: () => {
        inputRefs.current.forEach((r) => r?.blur());
      },
      clear: () => {
        lastCompleteRef.current = null;
        if (!isControlled) {
          setInternalValue('');
        }
        onChangeText?.('');
        valueRef.current = '';
        focusIndex(0);
      },
      getValue: () => valueRef.current,
    }),
    [focusIndex, isControlled, length, onChangeText]
  );

  const handleChange = useCallback(
    (text, index) => {
      const stripped = text.replace(/\s/g, '');
      if (stripped.length > 1) {
        const next = sanitizeOtpInput(text, length, {
          digitsOnly,
          pasteTransformer,
        });
        updateValue(next);
        focusIndex(Math.min(next.length, length - 1));
        return;
      }

      const cleaned = sanitizeOtpInput(text, length, {
        digitsOnly,
        pasteTransformer: undefined,
      });
      const chars = currentValue.split('');
      chars[index] = cleaned;
      const next = chars.join('').slice(0, length);

      updateValue(next);

      if (cleaned && index < length - 1) {
        focusIndex(index + 1);
      }
    },
    [
      currentValue,
      digitsOnly,
      focusIndex,
      length,
      pasteTransformer,
      updateValue,
    ]
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

  const baseCellVisual = useMemo(
    () => ({
      width: cellWidth,
      height: cellHeight,
      borderRadius,
      borderWidth,
      borderColor,
      ...(backgroundColor !== undefined ? { backgroundColor } : {}),
      textAlign: 'center',
      fontSize,
      ...(fontFamily ? { fontFamily } : {}),
      color: textColor,
    }),
    [
      backgroundColor,
      borderColor,
      borderRadius,
      borderWidth,
      cellHeight,
      cellWidth,
      fontFamily,
      fontSize,
      textColor,
    ]
  );

  const renderDefaultSeparator = useCallback(
    (afterIndex) => {
      if (renderSeparator) {
        return renderSeparator({ afterIndex });
      }
      if (separator === null) {
        return null;
      }
      if (separator !== undefined) {
        return separator;
      }
      return (
        <View
          style={[
            {
              width: separatorWidth,
              height: separatorHeight,
              borderRadius: separatorHeight / 2,
              backgroundColor: separatorColor,
            },
            separatorStyle,
          ]}
        />
      );
    },
    [
      renderSeparator,
      separator,
      separatorColor,
      separatorHeight,
      separatorStyle,
      separatorWidth,
    ]
  );

  return (
    <View
      style={[styles.container, { gap }, containerStyle]}
      testID={testID}
    >
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const isFilled = Boolean(cells[index]);

        const cellVisual = [
          baseCellVisual,
          cellStyle,
          isFilled &&
            !isFocused &&
            filledBorderColor !== undefined && { borderColor: filledBorderColor },
          isFilled &&
            !isFocused &&
            filledBackgroundColor !== undefined && {
              backgroundColor: filledBackgroundColor,
            },
          isFilled && filledCellStyle,
          isFocused && {
            borderColor: focusedBorderColor,
            ...(focusedBackgroundColor !== undefined
              ? { backgroundColor: focusedBackgroundColor }
              : {}),
          },
          isFocused && focusedCellStyle,
          hasError && { borderColor: errorBorderColor },
          hasError && errorCellStyle,
          textStyle,
        ];

        const showSep = splitSet?.has(index) === true;

        return (
          <React.Fragment key={String(index)}>
            <TextInput
              ref={(r) => {
                inputRefs.current[index] = r;
              }}
              value={cells[index]}
              onChangeText={(t) => handleChange(t, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              maxLength={length}
              keyboardType={keyboardType}
              editable={editable}
              secureTextEntry={secureTextEntry}
              textContentType="oneTimeCode"
              autoComplete={
                Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'
              }
              autoCorrect={false}
              spellCheck={false}
              selectTextOnFocus
              caretHidden={caretHidden}
              importantForAutofill="yes"
              style={cellVisual}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              testID={testID ? `${testID}-cell-${index}` : undefined}
              accessibilityLabel={
                testID
                  ? `${testID} digit ${index + 1} of ${length}`
                  : undefined
              }
            />
            {showSep
              ? (() => {
                  const sep = renderDefaultSeparator(index);
                  if (sep == null) {
                    return null;
                  }
                  return (
                    <View
                      style={[styles.separatorWrap, separatorContainerStyle]}
                      pointerEvents="none"
                    >
                      {sep}
                    </View>
                  );
                })()
              : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  separatorWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const OTPInput = forwardRef(OTPInputInner);
OTPInput.displayName = 'OTPInput';
