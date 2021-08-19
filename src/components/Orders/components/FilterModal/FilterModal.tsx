import styles from './FilterModal.module.sass';
import React, { FC, useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { IFilterModalProps } from './types';
import SVGIcon from '../../../common/SVGIcon';
import Error from '../../../common/Error';
import Select from '../../../common/Select';
import PharmacyAutocomplete from '../../../common/PharmacyAutocomplete';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import { OrderSpecificFilter } from '../../../../interfaces';
import { filtersOrdersStatus } from '../../../../constants';
import { useStores } from '../../../../store';
import useOrder from '../../../../hooks/useOrder';

export const FilterModal: FC<IFilterModalProps> = ({ isOpen, onClose }) => {
  const user = useUser();
  const { orderStore } = useStores();
  const { filters: originalFilters } = useOrder();
  const [err, setErr] = useState({
    startDate: '',
    endDate: ''
  });
  const [filters, setFilters] = useState<OrderSpecificFilter>({});

  const forceSyncFilters = useCallback(() => {
    const { pharmacy, startDate, endDate, status } = originalFilters;
    setFilters({
      ...(pharmacy ? { pharmacy } : {}),
      startDate: startDate || '',
      endDate: endDate || '',
      status: status || 'all'
    });
  }, [filters, originalFilters, setFilters]); // eslint-disable-line

  const handleReset = useCallback(() => {
    // orderStore.set('filters')({
    //   ...originalFilters,
    //   page: 0,
    //   endDate: '',
    //   startDate: '',
    //   status: 'all',
    //   // @ts-ignore
    //   pharmacy: undefined
    // })
    setFilters({});
  }, [orderStore, originalFilters, setFilters]); // eslint-disable-line

  const handleApply = useCallback(() => {
    const { endDate, startDate, pharmacy, status } = filters;

    orderStore.set('filters')({
      ...originalFilters,
      page: 0,
      endDate: endDate || '',
      startDate: startDate || '',
      status,
      pharmacy: pharmacy || undefined
    });
    onClose();
  }, [filters, originalFilters, orderStore]); // eslint-disable-line

  const handleChangePharmacy = useCallback(
    (value: any) => {
      setFilters({
        ...filters,
        pharmacy: value
      });
    },
    [filters, setFilters]
  );

  const handleChangeStatus = useCallback(
    (e: any) => {
      setFilters({
        ...filters,
        status: e.target.value
      });
    },
    [filters, setFilters]
  );

  const isValid = (key: string, value: any) => {
    if (!value) return false;

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
    (key: 'startDate' | 'endDate') => (value: any) => {
      if (isValid(key, value)) {
        if (key === 'endDate') {
          value = moment(value)
            .set('hour', 23)
            .set('minutes', 59)
            .set('seconds', 59)
            .format('lll');
        }

        setFilters({
          ...filters,
          [key]: getDateFromTimezone(value, user, 'lll')
        });
      }
    },
    [filters, setFilters] // eslint-disable-line
  );

  const handleClearDate = useCallback(
    (key: 'startDate' | 'endDate') => {
      setFilters({
        ...filters,
        [key]: ''
      });
    },
    [filters, setFilters]
  );

  useEffect(() => {
    if (isOpen) forceSyncFilters();
  }, [isOpen]); // eslint-disable-line

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
        <div className={styles.close}>
          <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
        </div>
      </div>

      <div className={styles.content}>
        <PharmacyAutocomplete
          onChange={handleChangePharmacy}
          className={styles.field}
          labelClassName={styles.labelField}
          value={filters.pharmacy}
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
            value={filters.status || 'all'}
            items={filtersOrdersStatus}
            onChange={handleChangeStatus}
            fullWidth
          />
        </div>

        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>Start Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            // @ts-ignore
            selected={filters.startDate ? new Date(filters.startDate) : filters.startDate}
            onChange={(e) => {
              const key = 'startDate';
              if (e === null) handleClearDate(key);
              else handleChangeDate(key)(e);
            }}
            isClearable
          />
          {err.startDate ? <Error value={err.startDate} /> : null}
        </div>
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>End Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            // @ts-ignore
            selected={filters.endDate ? new Date(filters.endDate) : filters.endDate}
            onChange={(e) => {
              const key = 'endDate';
              if (e === null) handleClearDate(key);
              else handleChangeDate(key)(e);
            }}
            isClearable
          />
          {err.endDate ? <Error value={err.endDate} /> : null}
        </div>
      </div>

      <div className={styles.buttons}>
        <Button className={styles.applyButton} variant="contained" color="secondary" onClick={handleApply}>
          <Typography>Apply</Typography>
        </Button>
      </div>
    </Modal>
  );
};
