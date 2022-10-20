import { AutoAwesomeMosaicOutlined } from '@mui/icons-material';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import {
  Badge,
  Collapse,
  Grid,
  IconButton,
  Paper,
  TableCell,
  TableRow,
} from '@mui/material';
import {
  MMBuildProfileEntry,
  MMTemplate,
  MMTemplateInputType,
} from '@rufrage/metamodel';
import { Fragment, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BuildProfileTransferList from 'renderer/components/lists/BuildProfileTransferList';

interface TemplateRowProps {
  buildProfileEntry: MMBuildProfileEntry;
  updateBuildProfileEntry: (
    templateId: string,
    newBuildProfileEntry: MMBuildProfileEntry
  ) => void;
  template?: MMTemplate;
}

export default function TemplateRow({
  buildProfileEntry,
  updateBuildProfileEntry,
  template = new MMTemplate('', ''),
}: TemplateRowProps) {
  const [open, setOpen] = useState<boolean>(false);

  const setSelectedObjects = (newSelectedObjects: string[]) => {
    buildProfileEntry.objectIDs = newSelectedObjects;
    updateBuildProfileEntry(buildProfileEntry.templateID, buildProfileEntry);
  };
  const setSelectedViews = (newSelectedViews: string[]) => {
    buildProfileEntry.viewIDs = newSelectedViews;
    updateBuildProfileEntry(buildProfileEntry.templateID, buildProfileEntry);
  };

  return (
    <Fragment key={`${template.name}_wrapper`}>
      <TableRow
        key={template.name}
        sx={{ '& > *': { borderBottom: 'unset' } }}
        selected={buildProfileEntry.active}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
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
