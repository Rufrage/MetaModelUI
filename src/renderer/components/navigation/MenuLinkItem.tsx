import {
  Avatar,
  ListItemText,
  MenuItem,
  Icon,
  ListItemIcon,
} from '@mui/material';
import { ReactNode } from 'react';
import { NavLink, useMatch } from 'react-router-dom';

interface MenuListItemProps {
  route: string;
  label: string;
  hotkey: string;
  nested?: boolean;
  icon?: ReactNode;
}

export default function MenuListItem({
  route,
  label,
  hotkey,
  nested = false,
  icon = null,
}: MenuListItemProps) {
  /**
   * Match the current route against this list element to check current selection.
   * If the nested flag is set, sub routes will be matched as well.
   */
  const selected = useMatch(nested ? `${route}*` : route);

  return (
    <MenuItem selected={selected != null} component={NavLink} to={route}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
      <Avatar sx={{ width: 16, height: 16, fontSize: '0.75rem' }}>
        {hotkey}
      </Avatar>
    </MenuItem>
  );
}
