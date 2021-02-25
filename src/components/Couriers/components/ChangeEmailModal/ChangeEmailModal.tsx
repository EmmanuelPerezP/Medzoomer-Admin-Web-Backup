import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '../../../common/TextField';
import SVGIcon from '../../../common/SVGIcon';

import styles from './ChangeEmailModal.module.sass';

export const ChangeEmailModal = ({
  onClose,
  setNewEmail,
  defaultValue = ''
}: {
  onClose: any;
  setNewEmail: any;
  defaultValue: string;
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };
  const submit = useCallback(() => {
    setNewEmail((value || '').trim());
    onClose();
  }, [onClose, setNewEmail, value]);

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={onClose}
      isOpen
      className={styles.modal}
    >
      <div className={styles.header}>
        <Typography className={styles.title}>Change Email</Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.textFieldBlock}>
            <TextField
              label={'Email'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                type: 'text',
                placeholder: 'Email'
              }}
              value={value}
              onChange={handleChange}
            />
          </div>
          <div className={styles.btnSendBlock}>
            <Button className={styles.btnSend} variant="contained" color="secondary" disabled={false} onClick={submit}>
              <Typography className={styles.summaryText}>Apply</Typography>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
