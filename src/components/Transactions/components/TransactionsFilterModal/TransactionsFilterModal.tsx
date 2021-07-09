import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import Select from '../../../common/Select';
import 'react-datepicker/dist/react-datepicker.css';
import SVGIcon from '../../../common/SVGIcon';
import Error from '../../../common/Error';
import CourierAutocomplete from '../../../common/CourierAutocomplete';
import { filtersTransactionsType } from '../../../../constants';
import styles from './TransactionsFilterModal.module.sass';
import useTransactions from '../../../../hooks/useTransactions';
import useUser from '../../../../hooks/useUser';
import { getDate } from '../../../../utils';

export const TransactionsFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  const { getTransactions, filters, transactionsStore } = useTransactions();
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  const [err, setErr] = useState({
    startDate: '',
    endDate: ''
  });
  const { type, startDate, courier, endDate } = filters;

  const user = useUser();

  const handleChangeCourier = useCallback(
    (value: any) => {
      transactionsStore.set('filters')({ ...filters, page: 0, courier: value });
    },
    [filters, transactionsStore]
  );
  const handleChangeType = useCallback(
    (e: any) => {
      transactionsStore.set('filters')({ ...filters, page: 0, type: e.target.value });
    },
    [filters, transactionsStore]
  );

  const isValid = (key: string, value: any) => {
    if (key === 'startDate') {
      if (!filters.endDate || moment(value).isSameOrBefore(moment(filters.endDate))) {
        setErr({ ...err, startDate: '' });
        return true;
      } else {
        setErr({ ...err, startDate: 'Start date must be less than End date' });
      }
    }

    if (key === 'endDate') {
      if (!filters.startDate || moment(value).isSameOrAfter(moment(filters.startDate))) {
        setErr({ ...err, endDate: '' });
        return true;
      } else {
        setErr({ ...err, endDate: 'End date must be greater than Start date' });
      }
    }

    return false;
  };

  const handleChangeDate = useCallback(
    (key) => (value: any) => {
      if (isValid(key, value)) {
        // if (key === 'endDate') {
        //   value = moment(value)
        //     .add(23, 'hours')
        //     .add(59, 'minutes')
        //     .add(59, 'seconds')
        //     .format('lll');
        // }
        const newFilters = { ...filters, page: 0, [key]: getDate(value, user, 'lll') };
        transactionsStore.set('filters')(newFilters);
      }
    },
    // eslint-disable-next-line
    [filters, transactionsStore]
  );

  const handleReset = () => {
    transactionsStore.set('filters')({
      ...filters,
      type: 'ALL',
      page: 0,
      courier: '',
      startDate: '',
      endDate: ''
    });
    setErr({ startDate: '', endDate: '' });
  };

  const handleGetDeliveries = async () => {
    setIsRequestLoading(true);
    try {
      const transactions = await getTransactions({
        ...filters
      });

      transactionsStore.set('transactions')(transactions.data);
      transactionsStore.set('meta')(transactions.meta);
      setIsRequestLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsRequestLoading(false);
      onClose();
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
        <div onClick={handleReset} className={styles.reset}>
          <SVGIcon name="reset" />
          <Typography className={styles.resetTitle}>Reset</Typography>
        </div>
        <Typography className={styles.title}>Filters</Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>
      <div className={styles.content}>
        <CourierAutocomplete
          onChange={handleChangeCourier}
          className={styles.field}
          labelClassName={styles.labelField}
          value={courier}
        />
        <div className={styles.field}>
          <Typography className={styles.dateTitle}>Status</Typography>
          <Select
            label={''}
            classes={{
              input: styles.selectInput,
              root: styles.selectRoot,
              selectMenu: styles.selectMenu
            }}
            value={type || 'ALL'}
            onChange={handleChangeType}
            items={filtersTransactionsType}
            fullWidth
          />
        </div>
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>Start Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={startDate ? new Date(startDate) : startDate}
            onChange={handleChangeDate('startDate')}
          />
          {err.startDate ? <Error value={err.startDate} /> : null}
        </div>
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>End Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={endDate ? new Date(endDate) : endDate}
            onChange={handleChangeDate('endDate')}
          />
          {err.endDate ? <Error value={err.endDate} /> : null}
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          disabled={isRequestLoading}
          onClick={handleGetDeliveries}
        >
          <Typography>Apply</Typography>
        </Button>
      </div>
    </Modal>
  );
};
