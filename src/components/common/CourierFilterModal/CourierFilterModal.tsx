import React from 'react';
import Modal from 'react-modal';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../SVGIcon';

import styles from './CourierFilterModal.module.sass';

export const CourierFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      onRequestClose={onClose}
      isOpen={isOpen}
      className={styles.modal}
    >
      <>
        <div className={styles.header}>
          <div className={styles.reset}>
            <SVGIcon name="reset" />
            <Typography className={styles.resetTitle}>Reset</Typography>
          </div>
          <Typography className={styles.title}>Filters</Typography>
          <Close className={styles.closeIcon} onClick={onClose} />
        </div>
        <div>123</div>
      </>
    </Modal>
  );
};
