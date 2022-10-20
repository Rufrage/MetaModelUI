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

  const [buildProfileEntries, setBuildProfileEntries] = useState<
    Map<string, MMBuildProfileEntry>
  >(new Map());

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
    setBuildProfileEntries(tmpBuildProfileEntries);
  }, [buildProfile, templates]);

  const updateBuildProfileEntry = (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => {
    const newBuildProfileEntries = new Map(buildProfileEntries);
    newBuildProfileEntries.set(templateId, newBuildProfileEntry);
    setBuildProfileEntries(newBuildProfileEntries);
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
        setSelectedObjects={setSelectedObjects}
        setSelectedViews={setSelectedViews}
      />
      <BuildProfileTemplateTable
        buildProfileEntries={buildProfileEntries}
        updateBuildProfileEntry={updateBuildProfileEntry}
      />
    </ScreenFrame>
  );
}
