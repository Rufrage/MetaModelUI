import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { MMObject } from '@rufrage/metamodel';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

class ObjectFilter {
  constructor(public property: string, public searchValue: string) {}
}

export default function ObjectsScreen() {
  const [filters, setFilters] = useState<ObjectFilter[]>([]);
  const [newFilterOpen, setNewFilterOpen] = useState(false);
  const [mmObjects, setMMObjects] = useState<MMObject[]>([
    new MMObject('Customer', 'A customer object'),
    new MMObject('Flight', 'A flight object'),
  ]);
  const [mmObjectsFiltered, setMMObjectsFiltered] = useState<MMObject[]>([
    ...mmObjects,
  ]);
  const [newFilter, setNewFilter] = useState(new ObjectFilter('', ''));

  useHotkeys('ctrl+F', () => setNewFilterOpen(true));
  useHotkeys('esc', () => setNewFilterOpen(false));

  useEffect(() => {
    const newMMObjectsFiltered = [
      ...mmObjects.filter((mmObject) => {
        return filters.every((filter) => {
          if (filter.property in mmObject) {
            const fieldVal = mmObject[
              filter.property as keyof typeof mmObject
            ] as string;
            return fieldVal.includes(filter.searchValue);
          }
          return false;
        });
      }),
    ];
    setMMObjectsFiltered(newMMObjectsFiltered);
  }, [filters, mmObjects]);

  const columnMapping = {
    name: 'Name',
    description: 'Description',
  };

  const getColumnMapping = (columnName: string) => {
    if (columnName in columnMapping) {
      return columnMapping[columnName as keyof typeof columnMapping];
    }
    return columnName;
  };

  const handleAddFilter = () => {
    if (
      newFilter.property.trim().length <= 0 ||
      newFilter.searchValue.trim().length <= 0
    ) {
      return;
    }
    const newFilters = [...filters];
    newFilters.push({
      property: newFilter.property,
      searchValue: newFilter.searchValue,
    });
    setFilters(newFilters);
    setNewFilter({
      property: '',
      searchValue: '',
    });
    setNewFilterOpen(false);
  };

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6">Objects</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} pt={2}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Card elevation={2} sx={{ padding: 2 }}>
              <Typography variant="h6">Filter</Typography>
              <Grid container sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Grid item xs={12}>
                  {filters.map((filter, index) => {
                    return (
                      <Chip
                        key={`filter_${filter.property}_${filter.searchValue}`}
                        label={`${getColumnMapping(filter.property)}: ${
                          filter.searchValue
                        }`}
                        onDelete={() => {
                          const newFilters = [...filters];
                          newFilters.splice(index, 1);
                          setFilters(newFilters);
                        }}
                        sx={{ marginRight: 2 }}
                      />
                    );
                  })}
                  <Tooltip
                    placement="right"
                    title={
                      <Grid container sx={{ minWidth: 150, padding: 2 }}>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Property *</InputLabel>
                            <Select
                              MenuProps={{
                                style: { zIndex: 1501 },
                              }}
                              value={newFilter.property}
                              label="Property *"
                              onChange={(event: SelectChangeEvent) =>
                                setNewFilter({
                                  ...newFilter,
                                  property: event.target.value,
                                })
                              }
                            >
                              <MenuItem value="name">Name</MenuItem>
                              <MenuItem value="description">
                                Description
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            sx={{ marginTop: 2 }}
                            fullWidth
                            label="Search *"
                            value={newFilter.searchValue}
                            variant="outlined"
                            onChange={(event) => {
                              setNewFilter({
                                ...newFilter,
                                searchValue: event.target.value,
                              });
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{ paddingTop: 2, justifyContent: 'flex-end' }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => setNewFilterOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            sx={{ marginLeft: 2 }}
                            variant="contained"
                            onClick={() => handleAddFilter()}
                          >
                            Add Filter
                          </Button>
                        </Grid>
                      </Grid>
                    }
                    open={newFilterOpen}
                    arrow
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() => setNewFilterOpen(!newFilterOpen)}
                    >
                      <AddIcon />
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Card>
            <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
              <TableContainer sx={{ paddingTop: 2 }}>
                <Table aria-label="Objects table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mmObjectsFiltered.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
