import type { FC } from 'react';
import type {
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type OTPInputProps = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  placeholder?: string;
  hasError?: boolean;
  testID?: string;

  containerStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  focusedCellStyle?: ViewStyle;
  filledCellStyle?: ViewStyle;
  errorCellStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export const OTPInput: FC<OTPInputProps>;

/**
 * Strips whitespace and truncates to `length` (useful for tests or custom flows).
 */
export function clampOtpValue(text: string, length: number): string;
