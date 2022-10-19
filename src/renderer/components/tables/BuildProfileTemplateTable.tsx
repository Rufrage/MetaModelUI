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
import { MMBuildProfile, MMTemplate } from '@rufrage/metamodel';
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
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  useEffect(() => {
    if (buildProfile) {
      const tmpSelectedTemplates: string[] = [];
      buildProfile.buildProfileEntries?.forEach((buildProfileEntry) => {
        if (buildProfileEntry && buildProfileEntry.templateID) {
          tmpSelectedTemplates.push(buildProfileEntry.templateID);
        }
      });
      setSelectedTemplates(tmpSelectedTemplates);
    }
  }, [buildProfile]);

  const isTemplateSelected = (template: MMTemplate) => {
    return template && template.id && selectedTemplates?.includes(template.id);
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
                  <TableCell width={10} />
                  <TableCell width={200}>Name</TableCell>
                  <TableCell width={200}>Inputs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buildProfile &&
                  templates.filter(isTemplateSelected).map((template) => {
                    return <TemplateRow template={template} selected />;
                  })}
                {templates
                  .filter((template) => !isTemplateSelected(template))
                  .map((template) => {
                    return <TemplateRow template={template} />;
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Card>
  );
}
