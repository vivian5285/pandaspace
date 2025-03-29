import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'custom') => {
    toggleTheme(mode);
    handleClose();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'custom':
        return <PaletteIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  return (
    <>
      <Tooltip title="切换主题">
        <IconButton
          onClick={handleClick}
          color="inherit"
          aria-label="theme toggle"
        >
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('light')}>
          <ListItemIcon>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>浅色模式</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')}>
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>深色模式</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('custom')}>
          <ListItemIcon>
            <PaletteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>自定义主题</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeToggle; 