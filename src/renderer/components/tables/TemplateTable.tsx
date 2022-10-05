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
  Typography,
} from '@mui/material';
import Badge from '@mui/material/Badge';
import { MMTemplate, MMTemplateInputType } from '@rufrage/metamodel';
import { useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Link, useNavigate } from 'react-router-dom';
import { TemplatesContext } from 'renderer/providers/TemplatesProvider';

interface TemplateTableProps {
  templatesFiltered: MMTemplate[];
  withInsert?: boolean;
  withEdit?: boolean;

  withName?: boolean;
  withDescription?: boolean;
  withFilepath?: boolean;
}

export default function TemplateTable({
  templatesFiltered,
  withInsert = true,
  withEdit = true,
  withName = true,
  withDescription = true,
  withFilepath = true,
}: TemplateTableProps) {
  const navigate = useNavigate();
  useHotkeys('ctrl+N', () => navigate('/templates/new'));

  const { readTemplates } = useContext(TemplatesContext);

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <Grid container justifyContent="right" sx={{ padding: 1 }}>
        <IconButton
          component={Link}
          to="/templates/new"
          color="primary"
          sx={{
            padding: 0,
            visibility: withInsert ? 'visible' : 'hidden',
          }}
        >
          <AddCircleOutlinedIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="Refresh templates list"
          onClick={() => {
            readTemplates();
          }}
        >
          <RefreshOutlinedIcon fontSize="small" />
        </IconButton>
      </Grid>
      <TableContainer>
        <Table aria-label="Templates table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 25 }}> </TableCell>
              {withName && <TableCell width={200}>Name</TableCell>}
              {withDescription && (
                <TableCell width={500}>
                  <Typography variant="body2" noWrap>
                    Description
                  </Typography>
                </TableCell>
              )}
              {withFilepath && (
                <TableCell width={500}>
                  <Typography variant="body2" noWrap>
                    Filepath
                  </Typography>
                </TableCell>
              )}
              <TableCell width={200}>Inputs</TableCell>
              <TableCell align="right"> </TableCell>
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
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: 200, maxWidth: 200 }}
                >
                  <Typography variant="body2" noWrap>
                    {template.name}
                  </Typography>
                </TableCell>
                {withDescription && (
                  <TableCell sx={{ width: 500, maxWidth: 500 }}>
                    <Typography variant="body2" noWrap>
                      {template.description}
                    </Typography>
                  </TableCell>
                )}
                {withFilepath && (
                  <TableCell sx={{ width: 500, maxWidth: 500 }}>
                    <Typography variant="body2" noWrap>
                      {template.filepath}
                    </Typography>
                  </TableCell>
                )}
                <TableCell sx={{ width: 200, maxWidth: 200 }}>
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
                      {withEdit && (
                        <IconButton
                          component={Link}
                          aria-label="Edit Template"
                          to={`/templates/${template.id}`}
                          color="primary"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      )}
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
