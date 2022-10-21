import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Card, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { SyntheticEvent, useContext, useState } from 'react';
import { ObjectsContext } from 'renderer/providers/ObjectsProvider';
import { ViewsContext } from 'renderer/providers/ViewsProvider';
import TransferList from './TransferList';

interface BuildProfileTransferListProps {
  title: string;
  selectedObjects: string[];
  selectedViews: string[];
  setSelectedObjects: (newSelectedObjects: string[]) => void;
  setSelectedViews: (newSelectedViews: string[]) => void;
}

export default function BuildProfileTransferList({
  title,
  selectedObjects,
  selectedViews,
  setSelectedObjects,
  setSelectedViews,
}: BuildProfileTransferListProps) {
  const { objects } = useContext(ObjectsContext);
  const { views } = useContext(ViewsContext);

  const [selectedTab, setSelectedTab] = useState('1');
  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Grid container sx={{ paddingTop: 2 }}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={selectedTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange}>
                <Tab label="Objects" value="1" />
                <Tab label="Views" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TransferList
                dataLst={objects}
                selectedLst={selectedObjects}
                setSelectedLst={setSelectedObjects}
              />
            </TabPanel>
            <TabPanel value="2">
              <TransferList
                dataLst={views}
                selectedLst={selectedViews}
                setSelectedLst={setSelectedViews}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
    </Card>
  );
}
