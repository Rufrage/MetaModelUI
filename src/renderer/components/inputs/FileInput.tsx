/* eslint-disable no-nested-ternary */
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Grid, IconButton, TextField } from '@mui/material';
import { useRef } from 'react';
import { Control, Controller } from 'react-hook-form';

export interface FileInputProps {
  name: string;
  label: string;
  control: Control;
  defaultValue?: string;
  disabled?: boolean;
  autofocus?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  errorText?: string;
}
export default function FileInput({
  name,
  label,
  control,
  defaultValue = '',
  disabled = false,
  autofocus = false,
  fullWidth = false,
  helperText = ' ',
  errorText = '',
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          <Grid container xs={12}>
            <Grid item xs={8}>
              <TextField
                /** Pass controller props to controlled input */
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
                disabled
                autoFocus={autofocus}
                type="text"
                fullWidth={fullWidth}
              />
            </Grid>
            <Grid item xs={4} sx={{ paddingLeft: 2, paddingTop: 1 }}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(event) => {
                    if ('files' in event.target) {
                      onChange(event.target.files?.[0]?.path);
                    }
                  }}
                  disabled={disabled}
                  hidden
                />
                <FileOpenIcon fontSize="medium" />
              </IconButton>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
