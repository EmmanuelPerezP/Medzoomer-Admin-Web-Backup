import { Button, Drawer, IconButton, Typography } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import React, { FC } from 'react';
import styles from './DrawerDispatch.module.sass';

interface Props {
  open: boolean;
  sizeSelected: number;
  onSelectAll: any;
  onUnselect?: any;
  onCreate: any;
}

export const DrawerDispatch: FC<Props> = (props) => {
  const { open, sizeSelected, onSelectAll, onUnselect, onCreate } = props;

  return (
    <Drawer anchor="bottom" variant="persistent" open={open}>
      <div className={styles.drawerDispatch}>
        <div>
          <IconButton color="secondary" onClick={onUnselect}>
            <RemoveCircleOutlineIcon />
          </IconButton>
          <Typography variant="body2" style={{ margin: '0 24px 0 12px' }}>
            {sizeSelected} order selected
          </Typography>
          <Button color="secondary" size="small" onClick={onSelectAll}>
            Select all
          </Button>
        </div>
        <Button
          onClick={onCreate}
          color="secondary"
          variant="contained"
          size="small"
          style={{ padding: '10px 20px 14px' }}
        >
          Create New Group
        </Button>
      </div>
    </Drawer>
  );
};
