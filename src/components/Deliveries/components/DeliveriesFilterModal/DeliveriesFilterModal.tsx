import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import SVGIcon from '../../../common/SVGIcon';

import useDelivery from '../../../../hooks/useDelivery';
import Error from '../../../common/Error';
import CourierAutocomplete from '../../../common/CourierAutocomplete';
import PharmacyAutocomplete from '../../../common/PharmacyAutocomplete';
import Select from '../../../common/Select';
import styles from './DeliveriesFilterModal.module.sass';
import { filtersDeliveriesStatus } from '../../../../constants';

export const DeliveriesFilterModal = ({
  onClose,
  isOpen,
  activeTab
}: {
  onClose: any;
  isOpen: boolean;
  activeTab: string;
}) => {
  const { getDeliveries, filters, deliveryStore, getDeliveriesBatches } = useDelivery();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [err, setErr] = useState({
    startDate: '',
    endDate: ''
  });
  const { courier, pharmacy, status, startDate, endDate } = filters;

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
            .add(23, 'hours')
            .add(59, 'minutes')
            .add(59, 'seconds')
            .format('lll');
        }
        const newFilters = { ...filters, page: 0, [key]: moment(value).format('lll') };
        deliveryStore.set('filters')(newFilters);
      }
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
      endDate: ''
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

      if (['first', 'notDispatched'].includes(activeTab)) {
        deliveries = await getDeliveries({
          ...filters
        });

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
        {['first', 'notDispatched'].includes(activeTab) ? (
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

        {['first', 'notDispatched'].includes(activeTab) ? (
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

        <div className={styles.field} />

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
        {/* <div className={styles.select}>
          <Typography className={styles.label}>Status</Typography>
          <Select value={status} onChange={handleChange('status')} items={filtersDeliveriesStatus} />
        </div>

        <div className={styles.select}>
          <Typography className={styles.label}>Courier</Typography>
          <Select value={assigned} onChange={handleChange('assigned')} items={filtersDeliveriesAssigned} />
        </div> */}
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
