import TransformOutlinedIcon from '@mui/icons-material/TransformOutlined';
import {
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';
import { GenerateContext } from 'renderer/providers/GenerateProvider';
import BuildProfileEditDialog from '../dialogs/BuildProfileEditDialog';

export default function BuildProfileFilter() {
  const { buildProfiles } = useContext(BuildProfilesContext);
  const {
    selectedBuildProfile,
    setSelectedBuildProfile,
    dirtyBuildProfileEntries,
    currentBuildProfile,
  } = useContext(GenerateContext);

  return (
    <Card elevation={2} sx={{ padding: 2 }}>
      <Grid container>
        <Grid item xs>
          <Typography variant="h6">Build Profile</Typography>
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <BuildProfileEditDialog
              disabled={
                currentBuildProfile && dirtyBuildProfileEntries.length === 0
              }
            />
            <Tooltip
              title="Generate from this Build Profile"
              arrow
              placement="top"
            >
              <IconButton aria-label="generate" color="primary">
                <TransformOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
      </Grid>
      <Grid container sx={{ paddingTop: 2 }}>
        <Grid item xs>
          <FormControl fullWidth size="small">
            <InputLabel id="select-build-profile-label">
              Select build profile or none
            </InputLabel>
            <Select
              labelId="select-build-profile-label"
              id="select-build-profile"
              value={selectedBuildProfile}
              label="Select build profile or none"
              onChange={(event) => {
                setSelectedBuildProfile(event?.target?.value);
              }}
            >
              <MenuItem value="-" key="-">
                -
              </MenuItem>
              {buildProfiles.map((buildProfile) => {
                return (
                  <MenuItem value={buildProfile.id} key={buildProfile.name}>
                    {buildProfile.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        {/**
          <Grid item xs={1}>
            <IconButton
              color="primary"
              aria-label="Refresh build profiles list"
              onClick={() => {
                readBuildProfiles();
              }}
            >
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
          </Grid>
           */}
      </Grid>
    </Card>
  );
}
