import React, { FC } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './RemoveRelatedUserModal.module.sass';

interface ConfirmationModalProps {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  handleModal: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
  const { title = '', subtitle = '', isOpen, handleModal, loading, onConfirm } = props;

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={handleModal}
      isOpen={isOpen}
      className={styles.modal}
    >
      <Typography className={styles.title}>{title}</Typography>

      <div className={styles.content}>{subtitle}</div>

      <div className={styles.buttonWrapper}>
        <Button className={styles.apply} variant="contained" color="secondary" disabled={loading} onClick={onConfirm}>
          <Typography>{'Confirm'}</Typography>
        </Button>

        <div onClick={handleModal} className={styles.cancelBtn}>
          Cancel
        </div>
      </div>
    </Modal>
  );
};
