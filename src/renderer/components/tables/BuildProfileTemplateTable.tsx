import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MMBuildProfileEntry, MMTemplate } from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';
import TemplateRow from './BuildProfileTemplateTable/TemplateRow';

interface BuildProfileTemplateTableProps {
  buildProfileEntries: Map<string, MMBuildProfileEntry>;
  updateBuildProfileEntry: (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => void;
}

export default function BuildProfileTemplateTable({
  buildProfileEntries,
  updateBuildProfileEntry,
}: BuildProfileTemplateTableProps) {
  const { templates } = useContext(TemplatesContext);
  const [templateMap, setTemplateMap] = useState<Map<string, MMTemplate>>(
    new Map()
  );

  useEffect(() => {
    // Store templates in id-indexed map for easier access
    const tmpTemplateMap = new Map<string, MMTemplate>();
    templates.reduce((result, template) => {
      if (template.id) {
        tmpTemplateMap.set(template.id, template);
      }
      return result;
    }, tmpTemplateMap);
    setTemplateMap(tmpTemplateMap);
  }, [templates]);

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6">Templates</Typography>
      <Grid container sx={{ paddingTop: 2 }}>
        <Grid item xs={12}>
          <TableContainer>
            <Table aria-label="Templates table">
              <TableHead>
                <TableRow>
                  <TableCell width={10} />
                  <TableCell width={200}>Name</TableCell>
                  <TableCell width={200}>Inputs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(buildProfileEntries).map(
                  ([templateId, buildProfileEntry]) => {
                    return (
                      <TemplateRow
                        key={`${templateId}_row`}
                        updateBuildProfileEntry={updateBuildProfileEntry}
                        buildProfileEntry={buildProfileEntry}
                        template={templateMap.get(templateId)}
                      />
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Card>
  );
}
