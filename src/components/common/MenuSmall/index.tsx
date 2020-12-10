import React, { FC } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

const ITEM_HEIGHT = 48;

interface MenuItem {
  icon: any;
  title: string;
  action: any;
  loading?: boolean;
}

interface MenuProps {
  options: MenuItem[];
}

const LongMenu: FC<MenuProps> = (props) => {
  const { options } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (onClick?: () => void) => {
    if (onClick) {
      onClick();
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  return (
    <div>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={() => handleClose(undefined)}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '22ch'
          }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {options.map((option, i) => (
          <MenuItem key={i} onClick={() => handleClose(option.action)} disabled={option.loading}>
            <ListItemIcon style={{ minWidth: 35 }}>{option.icon}</ListItemIcon>
            <Typography variant="inherit">{option.title}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LongMenu;
