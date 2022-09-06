import {
  Card,
  CardContent,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { InputHTMLAttributes } from 'react';
import { Control, Controller } from 'react-hook-form';

export interface CardSelectInputProps {
  name: string;
  label: string;
  control: Control;
  defaultValue?: string;
  disabled?: boolean;
}
export default function CardSelectInput({
  name,
  label,
  control,
  defaultValue = '',
  disabled = false,
}: CardSelectInputProps) {
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
          <Grid container xs={12} justifyContent="center">
            <Grid item xs={12}>
              <Typography align="center" variant="h6">
                {label}
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={value}
                sx={{ paddingTop: 2 }}
                onChange={onChange}
                ref={ref}
                fullWidth
              >
                <ToggleButton value="appBuilder" fullWidth>
                  App Builder
                </ToggleButton>
                <ToggleButton value="codeGenerator" disabled fullWidth>
                  Code Generator
                </ToggleButton>
                <ToggleButton value="codeGenerator" disabled fullWidth>
                  Custom
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
