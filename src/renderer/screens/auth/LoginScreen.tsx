import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextFieldInput from 'renderer/components/inputs/TextFieldInput';
import { AuthContext } from 'renderer/providers/AuthProvider';
import * as yup from 'yup';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const schema = yup
    .object()
    .shape({
      email: yup
        .string()
        .email('Please enter a valid email!')
        .required('The email is required!'),
      password: yup.string().required('The password is required!'),
    })
    .required();

  /** Create a form with yup schema validation */
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = async (data: any) => {
    const { email, password } = data;
    const loginResponse = await login(email, password);
    const newEmailError = loginResponse.emailError;
    const newPasswordError = loginResponse.passwordError;
    if (newEmailError || newPasswordError) {
      setEmailError(newEmailError);
      setPasswordError(newPasswordError);
    }
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6">Login</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12} pt={2}>
        <Paper elevation={1} sx={{ padding: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              sx={{ flex: 1, padding: 2 }}
              justifyContent="center"
            >
              <Grid item sx={{ minWidth: '60%' }}>
                <TextFieldInput
                  control={control}
                  name="email"
                  label="Email"
                  autofocus
                  fullWidth
                  helperText="Enter a valid email adress"
                  errorText={emailError?.trim().length > 0 ? emailError : ''}
                />
              </Grid>
              <Grid item sx={{ minWidth: '60%', paddingTop: 1 }}>
                <TextFieldInput
                  control={control}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  helperText="Enter your password"
                  errorText={
                    passwordError?.trim().length > 0 ? passwordError : ''
                  }
                />
              </Grid>
              <Grid item sx={{ minWidth: '60%', paddingTop: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Container>
  );
}
