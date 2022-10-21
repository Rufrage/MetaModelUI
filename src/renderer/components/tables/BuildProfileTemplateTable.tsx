import {
  Card,
  Checkbox,
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
import { GenerateContext } from 'renderer/providers/GenerateProvider';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';
import TemplateRow from './BuildProfileTemplateTable/TemplateRow';

export default function BuildProfileTemplateTable() {
  const { templates } = useContext(TemplatesContext);
  const { modifiedBuildProfileEntries, updateBuildProfileEntry } =
    useContext(GenerateContext);

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

  const numberOfChecked = (entries: Map<string, MMBuildProfileEntry>) => {
    let amountChecked = 0;
    Array.from(entries.values()).reduce((_result, entry) => {
      if (entry.active) {
        amountChecked += 1;
      }
      return amountChecked;
    }, amountChecked);
    return amountChecked;
  };

  const handleToggleAll = () => {
    const amountChecked = numberOfChecked(modifiedBuildProfileEntries);
    if (amountChecked === modifiedBuildProfileEntries.size) {
      modifiedBuildProfileEntries.forEach((entry) => {
        if (entry.active) {
          entry.active = false;
          updateBuildProfileEntry(entry.templateID, entry);
        }
      });
    } else {
      modifiedBuildProfileEntries.forEach((entry) => {
        if (!entry.active) {
          entry.active = true;
          updateBuildProfileEntry(entry.templateID, entry);
        }
      });
    }
  };

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6">Templates</Typography>
      <Grid container sx={{ paddingTop: 2 }}>
        <Grid item xs={12}>
          <TableContainer>
            <Table aria-label="Templates table">
              <TableHead>
                <TableRow>
                  <TableCell width={5}>
                    <Checkbox
                      onClick={handleToggleAll}
                      checked={
                        numberOfChecked(modifiedBuildProfileEntries) ===
                          modifiedBuildProfileEntries.size &&
                        modifiedBuildProfileEntries.size !== 0
                      }
                      indeterminate={
                        numberOfChecked(modifiedBuildProfileEntries) !==
                          modifiedBuildProfileEntries.size &&
                        numberOfChecked(modifiedBuildProfileEntries) !== 0
                      }
                    />
                  </TableCell>
                  <TableCell width={200}>Name</TableCell>
                  <TableCell width={200}>Inputs</TableCell>
                  <TableCell width={10} />
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(modifiedBuildProfileEntries).map(
                  ([templateId, buildProfileEntry]) => {
                    return (
                      <TemplateRow
                        key={`${templateId}_row`}
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
