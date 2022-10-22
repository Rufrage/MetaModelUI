import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { MMBuildProfile, MMBuildProfileEntry } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextAreaInput from 'renderer/components/inputs/TextAreaInput';
import TextFieldInput from 'renderer/components/inputs/TextFieldInput';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';
import { GenerateContext } from 'renderer/providers/GenerateProvider';
import * as yup from 'yup';

const schema = yup
  .object()
  .shape({
    name: yup.string().required('The name is required!'),
    description: yup.string(),
  })
  .required();

export default function BuildProfileFormScreen({
  id = 'new',
  close = () => {},
}: {
  id?: string;
  close?: () => void;
}) {
  /** Use ObjectsContext to add new Objects */
  const { readBuildProfile, insertBuildProfile, updateBuildProfile } =
    useContext(BuildProfilesContext);
  const {
    selectedObjects,
    selectedViews,
    modifiedBuildProfileEntries,
    dirtyBuildProfileEntries,
    setSelectedBuildProfile,
  } = useContext(GenerateContext);

  const [editBuildProfile, setEditBuildProfile] = useState<
    MMBuildProfile | undefined
  >();
  const [editBuildProfileLoading, setEditBuildProfileLoading] =
    useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  /** Create a form with yup schema validation */
  const { handleSubmit, setValue, control } = useForm({
    resolver: yupResolver(schema),
  });

  /** Handle submit */
  const onSubmit = async (data: any) => {
    let buildProfileData: MMBuildProfile | undefined = new MMBuildProfile(
      data.name,
      data.description,
      id === 'new' ? '' : id
    );

    // Update the selected general input
    buildProfileData.objectIDs = selectedObjects;
    buildProfileData.viewIDs = selectedViews;
    // Update the dirty build profile entries
    // Insert / Update all dirty BuildProfileEntries
    const newBuildProfileEntries: MMBuildProfileEntry[] = [];
    dirtyBuildProfileEntries.reduce((result, dirtyTemplateId) => {
      const dirtyBuildProfileEntry =
        modifiedBuildProfileEntries.get(dirtyTemplateId);
      if (dirtyBuildProfileEntry) {
        result.push(dirtyBuildProfileEntry);
      }
      return result;
    }, newBuildProfileEntries);
    buildProfileData.buildProfileEntries = newBuildProfileEntries;
    // Start Insert / Update process
    setSubmitLoading(true);
    if (id !== 'new' && editBuildProfile !== undefined) {
      buildProfileData = await updateBuildProfile(buildProfileData, true);
    } else if (id === 'new') {
      buildProfileData = await insertBuildProfile(buildProfileData, true);
    }

    setSubmitLoading(false);
    close();
    if (buildProfileData && buildProfileData.id) {
      setSelectedBuildProfile(buildProfileData.id);
    }
  };

  useEffect(() => {
    if (id !== undefined && id !== 'new') {
      // Load the buildProfile for editing
      const loadEditBuildProfile = async () => {
        setEditBuildProfileLoading(true);
        const newEditBuildProfile = await readBuildProfile(id);
        setEditBuildProfileLoading(false);
        setEditBuildProfile(newEditBuildProfile);
      };

      // Initialize
      loadEditBuildProfile();
    }
  }, [id, readBuildProfile]);

  useEffect(() => {
    if (editBuildProfile && setValue) {
      setValue('name', editBuildProfile.name);
      setValue('description', editBuildProfile.description);
    }
  }, [editBuildProfile, setValue]);

  return (
    <ScreenFrame
      name={id === 'new' ? 'New Build Profile' : 'Edit Build Profile'}
    >
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
                  disabled={editBuildProfileLoading || submitLoading}
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
                defaultValue={editBuildProfile?.name}
                disabled={editBuildProfileLoading || submitLoading}
              />
            </Grid>
            <Grid item xs={12} sx={{ paddingTop: 2 }}>
              <TextAreaInput
                control={control}
                name="description"
                label="Description"
                defaultValue={editBuildProfile?.description}
                disabled={editBuildProfileLoading || submitLoading}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </ScreenFrame>
  );
}
