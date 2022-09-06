import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Container,
  Grid,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { MMObject } from '@rufrage/metamodel';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import CardSelectInput from 'renderer/components/inputs/CardSelectInput';
import TextFieldInput from 'renderer/components/inputs/TextFieldInput';
import * as yup from 'yup';

export default function RegisterScreen() {
  const [formStep, setFormStep] = useState(0);

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
  const { handleSubmit, control, trigger } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = (data: any) => {
    console.log('Submitted');
    /** Create a new MMObject and add it to the list of MMObjects */
    const newObject = new MMObject(data.name, data.description);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6">Heading</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12} pt={2}>
        <Paper elevation={1} sx={{ padding: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container justifyContent="center">
              <Grid item sx={{ minWidth: '30%' }}>
                <Stepper activeStep={formStep}>
                  <Step key="Step1">
                    <StepLabel>Step 1</StepLabel>
                  </Step>
                  <Step key="Step2">
                    <StepLabel>Step 2</StepLabel>
                  </Step>
                </Stepper>
              </Grid>
            </Grid>
            {formStep === 0 && (
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
                  />
                </Grid>
                <Grid item sx={{ minWidth: '60%', paddingTop: 1 }}>
                  <TextFieldInput
                    control={control}
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    helperText="Enter a strong password"
                  />
                </Grid>
                <Grid item sx={{ minWidth: '60%', paddingTop: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      const isValid = trigger(['email', 'password']);
                      if (await isValid) {
                        setFormStep((currentFormStep) => currentFormStep + 1);
                      }
                    }}
                    fullWidth
                    type="submit"
                  >
                    Next Page
                  </Button>
                </Grid>
              </Grid>
            )}
            {formStep === 1 && (
              <Grid
                container
                sx={{ flex: 1, padding: 2 }}
                justifyContent="center"
              >
                <Grid item sx={{ minWidth: '60%' }}>
                  <CardSelectInput
                    control={control}
                    name="variant"
                    label="Select variant"
                    defaultValue="appBuilder"
                  />
                </Grid>
                <Grid item sx={{ minWidth: '60%', paddingTop: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      const isValid = trigger(['email', 'password']);
                      if (await isValid) {
                        setFormStep((currentFormStep) => currentFormStep + 1);
                      }
                    }}
                    fullWidth
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>
        </Paper>
      </Grid>
    </Container>
  );
}
