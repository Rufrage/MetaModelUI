/* eslint-disable no-nested-ternary */
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
  errorText?: string;
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
  errorText = '',
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
            error={!!error || !!errorText.length}
            /** Input specific props */
            label={label}
            helperText={
              error?.message
                ? error.message
                : errorText.length
                ? errorText
                : helperText
            }
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
