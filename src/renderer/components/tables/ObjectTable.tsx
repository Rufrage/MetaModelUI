import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { MMObject } from '@rufrage/metamodel';
import { useHotkeys } from 'react-hotkeys-hook';
import { Link, useNavigate } from 'react-router-dom';

interface ObjectTableProps {
  objectsFiltered: MMObject[];
}

export default function ObjectTable({ objectsFiltered }: ObjectTableProps) {
  const navigate = useNavigate();
  useHotkeys('ctrl+N', () => navigate('/objects/new'));

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
