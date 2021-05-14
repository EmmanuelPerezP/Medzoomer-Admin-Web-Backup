import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import TextField from '../../../../../common/TextField';
import SVGIcon from '../../../../../common/SVGIcon';

import styles from './AddFeeModal.module.sass';

export const AddFeeModal = ({
  onClose,
  isOpen,
  setNewFee
}: {
  onClose: () => void;
  isOpen: boolean;
  setNewFee: (amount: number) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let numberValue = +value;
    if (numberValue < 0 || numberValue > 500) {
      numberValue = 500;
    }
    setAmount(numberValue);
  };

  const handleApplyAmount = () => {
    setNewFee(amount);
    onClose();
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
        <Typography className={styles.title}>Send Additional Fee</Typography>
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
              onClick={handleApplyAmount}
            >
              <Typography className={styles.summaryText}>Apply</Typography>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
