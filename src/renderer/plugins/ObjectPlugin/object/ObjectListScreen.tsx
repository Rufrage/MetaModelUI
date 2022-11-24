import { MMObject } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import ObjectFilter, {
  ObjectFilterQuery,
} from 'renderer/components/filters/ObjectFilter';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import ObjectTable from 'renderer/components/tables/ObjectTable';
import { ObjectsContext } from 'renderer/providers/ObjectsProvider';

export default function ObjectListScreen() {
  const { objects } = useContext(ObjectsContext);
  const [filters, setFilters] = useState<ObjectFilterQuery[]>([]);
  const [objectsFiltered, setObjectsFiltered] = useState<MMObject[]>([]);

  useEffect(() => {
    const newObjectsFiltered = [
      ...objects.filter((object) => {
        return filters.every((filter) => {
          if (filter.property in object) {
            const fieldVal = object[
              filter.property as keyof typeof object
            ] as string;
            return fieldVal.includes(filter.searchValue);
          }
          return false;
        });
      }),
    ];
    setObjectsFiltered(newObjectsFiltered);
  }, [filters, objects]);

  return (
    <ScreenFrame name="Objects">
      <ObjectFilter filters={filters} setFilters={setFilters} />
      <ObjectTable objectsFiltered={objectsFiltered} />
    </ScreenFrame>
  );
}
