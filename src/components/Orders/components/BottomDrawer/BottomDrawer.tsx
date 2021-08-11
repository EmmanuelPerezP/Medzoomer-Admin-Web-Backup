import styles from './BottomDrawer.module.sass';
import React, { FC } from 'react';
import { Button, Drawer } from '@material-ui/core';

import { IBottomDrawerProps } from './types';

const buttonStyles = {
  fontSize: 15,
  width: 144,
  height: 42,
  fontWeight: 400
};

const createButtonStyles = {
  ...buttonStyles,
  backgroundColor: '#006cf0'
};

const unselectButtonStyles = {
  ...buttonStyles,
  color: '#006cf0'
};

export const BottomDrawer: FC<IBottomDrawerProps> = ({ selectedItems, isOpen, onCreate, onUnselectAll }) => {
  return (
    <Drawer className={styles.drawer} anchor="bottom" variant="persistent" open={isOpen}>
      <div className={styles.drawerContainer}>
        <div className={styles.counterContainer}>Orders selected: {selectedItems}</div>

        <div className={styles.buttonContainer}>
          <Button variant="contained" size="small" color="primary" style={createButtonStyles} onClick={onCreate}>
            Create Delivery
          </Button>
        </div>

        <div className={styles.unselectContainer}>
          <Button variant="text" size="small" style={unselectButtonStyles} onClick={onUnselectAll}>
            Unselect all
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
