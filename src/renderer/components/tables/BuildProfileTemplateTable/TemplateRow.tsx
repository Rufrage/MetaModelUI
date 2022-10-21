import { AutoAwesomeMosaicOutlined } from '@mui/icons-material';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import {
  Badge,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  Paper,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  MMBuildProfileEntry,
  MMTemplate,
  MMTemplateInputType,
} from '@rufrage/metamodel';
import { Fragment, useContext, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BuildProfileTransferList from 'renderer/components/lists/BuildProfileTransferList';
import { GenerateContext } from 'renderer/providers/GenerateProvider';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';

interface TemplateRowProps {
  buildProfileEntry: MMBuildProfileEntry;
  template?: MMTemplate;
}

export default function TemplateRow({
  buildProfileEntry,
  template = new MMTemplate('', ''),
}: TemplateRowProps) {
  const { updateBuildProfileEntry, outOfSyncBuildProfileEntries } =
    useContext(GenerateContext);

  const [open, setOpen] = useState<boolean>(false);

  const setSelectedObjects = (newSelectedObjects: string[]) => {
    buildProfileEntry.objectIDs = newSelectedObjects;
    updateBuildProfileEntry(buildProfileEntry.templateID, buildProfileEntry);
  };
  const setSelectedViews = (newSelectedViews: string[]) => {
    buildProfileEntry.viewIDs = newSelectedViews;
    updateBuildProfileEntry(buildProfileEntry.templateID, buildProfileEntry);
  };
  const toggleActive = () => {
    buildProfileEntry.active = !buildProfileEntry.active;
    updateBuildProfileEntry(buildProfileEntry.templateID, buildProfileEntry);
  };

  return (
    <Fragment key={`${template.name}_wrapper`}>
      <TableRow
        key={template.name}
        sx={{ '& > *': { borderBottom: 'unset' } }}
        selected={buildProfileEntry.active}
      >
        <TableCell align="left">
          <Checkbox onClick={toggleActive} checked={buildProfileEntry.active} />
        </TableCell>
        <TableCell component="th" scope="row">
          {template.name}
        </TableCell>
        <TableCell sx={{ width: 200, maxWidth: 200 }}>
          <Grid container spacing={2}>
            {template.objectInputType === MMTemplateInputType.None ? null : (
              <Grid item>
                <Badge
                  color="secondary"
                  badgeContent={
                    template.objectInputType === MMTemplateInputType.Single
                      ? 1
                      : 'N'
                  }
                >
                  <DataObjectOutlinedIcon />
                </Badge>
              </Grid>
            )}
            {template.viewInputType === MMTemplateInputType.None ? null : (
              <Grid item>
                <Badge
                  color="secondary"
                  badgeContent={
                    template.viewInputType === MMTemplateInputType.Single
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
        <TableCell sx={{ width: 200, maxWidth: 200 }}>
          <Grid container spacing={2}>
            {outOfSyncBuildProfileEntries.includes(
              buildProfileEntry.templateID
            ) && (
              <Grid item>
                <Tooltip
                  title="This template input is out of sync with the general input."
                  placement="top"
                  arrow
                >
                  <SyncDisabledIcon />
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow key={`${template.name}_collapse`}>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper elevation={1} sx={{ padding: 2 }}>
              <BuildProfileTransferList
                title="Template Specific Input"
                selectedObjects={buildProfileEntry.objectIDs}
                selectedViews={buildProfileEntry.viewIDs}
                setSelectedObjects={setSelectedObjects}
                setSelectedViews={setSelectedViews}
              />
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
