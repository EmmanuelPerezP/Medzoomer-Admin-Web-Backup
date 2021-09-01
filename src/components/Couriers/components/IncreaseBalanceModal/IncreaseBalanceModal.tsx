import React, { useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import TextField from '../../../common/TextField';
import SVGIcon from '../../../common/SVGIcon';
import {
  filtersAdjustBalanceTransactionsTypes,
  filtersTransactionsPayoutReasons, filtersTransactionsWithdrawReasons
} from '../../../../constants';

import styles from './IncreaseBalanceModal.module.sass';
import { Error } from '../../../common/Error/Error';
import Select from '../../../common/Select';

export const IncreaseBalanceModal = ({
  onClose,
  isOpen,
  sendToBalance
}: {
  onClose: any;
  isOpen: any;
  sendToBalance: any;
}) => {
  const [data, setData] = useState<{ amount: number | null, type: string, reason: string, note: string }>({
    amount: null,
    type: '',
    reason: '',
    note: ''
  });

  const [errors, setErrors] = useState<{ amount: string, type: string, reason: string }>({
    amount: '', type: '', reason: ''
  });

  const isValid = (): boolean => {
    let valid = true
    const err: any = {}
    if (!data.amount) {
      err.amount = 'Required field'
    } else if (data.amount < 0 || data.amount > 500) {
      err.amount = 'Amount must be greater 0 and less 500'
    }

    if (!data.reason) {
      err.reason = 'Required field'
    }

    if (!data.type) {
      err.type = 'Required field'
    }

    setErrors(err)

    if (Object.keys(err).length) {
      valid = false
    }

    return valid
  }

  const onSendToBalance = () => {
    if (!isValid()) return;
    sendToBalance(data);
    onClose();
  }

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setErrors({ ...errors, [name]: '' })
    if (name === 'type') {
      setData({ ...data, [name]: value, reason: '' });
    } else {
      setData({ ...data, [name]: value });
    }
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
        <div />
        <Typography className={styles.title}>Adjust Balance</Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.textFieldBlock}>
            <Select
              label={'Type'}
              // classes={{
              //   input: styles.selectInput,
              //   root: styles.selectRoot,
              //   selectMenu: styles.selectMenu
              // }}
              value={data.type}
              items={filtersAdjustBalanceTransactionsTypes}
              onChange={handleChange}
              fullWidth
              inputProps={{
                name: 'type'
              }}
            />
            {errors.type ? <Error className={styles.error} value={errors.type} /> : null}
          </div>
          <div className={styles.textFieldBlock}>
            <Select
              label={'Reason'}
              // classes={{
              //   input: styles.selectInput,
              //   root: styles.selectRoot,
              //   selectMenu: styles.selectMenu
              // }}
              value={data.reason}
              items={
                data.type
                ? data.type === 'PAYOUT'
                  ? filtersTransactionsPayoutReasons
                    : filtersTransactionsWithdrawReasons
                : []
              }
              onChange={handleChange}
              fullWidth
              inputProps={{
                name: 'reason',
                disabled: !data.type
              }}
            />
            {errors.reason ? <Error className={styles.error} value={errors.reason} /> : null}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.textFieldBlock}>
            <TextField
              label={'Amount (max. $500)'}
              // classes={{
              //   root: styles.textField
              // }}
              inputProps={{
                name: 'amount',
                type: 'number',
                max: 500,
                placeholder: '0.00',
                endAdornment: <InputAdornment position="start">$</InputAdornment>
              }}
              value={data.amount}
              onChange={handleChange}
            />
            {errors.amount ? <Error className={styles.error} value={errors.amount} /> : null}
          </div>
        </div>

        <div className={styles.row}>
          <TextField
            label={'Note'}
            classes={{
              // root: styles.textarea,
              input: styles.textarea
            }}
            inputProps={{
              name: 'note'
            }}
            value={data.note}
            onChange={handleChange}
            multiline={true}
            rows={4}
          />
        </div>

        <div className={styles.btnSendBlock}>
          <Button
            className={styles.btnSend}
            variant="contained"
            color="secondary"
            disabled={false}
            onClick={onSendToBalance}
          >
            <Typography className={styles.summaryText}>Confirm</Typography>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
