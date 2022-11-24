import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { MMView } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate, useParams } from 'react-router-dom';
import TextAreaInput from 'renderer/components/inputs/TextAreaInput';
import TextFieldInput from 'renderer/components/inputs/TextFieldInput';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import { ViewsContext } from 'renderer/providers/ViewsProvider';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    name: yup.string().required('The name is required!'),
    description: yup.string().required('The description is required!'),
  })
  .required();

export default function ViewFormScreen() {
  /** Use ViewsContext to add new Views */
  const { readView, insertView, updateView } = useContext(ViewsContext);

  const [editView, setEditView] = useState<MMView | undefined>();
  const [editViewLoading, setEditViewLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /** Use NavigationContext */
  const navigate = useNavigate();

  /** Get View ID or "new" for insert */
  const { id } = useParams();

  /** Create a form with yup schema validation */
  const { handleSubmit, setValue, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = async (data: any) => {
    /** Create a new MMView and add it to the list of MMViews */
    const viewData = new MMView(data.name, data.description, id);
    setSubmitLoading(true);
    if (id !== 'new' && editView !== undefined) {
      await updateView(viewData);
    } else if (id === 'new') {
      await insertView(viewData);
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
      // Load the view for editing
      const loadEditView = async () => {
        setEditViewLoading(true);
        const newEditView = await readView(id);
        setEditViewLoading(false);
        setEditView(newEditView);
      };

      // Initialize
      loadEditView();
    }
  }, [id, readView]);

  useEffect(() => {
    if (editView && setValue) {
      setValue('name', editView.name);
      setValue('description', editView.description);
    }
  }, [editView, setValue]);

  return (
    <ScreenFrame name={id === 'new' ? 'New View' : 'Edit View'}>
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
                  disabled={editViewLoading || submitLoading}
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
                defaultValue={editView?.name}
                disabled={editViewLoading || submitLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextAreaInput
                control={control}
                name="description"
                label="Description"
                defaultValue={editView?.description}
                disabled={editViewLoading || submitLoading}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </ScreenFrame>
  );
}
