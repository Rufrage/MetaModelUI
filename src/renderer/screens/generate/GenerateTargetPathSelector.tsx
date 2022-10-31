import { yupResolver } from '@hookform/resolvers/yup';
import SaveIcon from '@mui/icons-material/Save';
import {
  Card,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import FileInput from 'renderer/components/inputs/FileInput';
import { GenerateContext } from 'renderer/providers/GenerateProvider';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    targetSourcePath: yup
      .string()
      .required('The target source path is required!'),
  })
  .required();

export default function GenerateTargetPathSelector() {
  const { targetSourcePath, updateTargetSourcePath } =
    useContext(GenerateContext);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /** Create a form with yup schema validation */
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = async (data: any) => {
    /** Update the local target source path */
    setSubmitLoading(true);
    const newTargetSourcePath = data.targetSourcePath;
    if (newTargetSourcePath && typeof newTargetSourcePath === 'string') {
      updateTargetSourcePath(newTargetSourcePath);
    }
    setSubmitLoading(false);
  };

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs>
            <Typography variant="h6">Target Source Directory</Typography>
          </Grid>
          <Grid item xs={2}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Tooltip title="Save this Build Profile" arrow placement="top">
                <span>
                  <IconButton type="submit" aria-label="edit" color="primary">
                    <SaveIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
        <Grid container sx={{ paddingTop: 2 }}>
          <Grid item xs>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <FileInput
                control={control}
                name="targetSourcePath"
                label="Directory Path"
                fullWidth
                autofocus
                defaultValue={targetSourcePath}
                helperText="Pick the target directory"
                disabled={submitLoading}
                directory
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
