import { MMBuildProfile, MMBuildProfileEntry } from '@rufrage/metamodel';
import { createContext, useEffect, useState } from 'react';
import {
  addBuildProfileEntry,
  getBuildProfileEntries,
  saveBuildProfileEntry,
} from 'renderer/services/BuildProfileEntryService';
import {
  addBuildProfile,
  getBuildProfile,
  getBuildProfiles,
  saveBuildProfile,
} from 'renderer/services/BuildProfileService';

export type BuildProfileContextContent = {
  buildProfiles: MMBuildProfile[];
  insertBuildProfile: (
    buildProfile: MMBuildProfile,
    withBuildProfileEntries?: boolean
  ) => Promise<MMBuildProfile | undefined>;
  updateBuildProfile: (
    buildProfile: MMBuildProfile,
    withBuildProfileEntries?: boolean
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

  async function saveBuildProfileEntries(
    buildProfileId: string,
    buildProfileEntries: MMBuildProfileEntry[]
  ): Promise<MMBuildProfileEntry[] | undefined> {
    try {
      const newBuildProfileEntries: MMBuildProfileEntry[] = [];
      buildProfileEntries.forEach(
        async (buildProfileEntry: MMBuildProfileEntry) => {
          buildProfileEntry.buildProfileID = buildProfileId;
          if (buildProfileEntry.id) {
            // Update
            const updatedBuildProfileEntry = await saveBuildProfileEntry(
              buildProfileId,
              buildProfileEntry
            );
            newBuildProfileEntries.push(updatedBuildProfileEntry);
          } else {
            // Insert
            const insertedBuildProfileEntry = await addBuildProfileEntry(
              buildProfileId,
              buildProfileEntry
            );
            newBuildProfileEntries.push(insertedBuildProfileEntry);
          }
        }
      );
      return newBuildProfileEntries;
    } catch (error) {
      console.log('Error: ', error);
      return buildProfileEntries;
    }
  }

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
    newBuildProfile: MMBuildProfile,
    withBuildProfileEntries = false
  ): Promise<MMBuildProfile | undefined> {
    try {
      const addedBuildProfile = await addBuildProfile(newBuildProfile);
      if (withBuildProfileEntries && addedBuildProfile.id) {
        await saveBuildProfileEntries(
          addedBuildProfile.id,
          newBuildProfile.buildProfileEntries
        );
      }
      await readBuildProfiles();
      return addedBuildProfile;
    } catch (error) {
      console.log('Error: ', error);
      return newBuildProfile;
    }
  }

  async function updateBuildProfile(
    updateData: MMBuildProfile,
    withBuildProfileEntries = false
  ): Promise<MMBuildProfile | undefined> {
    try {
      const updatedBuildProfile = await saveBuildProfile(updateData);
      if (withBuildProfileEntries && updateData.id) {
        await saveBuildProfileEntries(
          updateData.id,
          updateData.buildProfileEntries
        );
      }
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
