import { TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

export interface TextAreaInputProps {
  name: string;
  label: string;
  control: Control;
  defaultValue?: string;
  disabled?: boolean;
}
export default function TextAreaInput({
  name,
  label,
  control,
  defaultValue = '',
  disabled = false,
}: TextAreaInputProps) {
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
            multiline
            fullWidth
            minRows={3}
            label={label}
            helperText={error?.message ? error.message : ' '}
            disabled={disabled}
          />
        );
      }}
    />
  );
}
