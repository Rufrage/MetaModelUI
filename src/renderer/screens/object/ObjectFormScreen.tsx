import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { MMObject } from '@rufrage/metamodel';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate, useParams } from 'react-router-dom';
import TextAreaInput from 'renderer/components/inputs/TextAreaInput';
import TextFieldInput from 'renderer/components/inputs/TextFieldInput';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import { ObjectsContext } from 'renderer/providers/ObjectsProvider';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    name: yup.string().required('The name is required!'),
    description: yup.string().required('The description is required!'),
  })
  .required();

export default function ObjectFormScreen() {
  /** Use ObjectsContext to add new Objects */
  const { addObject } = useContext(ObjectsContext);
  /** Use NavigationContext */
  const navigate = useNavigate();

  /** Get Object ID or "new" for insert */
  const { id } = useParams();

  /** Create a form with yup schema validation */
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = (data: any) => {
    /** Create a new MMObject and add it to the list of MMObjects */
    const newObject = new MMObject(data.name, data.description);
    addObject(newObject);

    navigate(-1);
  };

  /** Navigate back Hotkey */
  useHotkeys('esc', () => navigate(-1));
  useHotkeys(
    'ctrl + s',
    () => {
      handleSubmit(onSubmit)();
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    }
  );

  return (
    <ScreenFrame name={id === 'new' ? 'New Object' : 'Edit Object'}>
      <Card elevation={2} sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6">Enter Details</Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextFieldInput
                control={control}
                name="name"
                label="Name"
                autofocus
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextAreaInput
                control={control}
                name="description"
                label="Description"
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </ScreenFrame>
  );
}
