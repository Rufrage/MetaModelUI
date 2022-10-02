import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AutoAwesomeMosaicOutlined from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {
  Card,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import { MMTemplate, MMTemplateInputType } from '@rufrage/metamodel';
import { useContext, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Link, useNavigate } from 'react-router-dom';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';

interface TemplateTableProps {
  templatesFiltered: MMTemplate[];
}

export default function TemplateTable({
  templatesFiltered,
}: TemplateTableProps) {
  const navigate = useNavigate();
  useHotkeys('ctrl+N', () => navigate('/templates/new'));

  const { readTemplates } = useContext(TemplatesContext);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <TableContainer sx={{ paddingTop: 2 }}>
        <Table aria-label="Templates table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 25 }}>
                <IconButton
                  component={Link}
                  to="/templates/new"
                  color="primary"
                  sx={{ padding: 0 }}
                >
                  <AddCircleOutlinedIcon />
                </IconButton>
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Filepath</TableCell>
              <TableCell>Inputs</TableCell>
              <TableCell align="right">
                <Grid container justifyContent="flex-end">
                  <Grid item alignItems="end">
                    <IconButton
                      size="small"
                      aria-label="Refresh templates list"
                      onClick={() => {
                        readTemplates();
                      }}
                    >
                      <RefreshOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templatesFiltered.map((template) => (
              <TableRow
                key={template.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {' '}
                </TableCell>
                <TableCell component="th" scope="row">
                  {template.name}
                </TableCell>
                <TableCell>{template.filepath}</TableCell>
                <TableCell>
                  <Grid container spacing={2}>
                    {template.objectInputType ===
                    MMTemplateInputType.None ? null : (
                      <Grid item>
                        <Badge
                          color="secondary"
                          badgeContent={
                            template.objectInputType ===
                            MMTemplateInputType.Single
                              ? 1
                              : 'N'
                          }
                        >
                          <DataObjectOutlinedIcon />
                        </Badge>
                      </Grid>
                    )}
                    {template.viewInputType ===
                    MMTemplateInputType.None ? null : (
                      <Grid item>
                        <Badge
                          color="secondary"
                          badgeContent={
                            template.viewInputType ===
                            MMTemplateInputType.Single
                              ? 1
                              : 'N'
                          }
                        >
                          <AutoAwesomeMosaicOutlined />
                        </Badge>
                      </Grid>
                    )}
                  </Grid>
                </TableCell>
                <TableCell align="right">
                  <Grid container justifyContent="flex-end">
                    <Grid item alignItems="end">
                      <IconButton
                        component={Link}
                        aria-label="Edit Template"
                        to={`/templates/${template.id}`}
                        color="primary"
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
