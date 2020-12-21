import React, { FC } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './ConfirmationModal.module.sass';

interface ConfirmationModalProps {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  handleModal: () => void;
  onConfirm?: () => void;
  loading?: boolean;
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
      {title && <Typography className={styles.title}>{title}</Typography>}

      {subtitle && <div className={styles.content}>{subtitle}</div>}

      <div className={styles.buttonWrapper}>
        {onConfirm ? (
          <>
            <Button
              className={styles.apply}
              variant="contained"
              color="secondary"
              disabled={loading}
              onClick={onConfirm}
            >
              <Typography>{'Confirm'}</Typography>
            </Button>

            <div onClick={handleModal} className={styles.cancelBtn}>
              {'Cancel'}
            </div>
          </>
        ) : (
          <Button className={styles.apply} variant="contained" color="secondary" onClick={handleModal}>
            <Typography>{'Ok'}</Typography>
          </Button>
        )}
      </div>
    </Modal>
  );
};
