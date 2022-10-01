import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export class TemplateFilterQuery {
  constructor(public property: string, public searchValue: string) {}
}

interface TemplateFilterProps {
  filters: TemplateFilterQuery[];
  setFilters: Dispatch<SetStateAction<TemplateFilterQuery[]>>;
}

const columnMapping = {
  name: 'Name',
  filepath: 'Filepath',
  description: 'Description',
};

const getColumnMapping = (columnName: string) => {
  if (columnName in columnMapping) {
    return columnMapping[columnName as keyof typeof columnMapping];
  }
  return columnName;
};

export default function TemplateFilter({
  filters,
  setFilters,
}: TemplateFilterProps) {
  const [newFilterOpen, setNewFilterOpen] = useState(false);
  const [newFilter, setNewFilter] = useState(new TemplateFilterQuery('', ''));

  useHotkeys('ctrl+F', () => setNewFilterOpen(true));
  useHotkeys('esc', () => setNewFilterOpen(false));

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
    <Card elevation={2} sx={{ padding: 2 }}>
      <Typography variant="h6">Filter</Typography>
      <Grid container sx={{ paddingTop: 2 }}>
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
                      <MenuItem value="filepath">Filepath</MenuItem>
                      <MenuItem value="description">Description</MenuItem>
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
              startIcon={<AddIcon />}
              onClick={() => setNewFilterOpen(!newFilterOpen)}
            >
              Add Filter
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Card>
  );
}
