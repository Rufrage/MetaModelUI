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
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';

interface BuildProfileFilterProps {
  selectedBuildProfile: string;
  setSelectedBuildProfile: Dispatch<SetStateAction<string>>;
}

export default function BuildProfileFilter({
  selectedBuildProfile,
  setSelectedBuildProfile,
}: BuildProfileFilterProps) {
  const { buildProfiles, readBuildProfiles } = useContext(BuildProfilesContext);

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
