import { MMBuildProfile } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import BuildProfileFilter from 'renderer/components/filters/BuildProfileFilter';
import BuildProfileTransferList from 'renderer/components/lists/BuildProfileTransferList';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import BuildProfileTemplateTable from 'renderer/components/tables/BuildProfileTemplateTable';
import { BuildProfilesContext } from 'renderer/providers/BuildProfileProvider';

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
        console.log(tmpReadBuildProfile);
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
      <BuildProfileTransferList buildProfile={buildProfile} />
      <BuildProfileTemplateTable buildProfile={buildProfile} />
    </ScreenFrame>
  );
}
