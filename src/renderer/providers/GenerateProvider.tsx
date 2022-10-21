import { MMBuildProfile, MMBuildProfileEntry } from '@rufrage/metamodel';
import { createContext, useContext, useEffect, useState } from 'react';
import { BuildProfilesContext } from './BuildProfileProvider';
import { TemplatesContext } from './TemplatesProvider';

export type GenerateContextContent = {
  // The currently selected build profile
  selectedBuildProfile: string;
  // The setter for the currently selected build profile
  setSelectedBuildProfile: React.Dispatch<React.SetStateAction<string>>;
  // The MMBuildProfile for the currently selected Build Profile or undefined if none is selected
  currentBuildProfile: MMBuildProfile | undefined;

  // The Build Profile Entries for the current Build Profile. Initialized from the Build Profile,
  // then updated via client. Can be saved back to the Build Profile.
  modifiedBuildProfileEntries: Map<string, MMBuildProfileEntry>;
  // A function to update an entry based on the corresponding templateId.
  updateBuildProfileEntry: (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => void;

  // The currently selected objects from the general inputs
  selectedObjects: string[];
  // The update function for the currently selected objects
  updateSelectedObjects: (newSelectedObjects: string[]) => void;
  // The currently selected views from the general inputs
  selectedViews: string[];
  // The update function for the currently selected views
  updateSelectedViews: (newSelectedViews: string[]) => void;
};

export const GenerateContext = createContext<GenerateContextContent>({
  selectedBuildProfile: '-',
  setSelectedBuildProfile: () => {},
  currentBuildProfile: undefined,
  modifiedBuildProfileEntries: new Map(),
  updateBuildProfileEntry: () => {},
  selectedObjects: [],
  updateSelectedObjects: () => {},
  selectedViews: [],
  updateSelectedViews: () => {},
});

interface GenerateProviderProps {
  children: JSX.Element | JSX.Element[];
}

export default function GenerateProvider({ children }: GenerateProviderProps) {
  const { readBuildProfile } = useContext(BuildProfilesContext);
  const { templates } = useContext(TemplatesContext);

  const [selectedBuildProfile, setSelectedBuildProfile] = useState('-');
  const [currentBuildProfile, setCurrentBuildProfile] = useState<
    MMBuildProfile | undefined
  >();
  const [modifiedBuildProfileEntries, setModifiedBuildProfileEntries] =
    useState<Map<string, MMBuildProfileEntry>>(new Map());

  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedViews, setSelectedViews] = useState<string[]>([]);

  // Fetches / Resets the build profile after changes in the corresponding dropdown
  useEffect(() => {
    if (selectedBuildProfile === '-') {
      setCurrentBuildProfile(undefined);
    } else {
      // Fetch MMBuildProfile for selected ID and set as buildProfile
      const fetchReadBuildProfile = async () => {
        const tmpReadBuildProfile = await readBuildProfile(
          selectedBuildProfile,
          true
        );
        setCurrentBuildProfile(tmpReadBuildProfile);
      };
      fetchReadBuildProfile();
    }
  }, [readBuildProfile, selectedBuildProfile]);

  // Initializes / Updates the list of Objects/Views that are selected in the general input transfer list
  useEffect(() => {
    if (currentBuildProfile) {
      setSelectedObjects(currentBuildProfile.objectIDs);
      setSelectedViews(currentBuildProfile.viewIDs);
    } else {
      setSelectedObjects([]);
      setSelectedViews([]);
    }
  }, [currentBuildProfile]);

  // Initializes / Updates the list of Objects/Views that are selected in the general input transfer list
  useEffect(() => {
    if (currentBuildProfile) {
      setSelectedObjects(currentBuildProfile.objectIDs);
      setSelectedViews(currentBuildProfile.viewIDs);
    } else {
      setSelectedObjects([]);
      setSelectedViews([]);
    }
  }, [currentBuildProfile]);

  useEffect(() => {
    // The build profile entries will be constructed from already selected templates and extended by all remaining templates
    const tmpBuildProfileEntries: Map<string, MMBuildProfileEntry> = new Map();
    // First, if a buildProfile is selected, we add all of its entries
    if (currentBuildProfile) {
      currentBuildProfile.buildProfileEntries.forEach((entry) => {
        tmpBuildProfileEntries.set(entry.templateID, entry);
      });
    }
    // Next, we check each template and if it is not yet included, we add a new inactive build profile entry for it
    templates.reduce((result, template) => {
      if (template.id && !result.has(template.id)) {
        result.set(
          template.id,
          new MMBuildProfileEntry(
            '',
            '',
            currentBuildProfile?.id ? currentBuildProfile.id : '',
            template.id,
            false
          )
        );
      }
      return result;
    }, tmpBuildProfileEntries);
    setModifiedBuildProfileEntries(tmpBuildProfileEntries);
  }, [currentBuildProfile, templates]);

  const updateBuildProfileEntry = (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => {
    console.log('update called: ', newBuildProfileEntry);
    const newBuildProfileEntries = new Map(modifiedBuildProfileEntries);
    newBuildProfileEntries.set(templateId, newBuildProfileEntry);
    setModifiedBuildProfileEntries(newBuildProfileEntries);
  };

  const updateSelectedObjects = (newSelectedObjects: string[]) => {
    setSelectedObjects((currentSelectedObjects) => {
      if (newSelectedObjects.length > currentSelectedObjects.length) {
        // New Objects were added
        const addedObjects = newSelectedObjects.filter(
          (o) => !currentSelectedObjects.includes(o)
        );
        const newBuildProfileEntries = new Map(modifiedBuildProfileEntries);
        newBuildProfileEntries.forEach((buildProfileEntry) => {
          addedObjects.forEach((addedObject) =>
            buildProfileEntry.addObjectID(addedObject)
          );
        });
        setModifiedBuildProfileEntries(newBuildProfileEntries);
      } else {
        // Objects were removed
        const removedObjects = currentSelectedObjects.filter(
          (o) => !newSelectedObjects.includes(o)
        );
        const newBuildProfileEntries = new Map(modifiedBuildProfileEntries);
        newBuildProfileEntries.forEach((buildProfileEntry) => {
          buildProfileEntry.objectIDs = buildProfileEntry.objectIDs.filter(
            (objectId) => {
              return !removedObjects.includes(objectId);
            }
          );
        });
        setModifiedBuildProfileEntries(newBuildProfileEntries);
      }
      return newSelectedObjects;
    });
  };

  const updateSelectedViews = (newSelectedViews: string[]) => {
    setSelectedViews((currentSelectedViews) => {
      if (newSelectedViews.length > currentSelectedViews.length) {
        // New Views were added
        const addedViews = newSelectedViews.filter(
          (o) => !currentSelectedViews.includes(o)
        );
        const newBuildProfileEntries = new Map(modifiedBuildProfileEntries);
        newBuildProfileEntries.forEach((buildProfileEntry) => {
          addedViews.forEach((addedView) =>
            buildProfileEntry.addViewID(addedView)
          );
        });
        setModifiedBuildProfileEntries(newBuildProfileEntries);
      } else {
        // Views were removed
        const removedViews = currentSelectedViews.filter(
          (o) => !newSelectedViews.includes(o)
        );
        const newBuildProfileEntries = new Map(modifiedBuildProfileEntries);
        newBuildProfileEntries.forEach((buildProfileEntry) => {
          buildProfileEntry.viewIDs = buildProfileEntry.viewIDs.filter(
            (viewId) => {
              return !removedViews.includes(viewId);
            }
          );
        });
        setModifiedBuildProfileEntries(newBuildProfileEntries);
      }
      return newSelectedViews;
    });
  };

  return (
    <GenerateContext.Provider
      value={{
        selectedBuildProfile,
        setSelectedBuildProfile,
        currentBuildProfile,
        selectedObjects,
        updateSelectedObjects,
        selectedViews,
        updateSelectedViews,
        modifiedBuildProfileEntries,
        updateBuildProfileEntry,
      }}
    >
      {children}
    </GenerateContext.Provider>
  );
}
