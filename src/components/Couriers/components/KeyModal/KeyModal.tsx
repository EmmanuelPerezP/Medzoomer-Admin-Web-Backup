import React, { useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';

import SVGIcon from '../../../common/SVGIcon';

import styles from './KeyModal.module.sass';
import TextField from "../../../common/TextField";
import classNames from "classnames";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";

export const KeyModal = ({onClose, isOpen , sendToBalance}: { onClose: any; isOpen: any, sendToBalance: any }) => {
  const [amount, setAmount] = useState(0)

  const handleChangePrice = (e:any) => {
    let { value } = e.target;
    if (value < 0 || value > 500) {
      value = 500
    }
    setAmount(value)
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
        <div className={styles.select}>
          <div className={styles.threeInput}>
            <div className={styles.textField}>
              <TextField
                label={'Amount (max. $500)'}
                classes={{
                  root: classNames(styles.textField, styles.priceInput)
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
            <div className={styles.btnSend}>
              <Button
                className={styles.changeStepButton}
                variant="contained"
                color="secondary"
                disabled={false}
                onClick={() => {
                  sendToBalance(amount)
                  onClose()
                }}
              >
                <Typography className={styles.summaryText}>Add</Typography>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
