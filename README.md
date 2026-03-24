# react-native-otp-fields

**Lightweight and customizable OTP input for React Native.**

Fixed-length OTP cells with auto-advance, backspace navigation, paste support, controlled and uncontrolled usage, optional masking, error styling, and a completion callback. No native modules—pure JavaScript on top of React Native `TextInput`.

## Requirements

- React ≥ 18
- React Native ≥ 0.74

## Installation

```bash
npm install react-native-otp-fields
```

```bash
yarn add react-native-otp-fields
```

## Quick start

```jsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { OTPInput } from 'react-native-otp-fields';

export default function App() {
  const [otp, setOtp] = useState('');

  return (
    <View style={{ padding: 24 }}>
      <OTPInput
        length={6}
        value={otp}
        onChangeText={setOtp}
        onComplete={(code) => console.log('Completed:', code)}
      />
    </View>
  );
}
```

## API

### `OTPInput`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `number` | `6` | Number of OTP digits. |
| `value` | `string` | — | Controlled value (digits only; whitespace is ignored). |
| `defaultValue` | `string` | `''` | Initial value when uncontrolled. |
| `onChangeText` | `(value: string) => void` | — | Called whenever the combined code changes. |
| `onComplete` | `(value: string) => void` | — | Called once when `value` reaches `length`. Not fired again until the code changes and is completed again. |
| `autoFocus` | `boolean` | `false` | Focus the first cell on mount. |
| `editable` | `boolean` | `true` | Disables all cells when `false`. |
| `secureTextEntry` | `boolean` | `false` | Mask digits (PIN-style). |
| `keyboardType` | `TextInput` keyboard type | `'number-pad'` | Often `'number-pad'` or `'numeric'`. |
| `placeholder` | `string` | `''` | Placeholder per cell. |
| `hasError` | `boolean` | `false` | Applies error cell styles. |
| `testID` | `string` | — | Container `testID`; cells use `${testID}-cell-${index}`. |

**Style props** (all optional): `containerStyle`, `cellStyle`, `focusedCellStyle`, `filledCellStyle`, `errorCellStyle`, `textStyle`.

### Utilities

- **`clampOtpValue(text, length)`** — Strips whitespace and truncates to `length`. Exported for tests or custom flows.

## Behavior

- **Auto-advance:** After a digit in a cell, focus moves to the next cell.
- **Backspace:** Clears the current cell if it has a digit; otherwise moves to the previous cell and clears it.
- **Paste:** Pasting a multi-character code into any cell fills from the start (up to `length`) and moves focus to the last filled cell.
- **SMS / OTP autofill:** Uses `textContentType="oneTimeCode"` (iOS) and `autoComplete` / `importantForAutofill` (Android) to cooperate with system OTP suggestions where the OS supports it.
- **Completion:** `onComplete` runs when the string length first reaches `length`; if the user edits the code, it can fire again after the next full completion.

## Styling and layout

Default cells are **48×56** with horizontal spacing (`gap: 8`). The container uses `flexDirection: 'row'` and `justifyContent: 'space-between'`. Override with `containerStyle` / `cellStyle` for different sizes, spacing, or centered groups (e.g. wrap in a `View` with `alignItems: 'center'` and adjust `containerStyle`).

For small screens, reduce `cell` width or use fewer digits; the component does not assume a fixed screen width.

## Controlled vs uncontrolled

- **Controlled:** Pass `value` + `onChangeText` (recommended when the code is stored in parent state or a form library).
- **Uncontrolled:** Omit `value` and optionally set `defaultValue`.

## Testing

With `testID="login-otp"`, the container has `testID="login-otp"` and cells have `testID="login-otp-cell-0"`, `login-otp-cell-1`, etc.

## TypeScript

Type definitions are included (`types/index.d.ts`).

## Local development (this repo)

```bash
npm install
npm run build
npm test
```

The package ships pre-built `lib/` output. `prepublishOnly` runs `build` and `tests` before `npm publish`; consumers do not need to compile the library.

Link into an app:

```bash
npm pack
# In your app: npm install /path/to/react-native-otp-fields-0.1.0.tgz
```

Or use `yarn link` / `npm link` per your workflow.

## Publishing

1. Bump `version` in `package.json`.
2. `npm run build`
3. `npm publish` (after `npm login`).

Ensure `files` in `package.json` only ships `src`, `lib`, `types`, `README.md`, and `LICENSE`.

## License

MIT
