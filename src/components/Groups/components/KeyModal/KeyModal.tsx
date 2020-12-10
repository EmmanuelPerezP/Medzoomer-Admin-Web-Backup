import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';

import SVGIcon from '../../../common/SVGIcon';

import styles from './KeyModal.module.sass';

export const KeyModal = ({ keys, onClose, isOpen }: { keys: any; onClose: any; isOpen: any }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    setKey(Buffer.from(`${keys.publicKey}:${keys.secretKey}`).toString('base64'));
  }, [keys]);

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={onClose}
      isOpen={isOpen}
      className={styles.modal}
    >
      <div className={styles.header}>
        <Typography className={styles.title}>Private key</Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        <div className={styles.select}>
          <Typography className={styles.label}>{key}</Typography>
        </div>
      </div>
    </Modal>
  );
};
