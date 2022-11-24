import { MMView } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import ViewFilter, {
  ViewFilterQuery,
} from 'renderer/components/filters/ViewFilter';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import ViewTable from 'renderer/components/tables/ViewTable';
import { ViewsContext } from 'renderer/providers/ViewsProvider';

export default function ViewListScreen() {
  const { views } = useContext(ViewsContext);
  const [filters, setFilters] = useState<ViewFilterQuery[]>([]);
  const [viewsFiltered, setViewsFiltered] = useState<MMView[]>([]);

  useEffect(() => {
    const newViewsFiltered = [
      ...views.filter((view) => {
        return filters.every((filter) => {
          if (filter.property in view) {
            const fieldVal = view[
              filter.property as keyof typeof view
            ] as string;
            return fieldVal.includes(filter.searchValue);
          }
          return false;
        });
      }),
    ];
    setViewsFiltered(newViewsFiltered);
  }, [filters, views]);

  return (
    <ScreenFrame name="Views">
      <ViewFilter filters={filters} setFilters={setFilters} />
      <ViewTable viewsFiltered={viewsFiltered} />
    </ScreenFrame>
  );
}
