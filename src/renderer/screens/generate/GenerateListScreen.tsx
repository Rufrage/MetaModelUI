import { useContext } from 'react';
import BuildProfileFilter from 'renderer/components/filters/BuildProfileFilter';
import BuildProfileTransferList from 'renderer/components/lists/BuildProfileTransferList';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import BuildProfileTemplateTable from 'renderer/components/tables/BuildProfileTemplateTable';
import { GenerateContext } from 'renderer/providers/GenerateProvider';

export default function GenerateListScreen() {
  const {
    selectedObjects,
    selectedViews,
    updateSelectedObjects,
    updateSelectedViews,
  } = useContext(GenerateContext);

  return (
    <ScreenFrame name="Generate">
      <BuildProfileFilter />
      <BuildProfileTransferList
        title="General Input"
        selectedObjects={selectedObjects}
        selectedViews={selectedViews}
        setSelectedObjects={updateSelectedObjects}
        setSelectedViews={updateSelectedViews}
      />
      <BuildProfileTemplateTable />
    </ScreenFrame>
  );
}
