import { MMBuildProfile, MMBuildProfileEntry } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import BuildProfileFilter from 'renderer/components/filters/BuildProfileFilter';
import BuildProfileTransferList from 'renderer/components/lists/BuildProfileTransferList';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import BuildProfileTemplateTable from 'renderer/components/tables/BuildProfileTemplateTable';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';

export default function GenerateListScreen() {
  const { readBuildProfile } = useContext(BuildProfilesContext);

  const [selectedBuildProfile, setSelectedBuildProfile] = useState('-');
  const [buildProfile, setBuildProfile] = useState<MMBuildProfile>();

  const [modifiedBuildProfileEntries, setModifiedBuildProfileEntries] =
    useState<Map<string, MMBuildProfileEntry>>(new Map());

  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedViews, setSelectedViews] = useState<string[]>([]);

  const { templates } = useContext(TemplatesContext);

  useEffect(() => {
    if (selectedBuildProfile === '-') {
      setBuildProfile(undefined);
    } else {
      // Fetch MMBuildProfile for selected ID and set as buildProfile
      const fetchReadBuildProfile = async () => {
        const tmpReadBuildProfile = await readBuildProfile(
          selectedBuildProfile,
          true
        );
        setBuildProfile(tmpReadBuildProfile);
      };
      fetchReadBuildProfile();
    }
  }, [readBuildProfile, selectedBuildProfile]);

  useEffect(() => {
    if (buildProfile) {
      setSelectedObjects(buildProfile.objectIDs);
      setSelectedViews(buildProfile.viewIDs);
    } else {
      setSelectedObjects([]);
      setSelectedViews([]);
    }
  }, [buildProfile]);

  useEffect(() => {
    // The build profile entries will be constructed from already selected templates and extended by all remaining templates
    const tmpBuildProfileEntries: Map<string, MMBuildProfileEntry> = new Map();
    // First, if a buildProfile is selected, we add all of its entries
    if (buildProfile) {
      buildProfile.buildProfileEntries.forEach((entry) => {
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
            buildProfile?.id ? buildProfile.id : '',
            template.id,
            false
          )
        );
      }
      return result;
    }, tmpBuildProfileEntries);
    setModifiedBuildProfileEntries(tmpBuildProfileEntries);
  }, [buildProfile, templates]);

  const updateBuildProfileEntry = (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => {
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
    <ScreenFrame name="Generate">
      <BuildProfileFilter
        selectedBuildProfile={selectedBuildProfile}
        setSelectedBuildProfile={setSelectedBuildProfile}
      />
      <BuildProfileTransferList
        title="General Input"
        selectedObjects={selectedObjects}
        selectedViews={selectedViews}
        setSelectedObjects={updateSelectedObjects}
        setSelectedViews={updateSelectedViews}
      />
      <BuildProfileTemplateTable
        buildProfileEntries={modifiedBuildProfileEntries}
        updateBuildProfileEntry={updateBuildProfileEntry}
      />
    </ScreenFrame>
  );
}
