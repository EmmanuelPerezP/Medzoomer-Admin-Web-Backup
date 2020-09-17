import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import SVGIcon from '../../../common/SVGIcon';
import AutoCompleteField from './AutoCompleteField';

import useDelivery from '../../../../hooks/useDelivery';
import useCourier from '../../../../hooks/useCourier';
import usePharmacy from '../../../../hooks/usePharmacy';
// import { filtersDeliveriesStatus, filtersDeliveriesAssigned } from '../../../../constants';

import styles from './DeliveriesFilterModal.module.sass';

export const DeliveriesFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  const { getDeliveries, filters, deliveryStore } = useDelivery();
  const { courierSearchField } = useCourier();
  const { pharmacySearchField } = usePharmacy();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const { courier, pharmacy, startDate, endDate } = filters;

  const handleChange = useCallback(
    (key) => (value: string) => {
      const newFilters = { ...filters, page: 0, [key]: value };
      deliveryStore.set('filters')(newFilters);
    },
    [filters, deliveryStore]
  );

  const handleChangeDate = useCallback(
    (key) => (value: any) => {
      const newFilters = { ...filters, page: 0, [key]: value };
      deliveryStore.set('filters')(newFilters);
    },
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
    });
  };

  const handleGetDeliveries = async () => {
    setIsRequestLoading(true);
    try {
      const deliveries = await getDeliveries({
        ...filters
      });

      deliveryStore.set('deliveries')(deliveries.data);
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
        <AutoCompleteField
          className={styles.field}
          labelClassName={styles.labelField}
          placeHolder={'Courier'}
          label={'Courier'}
          value={courier}
          defaultValue={courier}
          isClearable
          field={'name'}
          searchFun={courierSearchField}
          onSelect={handleChange('courier')}
        />
        <AutoCompleteField
          className={styles.field}
          labelClassName={styles.labelField}
          placeHolder={'Pharmacy'}
          label={'Pharmacy'}
          value={pharmacy}
          defaultValue={pharmacy}
          isClearable
          field={'name'}
          searchFun={pharmacySearchField}
          onSelect={handleChange('pharmacy')}
        />
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>Start Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={startDate}
            onChange={handleChangeDate('startDate')}
          />
        </div>
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>End Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={endDate}
            onChange={handleChangeDate('endDate')}
          />
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
