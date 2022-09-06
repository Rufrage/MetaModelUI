import { Avatar, ListItemText, MenuItem } from '@mui/material';
import { useHotkeys } from 'react-hotkeys-hook';
import { NavLink, useMatch, useNavigate } from 'react-router-dom';

interface MenuListItemProps {
  route: string;
  label: string;
  hotkey: string;
}

export default function MenuListItem({
  route,
  label,
  hotkey,
}: MenuListItemProps) {
  /** Match the current route against this list element to check current selection */
  const selected = useMatch(route);
  /** Call Link programmatically on hotkey press */
  const navigate = useNavigate();
  useHotkeys(hotkey, () => {
    navigate(route);
  });

  return (
    <MenuItem selected={selected != null} component={NavLink} to={route}>
      <ListItemText>{label}</ListItemText>
      <Avatar sx={{ width: 16, height: 16, fontSize: '0.75rem' }}>
        {hotkey}
      </Avatar>
    </MenuItem>
  );
}
