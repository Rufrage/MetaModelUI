import { MMBuildProfile } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import BuildProfileFilter from 'renderer/components/filters/BuildProfileFilter';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import BuildProfileTemplateTable from 'renderer/components/tables/BuildProfileTemplateTable';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';

export default function GenerateListScreen() {
  const { readBuildProfile } = useContext(BuildProfilesContext);

  const [selectedBuildProfile, setSelectedBuildProfile] = useState('-');
  const [buildProfile, setBuildProfile] = useState<MMBuildProfile>();

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

  return (
    <ScreenFrame name="Generate">
      <BuildProfileFilter
        selectedBuildProfile={selectedBuildProfile}
        setSelectedBuildProfile={setSelectedBuildProfile}
      />
      <BuildProfileTemplateTable buildProfile={buildProfile} />
    </ScreenFrame>
  );
}
