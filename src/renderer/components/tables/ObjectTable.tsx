import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
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
import { MMObject } from '@rufrage/metamodel';
import { useContext, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Link, useNavigate } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ObjectsContext } from 'renderer/providers/ObjectsProvider';

interface ObjectTableProps {
  objectsFiltered: MMObject[];
}

export default function ObjectTable({ objectsFiltered }: ObjectTableProps) {
  const navigate = useNavigate();
  useHotkeys('ctrl+N', () => navigate('/objects/new'));

  const { readObjects } = useContext(ObjectsContext);
  const [objectsLoading, setObjectsLoading] = useState(false);

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <TableContainer sx={{ paddingTop: 2 }}>
        <Table aria-label="Objects table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 25 }}>
                <IconButton
                  component={Link}
                  to="/objects/new"
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
                      aria-label="Refresh objects list"
                      onClick={() => {
                        readObjects();
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
            {objectsFiltered.map((object) => (
              <TableRow
                key={object.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  {' '}
                </TableCell>
                <TableCell component="th" scope="row">
                  {object.name}
                </TableCell>
                <TableCell>{object.description}</TableCell>
                <TableCell align="right">
                  <Grid container justifyContent="flex-end">
                    <Grid item alignItems="end">
                      <IconButton
                        component={Link}
                        aria-label="Edit Object"
                        to={`/objects/${object.id}`}
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
