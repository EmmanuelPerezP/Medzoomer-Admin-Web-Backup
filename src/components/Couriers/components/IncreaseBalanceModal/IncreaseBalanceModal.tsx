import React, { useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import TextField from '../../../common/TextField';
import SVGIcon from '../../../common/SVGIcon';

import styles from './IncreaseBalanceModal.module.sass';

export const IncreaseBalanceModal = ({
  onClose,
  isOpen,
  sendToBalance
}: {
  onClose: any;
  isOpen: any;
  sendToBalance: any;
}) => {
  const [amount, setAmount] = useState(0);

  const handleChangePrice = (e: any) => {
    let { value } = e.target;
    if (value < 0 || value > 500) {
      value = 500;
    }
    setAmount(value);
  };

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
        <Typography className={styles.title}>Increase Courier Balance</Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.textFieldBlock}>
            <TextField
              label={'Amount (max. $500)'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                type: 'number',
                max: 500,
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              value={amount}
              onChange={handleChangePrice}
            />
          </div>
          <div className={styles.btnSendBlock}>
            <Button
              className={styles.btnSend}
              variant="contained"
              color="secondary"
              disabled={false}
              onClick={() => {
                sendToBalance(amount);
                onClose();
              }}
            >
              <Typography className={styles.summaryText}>Apply</Typography>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
