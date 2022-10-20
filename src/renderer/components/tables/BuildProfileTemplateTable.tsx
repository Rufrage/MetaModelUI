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
import {
  MMBuildProfile,
  MMBuildProfileEntry,
  MMTemplate,
} from '@rufrage/metamodel';
import { useContext, useEffect, useState } from 'react';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';
import TemplateRow from './BuildProfileTemplateTable/TemplateRow';

interface BuildProfileTemplateTableProps {
  buildProfile: MMBuildProfile | undefined;
}

export default function BuildProfileTemplateTable({
  buildProfile,
}: BuildProfileTemplateTableProps) {
  const { templates } = useContext(TemplatesContext);
  const [templateMap, setTemplateMap] = useState<Map<string, MMTemplate>>(
    new Map()
  );
  const [buildProfileEntries, setBuildProfileEntries] = useState<
    Map<string, MMBuildProfileEntry>
  >(new Map());

  const updateBuildProfileEntry = (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => {
    const newBuildProfileEntries = new Map(buildProfileEntries);
    newBuildProfileEntries.set(templateId, newBuildProfileEntry);
    setBuildProfileEntries(newBuildProfileEntries);
  };

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
