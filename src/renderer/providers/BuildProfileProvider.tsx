import { MMBuildProfile } from '@rufrage/metamodel';
import { createContext, useEffect, useState } from 'react';
import { getBuildProfileEntries } from 'renderer/services/BuildProfileEntryService';
import {
  addBuildProfile,
  getBuildProfile,
  getBuildProfiles,
  saveBuildProfile,
} from 'renderer/services/BuildProfileService';

export type BuildProfileContextContent = {
  buildProfiles: MMBuildProfile[];
  insertBuildProfile: (
    buildProfile: MMBuildProfile
  ) => Promise<MMBuildProfile | undefined>;
  updateBuildProfile: (
    buildProfile: MMBuildProfile
  ) => Promise<MMBuildProfile | undefined>;
  readBuildProfiles: () => Promise<boolean>;
  readBuildProfile: (
    id: string,
    withBuildProfileEntries?: boolean
  ) => Promise<MMBuildProfile | undefined>;
};

export const BuildProfilesContext = createContext<BuildProfileContextContent>({
  buildProfiles: [],
  insertBuildProfile: () => {
    return new Promise((resolve) => resolve(undefined));
  },
  updateBuildProfile: () => {
    return new Promise((resolve) => resolve(undefined));
  },
  readBuildProfiles: () => {
    return new Promise((resolve) => resolve(false));
  },
  readBuildProfile: () => {
    return new Promise((resolve) => resolve(undefined));
  },
});

interface BuildProfilesProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function BuildProfilesProvider({
  children,
}: BuildProfilesProviderProps) {
  const [buildProfiles, setBuildProfiles] = useState<MMBuildProfile[]>([]);

  async function readBuildProfiles(): Promise<boolean> {
    try {
      const buildProfileItems = await getBuildProfiles();
      setBuildProfiles(buildProfileItems);
      return true;
    } catch (error) {
      console.log('Error: ', error);
      return false;
    }
  }

  async function readBuildProfile(
    id: string,
    withBuildProfileEntries = false
  ): Promise<MMBuildProfile | undefined> {
    try {
      const buildProfile = await getBuildProfile(id);
      if (buildProfile && withBuildProfileEntries) {
        const buildProfileEntries = await getBuildProfileEntries(id);
        buildProfile.buildProfileEntries = buildProfileEntries;
      }
      return buildProfile;
    } catch (error) {
      console.log('Error: ', error);
      return undefined;
    }
  }

  async function insertBuildProfile(
    newBuildProfile: MMBuildProfile
  ): Promise<MMBuildProfile | undefined> {
    try {
      const addedBuildProfile = await addBuildProfile(newBuildProfile);
      await readBuildProfiles();
      return addedBuildProfile;
    } catch (error) {
      console.log('Error: ', error);
      return newBuildProfile;
    }
  }

  async function updateBuildProfile(
    updateData: MMBuildProfile
  ): Promise<MMBuildProfile | undefined> {
    try {
      const updatedBuildProfile = await saveBuildProfile(updateData);
      await readBuildProfiles();
      return updatedBuildProfile;
    } catch (error) {
      console.log('Error: ', error);
      return updateData;
    }
  }

  useEffect(() => {
    readBuildProfiles();
  }, []);

  return (
    <BuildProfilesContext.Provider
      value={{
        buildProfiles,
        insertBuildProfile,
        readBuildProfiles,
        readBuildProfile,
        updateBuildProfile,
      }}
    >
      {children}
    </BuildProfilesContext.Provider>
  );
}
