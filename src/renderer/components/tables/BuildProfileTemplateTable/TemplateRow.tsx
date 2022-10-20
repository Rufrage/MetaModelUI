import { AutoAwesomeMosaicOutlined } from '@mui/icons-material';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import {
  Badge,
  Collapse,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import {
  MMBuildProfileEntry,
  MMTemplate,
  MMTemplateInputType,
} from '@rufrage/metamodel';
import { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface TemplateRowProps {
  buildProfileEntry: MMBuildProfileEntry;
  template?: MMTemplate;
}

export default function TemplateRow({
  buildProfileEntry,
  template = new MMTemplate('', ''),
}: TemplateRowProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TableRow key={template.name} sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Typography variant="body1">Test</Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
