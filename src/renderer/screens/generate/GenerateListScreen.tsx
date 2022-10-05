import { MMTemplate } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import TemplateFilter, {
  TemplateFilterQuery,
} from 'renderer/components/filters/TemplateFilter';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';
import TemplateTable from 'renderer/components/tables/TemplateTable';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';

export default function GenerateListScreen() {
  const { templates } = useContext(TemplatesContext);
  const [filters, setFilters] = useState<TemplateFilterQuery[]>([]);
  const [templatesFiltered, setTemplatesFiltered] = useState<MMTemplate[]>([]);

  useEffect(() => {
    const newTemplatesFiltered = [
      ...templates.filter((template) => {
        return filters.every((filter) => {
          if (filter.property in template) {
            const fieldVal = template[
              filter.property as keyof typeof template
            ] as string;
            return fieldVal.includes(filter.searchValue);
          }
          return false;
        });
      }),
    ];
    setTemplatesFiltered(newTemplatesFiltered);
  }, [filters, templates]);

  return (
    <ScreenFrame name="Generate">
      <TemplateFilter filters={filters} setFilters={setFilters} />
      <TemplateTable
        templatesFiltered={templatesFiltered}
        withInsert={false}
        withEdit={false}
        withFilepath={false}
      />
    </ScreenFrame>
  );
}
