import React, { useCallback, useState, useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import _ from 'lodash';

import 'react-datepicker/dist/react-datepicker.css';

import SVGIcon from '../../../common/SVGIcon';

import useDelivery from '../../../../hooks/useDelivery';
import Error from '../../../common/Error';
import CourierAutocomplete from '../../../common/CourierAutocomplete';
import PharmacyAutocomplete from '../../../common/PharmacyAutocomplete';
import Select from '../../../common/Select';
import styles from './DeliveriesFilterModal.module.sass';
import { filtersDeliveriesStatus, filtersDeliveriesIsCopay } from '../../../../constants';
import { parseFilterToValidQuery } from '../../utils';
import CustomerAutoComplete from '../../../common/CustomerAutoComplete';
import useUser from '../../../../hooks/useUser';
import { getDate } from '../../../../utils';

const PER_PAGE = 10;

export const DeliveriesFilterModal = ({
  onClose,
  isOpen,
  activeTab,
  batches,
  needNotShowBadStatus,
  isDispatchedBatched
}: {
  onClose: any;
  isOpen: boolean;
  activeTab: string;
  batches: number;
  needNotShowBadStatus: number;
  isDispatchedBatched: boolean;
}) => {
  const { getDeliveries, filters, deliveryStore, getDeliveriesBatches } = useDelivery();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [err, setErr] = useState({
    startDate: '',
    endDate: ''
  });
  const { courier, pharmacy, status, startDate, endDate, customer, isCopay } = filters;

  const isShowAdditionalFilters = ['first', 'notDispatched'].includes(activeTab) || isDispatchedBatched;

  const user = useUser()
;
  const handleChangeCourier = useCallback(
    (value: any) => {
      deliveryStore.set('filters')({ ...filters, page: 0, courier: value });
    },
    [filters, deliveryStore]
  );

  const handleChangePharmacy = useCallback(
    (value: any) => {
      deliveryStore.set('filters')({ ...filters, page: 0, pharmacy: value });
    },
    [filters, deliveryStore]
  );

  const handleChangeStatus = useCallback(
    (e: any) => {
      deliveryStore.set('filters')({ ...filters, page: 0, status: e.target.value });
    },
    [filters, deliveryStore]
  );

  const handleChangeCopay = useCallback(
    (e: any) => {
      deliveryStore.set('filters')({ ...filters, page: 0, isCopay: e.target.value });
    },
    [filters, deliveryStore]
  );

  const handleChangeCustomer = useCallback(
    (value: any) => {
      deliveryStore.set('filters')({ ...filters, page: 0, customer: value });
    },
    [filters, deliveryStore]
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
    (key) => (value: any) => {
      if (isValid(key, value)) {
        if (key === 'endDate') {
          value = moment(value)
            .set('hour', 23)
            .set('minutes', 59)
            .set('seconds', 59)
            .format('lll');
        }
        const newFilters = { ...filters, page: 0, [key]: getDate(value, user, 'lll') };
        deliveryStore.set('filters')(newFilters);
      }
    },
    // eslint-disable-next-line
    [filters, deliveryStore]
  );

  const handleClearDate = useCallback(
    (key) => {
      const newFilters = {
        ...filters,
        page: 0,
        [key]: ''
      };
      deliveryStore.set('filters')(newFilters);
    },
    // eslint-disable-next-line
    [filters, deliveryStore]
  );

  const handleReset = () => {
    deliveryStore.set('filters')({
      ...filters,
      status: 'ALL',
      assigned: '0',
      page: 0,
      courier: '',
      pharmacy: '',
      startDate: '',
      endDate: '',
      isCopay: ''
    });
    setErr({ startDate: '', endDate: '' });
  };

  const handleGetDeliveries = async () => {
    setIsRequestLoading(true);
    try {
      let deliveries: {
        data: any[];
        meta: { filteredCount: number; totalFees: number; bonus: number; totalCount: number };
      } = {
        meta: { totalCount: 0, filteredCount: 0, totalFees: 0, bonus: 0 },
        data: []
      };

      if (['first', 'notDispatched'].includes(activeTab) || isDispatchedBatched) {
        deliveries = await getDeliveries(
          parseFilterToValidQuery({
            ...filters,
            needNotShowBadStatus: isDispatchedBatched ? 0 : needNotShowBadStatus,
            perPage: PER_PAGE,
            batches
          })
        );

        deliveryStore.set('deliveries')(deliveries.data);
      } else {
        deliveries = await getDeliveriesBatches({
          ...filters
        });
        deliveryStore.set('deliveriesDispatch')(deliveries.data);
      }

      deliveryStore.set('meta')(deliveries.meta);
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
        {isShowAdditionalFilters ? (
          <CourierAutocomplete
            onChange={handleChangeCourier}
            className={styles.field}
            labelClassName={styles.labelField}
            value={courier}
          />
        ) : null}

        <PharmacyAutocomplete
          onChange={handleChangePharmacy}
          className={styles.field}
          labelClassName={styles.labelField}
          value={pharmacy}
        />

        {isShowAdditionalFilters ? (
          <CustomerAutoComplete
            onChange={handleChangeCustomer}
            className={styles.field}
            labelClassName={styles.labelField}
            value={customer}
          />
        ) : null}

        {isShowAdditionalFilters ? (
          <div className={styles.field}>
            <Typography className={styles.dateTitle}>Status</Typography>
            <Select
              label={''}
              classes={{
                input: styles.selectInput,
                root: styles.selectRoot,
                selectMenu: styles.selectMenu
              }}
              value={status || 'ALL'}
              items={filtersDeliveriesStatus}
              onChange={handleChangeStatus}
              fullWidth
            />
          </div>
        ) : null}

        {isShowAdditionalFilters ? (
          <div className={styles.field}>
            <Typography className={styles.dateTitle}>Co-pay?</Typography>
            <Select
              label={''}
              classes={{
                input: styles.selectInput,
                root: styles.selectRoot,
                selectMenu: styles.selectMenu
              }}
              value={isCopay || 'ALL'}
              items={filtersDeliveriesIsCopay}
              onChange={handleChangeCopay}
              fullWidth
            />
          </div>
        ) : null}

        <div className={styles.field} />

        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>Start Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={startDate ? new Date(startDate) : startDate}
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
            selected={endDate ? new Date(endDate) : endDate}
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
