import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
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

  /** Space between cells (and around group separators). Default `8`. */
  gap?: number;
  cellWidth?: number;
  cellHeight?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderTextColor?: string;
  focusedBorderColor?: string;
  focusedBackgroundColor?: string;
  filledBorderColor?: string;
  filledBackgroundColor?: string;
  errorBorderColor?: string;
  fontSize?: number;
  fontFamily?: string;
  caretHidden?: boolean;

  /** When `true`, non-digit characters are stripped. Default `false`. */
  digitsOnly?: boolean;

  /**
   * Applied to pasted text (multi-character input). Inspired by input-otp paste transformers.
   * Example: `(t) => t.replace(/-/g, '')`
   */
  pasteTransformer?: (pasted: string) => string;

  /**
   * Insert a separator after cells at these indices (0-based). E.g. `[2]` → gap after the 3rd digit (common 3+3 layout).
   */
  splitAfterIndexes?: number[];

  /** Custom node between groups; default is a small pill. Use `null` with `renderSeparator` unused to hide default. */
  separator?: ReactNode;

  /** Full control over separator per gap (`afterIndex` is the cell index after which the gap appears). */
  renderSeparator?: (info: { afterIndex: number }) => ReactNode;

  separatorContainerStyle?: ViewStyle;
  separatorStyle?: ViewStyle;
  separatorWidth?: number;
  separatorHeight?: number;
  separatorColor?: string;
};

export type OTPInputRef = {
  focus: (index?: number) => void;
  blur: () => void;
  clear: () => void;
  getValue: () => string;
};

export const OTPInput: ForwardRefExoticComponent<
  OTPInputProps & RefAttributes<OTPInputRef>
>;

export function clampOtpValue(text: string, length: number): string;

export function sanitizeOtpInput(
  text: string,
  length: number,
  options?: { digitsOnly?: boolean; pasteTransformer?: (s: string) => string }
): string;

export function normalizeStoredOtpValue(
  text: string,
  length: number,
  digitsOnly?: boolean
): string;
