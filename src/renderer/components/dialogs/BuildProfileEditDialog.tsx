import SaveIcon from '@mui/icons-material/Save';
import { Box, Dialog, IconButton, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import { GenerateContext } from 'renderer/providers/GenerateProvider';
import BuildProfileFormScreen from 'renderer/screens/buildProfile/BuildProfileFormScreen';

export default function BuildProfileEditDialog({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const { currentBuildProfile } = useContext(GenerateContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Save this Build Profile" arrow placement="top">
        <span>
          <IconButton
            onClick={handleClickOpen}
            disabled={disabled}
            aria-label="edit"
            color="primary"
          >
            <SaveIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
          }}
        >
          <BuildProfileFormScreen
            id={currentBuildProfile ? currentBuildProfile?.id : 'new'}
            close={() => {
              handleClose();
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
