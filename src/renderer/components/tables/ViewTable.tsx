import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
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
import { MMView } from '@rufrage/metamodel';
import { useContext, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Link, useNavigate } from 'react-router-dom';
import { ViewsContext } from 'renderer/providers/ViewsProvider';

interface ViewTableProps {
  viewsFiltered: MMView[];
}

export default function ViewTable({ viewsFiltered }: ViewTableProps) {
  const navigate = useNavigate();
  useHotkeys('ctrl+N', () => navigate('/views/new'));

  const { readViews } = useContext(ViewsContext);
  const [viewsLoading, setViewsLoading] = useState(false);

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <TableContainer sx={{ paddingTop: 2 }}>
        <Table aria-label="Views table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 25 }}>
                <IconButton
                  component={Link}
                  to="/views/new"
                  color="primary"
                  sx={{ padding: 0 }}
                >
                  <AddCircleOutlinedIcon />
                </IconButton>
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">
                <Grid container justifyContent="flex-end">
                  <Grid item alignItems="end">
                    <IconButton
                      size="small"
                      aria-label="Refresh views list"
                      onClick={() => {
                        readViews();
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
            {viewsFiltered.map((view) => (
              <TableRow
                key={view.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {' '}
                </TableCell>
                <TableCell component="th" scope="row">
                  {view.name}
                </TableCell>
                <TableCell>{view.description}</TableCell>
                <TableCell align="right">
                  <Grid container justifyContent="flex-end">
                    <Grid item alignItems="end">
                      <IconButton
                        component={Link}
                        aria-label="Edit View"
                        to={`/views/${view.id}`}
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
