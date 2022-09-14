import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { MMObject } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
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
  const { readObject, insertObject, updateObject } = useContext(ObjectsContext);

  const [editObject, setEditObject] = useState<MMObject | undefined>();
  const [editObjectLoading, setEditObjectLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /** Use NavigationContext */
  const navigate = useNavigate();

  /** Get Object ID or "new" for insert */
  const { id } = useParams();

  /** Create a form with yup schema validation */
  const { handleSubmit, setValue, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = async (data: any) => {
    /** Create a new MMObject and add it to the list of MMObjects */
    const objectData = new MMObject(data.name, data.description, id);
    setSubmitLoading(true);
    if (id !== 'new' && editObject !== undefined) {
      await updateObject(objectData);
    } else if (id === 'new') {
      await insertObject(objectData);
    }
    setSubmitLoading(false);
    navigate(-1);
  };

  /** Navigate back Hotkey */
  useHotkeys('esc', () => navigate(-1), {
    enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
  });
  useHotkeys(
    'ctrl + s',
    () => {
      handleSubmit(onSubmit)();
    },
    {
      enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    }
  );

  useEffect(() => {
    if (id !== undefined && id !== 'new') {
      // Load the object for editing
      const loadEditObject = async () => {
        setEditObjectLoading(true);
        const newEditObject = await readObject(id);
        setEditObjectLoading(false);
        setEditObject(newEditObject);
      };

      // Initialize
      loadEditObject();
    }
  }, [id, readObject]);

  useEffect(() => {
    if (editObject && setValue) {
      setValue('name', editObject.name);
      setValue('description', editObject.description);
    }
  }, [editObject, setValue]);

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
                <Button
                  type="submit"
                  variant="contained"
                  disabled={editObjectLoading || submitLoading}
                >
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
                defaultValue={editObject?.name}
                disabled={editObjectLoading || submitLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextAreaInput
                control={control}
                name="description"
                label="Description"
                defaultValue={editObject?.description}
                disabled={editObjectLoading || submitLoading}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </ScreenFrame>
  );
}
