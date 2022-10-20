import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MMEntity } from '@rufrage/metamodel';
import * as React from 'react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function not(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly string[], b: readonly string[]) {
  return [...a, ...not(b, a)];
}

interface TransferListProps {
  dataLst: MMEntity[];
  selectedLst: string[];
  setSelectedLst: Dispatch<SetStateAction<string[]>>;
}

export default function TransferList({
  dataLst,
  selectedLst,
  setSelectedLst,
}: TransferListProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([]);
  const [dataMap, setDataMap] = useState<Map<string, MMEntity>>(new Map());

  // All items that are on the checked list and on the left list
  const leftChecked = checked.filter((value) =>
    left ? left.indexOf(value) !== -1 : true
  );

  // All items that are on the checked list and on the right (selected) list
  const rightChecked = checked.filter(
    (value) => selectedLst.indexOf(value) !== -1
  );

  useEffect(() => {
    // Store templates in id-indexed map for easier access
    const tmpDataMap = new Map<string, MMEntity>();
    dataLst.reduce((result, entity) => {
      if (entity.id) {
        tmpDataMap.set(entity.id, entity);
      }
      return result;
    }, tmpDataMap);
    setDataMap(tmpDataMap);

    // When the dataLst or the selectedLst change, we update the left list
    const tmpLeft: string[] = [];
    dataLst.reduce((result, entity) => {
      if (entity.id && selectedLst.indexOf(entity.id) === -1) {
        result.push(entity.id);
      }
      return result;
    }, tmpLeft);
    setLeft(tmpLeft);
  }, [dataLst, selectedLst]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: string[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleArrowRight = () => {
    setSelectedLst(selectedLst.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleArrowLeft = () => {
    setLeft(left.concat(rightChecked));
    setSelectedLst(
      selectedLst.filter((value) => rightChecked.indexOf(value) === -1)
    );
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: string[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 400,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((entityId: string) => {
          const labelId = `transfer-list-all-item-${entityId}-label`;

          return (
            <ListItem
              key={entityId}
              role="listitem"
              button
              onClick={handleToggle(entityId)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(entityId) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={
                  dataMap.get(entityId)
                    ? dataMap.get(entityId)?.name
                    : 'Template could not be found'
                }
              />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleArrowRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleArrowLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', selectedLst)}</Grid>
    </Grid>
  );
}
