/* eslint-disable react/no-unknown-property */
/* eslint-disable no-nested-ternary */
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { Grid, IconButton, Stack, TextField } from '@mui/material';
import { useEffect, useRef } from 'react';
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
  directory?: boolean;
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
  directory = false,
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (directory && fileInputRef.current !== null) {
      fileInputRef.current.setAttribute('directory', '');
      fileInputRef.current.setAttribute('webkitdirectory', '');
    }
  }, [directory, fileInputRef]);

  async function openDialog(onChange: (...event: any[]) => void) {
    if (disabled) return;

    const selectedDir = await window.electron.ipcRenderer.invoke(
      directory ? 'selectDirectory' : 'selectFile'
    );

    console.log(`[FileInput openDialog] selectedDir: ${selectedDir}`);
    if (selectedDir) {
      onChange(selectedDir);
    }
  }

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
          <Grid container>
            <Grid item xs>
              <TextField
                /** Pass controller props to controlled input */
                onBlur={onBlur}
                value={value}
                inputRef={ref}
                error={!!error || !!errorText.length}
                ref={fileInputRef}
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
                onClick={async () => {
                  // fileInputRef.current?.click();
                  await openDialog(onChange);
                }}
              />
            </Grid>
            <Grid item xs={1} sx={{ paddingLeft: 2, paddingTop: 1 }}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileOpenIcon fontSize="medium" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
