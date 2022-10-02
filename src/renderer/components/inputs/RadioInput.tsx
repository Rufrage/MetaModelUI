/* eslint-disable no-nested-ternary */
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';

export interface RadioInputOption {
  value: number;
  label: string;
}

export interface RadioInputProps {
  name: string;
  label: string;
  control: Control;
  options: RadioInputOption[];
  defaultValue?: unknown;
  disabled?: boolean;
  row?: boolean;
  errorText?: string;
  helperText?: string;
}
export default function RadioInput({
  name,
  label,
  control,
  options,
  defaultValue = '',
  disabled = false,
  row = false,
  errorText = '',
  helperText = ' ',
}: RadioInputProps) {
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
          <FormControl
            error={!!error || !!errorText.length}
            disabled={disabled}
            fullWidth
          >
            <Grid container flex alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <FormLabel>
                  <Typography variant="h6" sx={{ paddingLeft: 1 }}>
                    {label}
                  </Typography>
                </FormLabel>
              </Grid>
              <Grid item>
                <RadioGroup
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  ref={ref}
                  row={row}
                >
                  {options.map((option) => {
                    return (
                      <FormControlLabel
                        key={option.label}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    );
                  })}
                </RadioGroup>
              </Grid>
              <Grid item>
                <FormHelperText>
                  {error?.message
                    ? error.message
                    : errorText.length
                    ? errorText
                    : helperText}
                </FormHelperText>
              </Grid>
            </Grid>
          </FormControl>
        );
      }}
    />
  );
}
