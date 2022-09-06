import { TextField } from '@mui/material';
import { InputHTMLAttributes } from 'react';
import { Control, Controller } from 'react-hook-form';

export interface TextFieldInputProps {
  name: string;
  label: string;
  control: Control;
  defaultValue?: string;
  disabled?: boolean;
  autofocus?: boolean;
  type?: InputHTMLAttributes<unknown>['type'];
  fullWidth?: boolean;
  helperText?: string;
}
export default function TextFieldInput({
  name,
  label,
  control,
  defaultValue = '',
  disabled = false,
  autofocus = false,
  type = 'text',
  fullWidth = false,
  helperText = ' ',
}: TextFieldInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => {
        return (
          <TextField
            /** Pass controller props to controlled input */
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            inputRef={ref}
            error={!!error}
            /** Input specific props */
            label={label}
            helperText={error?.message ? error.message : helperText}
            disabled={disabled}
            autoFocus={autofocus}
            type={type}
            fullWidth={fullWidth}
          />
        );
      }}
    />
  );
}
