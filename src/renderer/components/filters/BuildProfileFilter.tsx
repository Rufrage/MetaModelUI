import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {
  Card,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';
import { GenerateContext } from 'renderer/providers/GenerateProvider';

export default function BuildProfileFilter() {
  const { buildProfiles, readBuildProfiles } = useContext(BuildProfilesContext);
  const { selectedBuildProfile, setSelectedBuildProfile } =
    useContext(GenerateContext);

  return (
    <Card elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Build Profile</Typography>
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
      </Grid>
    </Card>
  );
}
