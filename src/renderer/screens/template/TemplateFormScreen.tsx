import { yupResolver } from '@hookform/resolvers/yup';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import {
  Box,
  Button,
  Card,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { MMTemplate, MMTemplateInputType } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate, useParams } from 'react-router-dom';
import FileInput from 'renderer/components/inputs/FileInput';
import RadioInput from 'renderer/components/inputs/RadioInput';
import TextAreaInput from 'renderer/components/inputs/TextAreaInput';
import TextFieldInput from 'renderer/components/inputs/TextFieldInput';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    name: yup.string().required('The name is required!'),
    filepath: yup.string().required('The filepath is required!'),
    description: yup.string().required('The description is required!'),
    objectInputType: yup
      .number()
      .required('The Object Input Type is required!'),
    viewInputType: yup.number().required('The View Input Type is required!'),
  })
  .required();

const inputOptions = [
  { label: 'None', value: MMTemplateInputType.None },
  {
    label: 'Single',
    value: MMTemplateInputType.Single,
  },
  {
    label: 'Multi',
    value: MMTemplateInputType.Multi,
  },
];

export default function TemplateFormScreen() {
  /** Use TemplatesContext to add new Templates */
  const { readTemplate, insertTemplate, updateTemplate } =
    useContext(TemplatesContext);

  const [editTemplate, setEditTemplate] = useState<MMTemplate | undefined>();
  const [editTemplateLoading, setEditTemplateLoading] =
    useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /** Use NavigationContext */
  const navigate = useNavigate();

  /** Get Template ID or "new" for insert */
  const { id } = useParams();

  /** Create a form with yup schema validation */
  const { handleSubmit, setValue, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = async (data: any) => {
    /** Create a new MMTemplate and add it to the list of MMTemplates */
    const templateData = new MMTemplate(
      data.name,
      data.filepath,
      data.description,
      id,
      data.objectInputType,
      data.viewInputType
    );
    setSubmitLoading(true);
    if (id !== 'new' && editTemplate !== undefined) {
      await updateTemplate(templateData);
    } else if (id === 'new') {
      await insertTemplate(templateData);
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
      // Load the template for editing
      const loadEditTemplate = async () => {
        setEditTemplateLoading(true);
        const newEditTemplate = await readTemplate(id);
        setEditTemplateLoading(false);
        setEditTemplate(newEditTemplate);
      };

      // Initialize
      loadEditTemplate();
    }
  }, [id, readTemplate]);

  useEffect(() => {
    if (editTemplate && setValue) {
      setValue('name', editTemplate.name);
      setValue('filepath', editTemplate.filepath);
      setValue('description', editTemplate.description);
      setValue('objectInputType', editTemplate.objectInputType);
      setValue('viewInputType', editTemplate.viewInputType);
    }
  }, [editTemplate, setValue]);

  return (
    <ScreenFrame name={id === 'new' ? 'New Template' : 'Edit Template'}>
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
                  disabled={editTemplateLoading || submitLoading}
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
                defaultValue={editTemplate?.name}
                helperText="Enter the template name"
                disabled={editTemplateLoading || submitLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextFieldInput
                control={control}
                name="filepath"
                label="Filepath"
                fullWidth
                autofocus
                defaultValue={editTemplate?.filepath}
                helperText="Pick the template file"
                disabled={editTemplateLoading || submitLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextAreaInput
                control={control}
                name="description"
                label="Description"
                defaultValue={editTemplate?.description}
                helperText="Enter the template description"
                disabled={editTemplateLoading || submitLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <Typography variant="h6">Inputs</Typography>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <Paper elevation={1} sx={{ padding: 1 }}>
                <RadioInput
                  row
                  control={control}
                  name="objectInputType"
                  label="Objects"
                  defaultValue={
                    editTemplate
                      ? editTemplate.objectInputType
                      : MMTemplateInputType.None
                  }
                  disabled={editTemplateLoading || submitLoading}
                  options={inputOptions}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <Paper elevation={1} sx={{ padding: 1 }}>
                <RadioInput
                  control={control}
                  name="viewInputType"
                  label="Views"
                  defaultValue={
                    editTemplate
                      ? editTemplate.viewInputType
                      : MMTemplateInputType.None
                  }
                  disabled={editTemplateLoading || submitLoading}
                  row
                  options={inputOptions}
                />
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Card>
    </ScreenFrame>
  );
}
