import { Avatar, ListItemText, MenuItem } from '@mui/material';
import { NavLink, useMatch } from 'react-router-dom';

interface MenuListItemProps {
  route: string;
  label: string;
  hotkey: string;
  nested?: boolean;
}

export default function MenuListItem({
  route,
  label,
  hotkey,
  nested = false,
}: MenuListItemProps) {
  /**
   * Match the current route against this list element to check current selection.
   * If the nested flag is set, sub routes will be matched as well.
   */
  const selected = useMatch(nested ? `${route}*` : route);

  return (
    <MenuItem selected={selected != null} component={NavLink} to={route}>
      <ListItemText>{label}</ListItemText>
      <Avatar sx={{ width: 16, height: 16, fontSize: '0.75rem' }}>
        {hotkey}
      </Avatar>
    </MenuItem>
  );
}
