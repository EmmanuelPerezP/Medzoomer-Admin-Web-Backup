import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SVGIcon from '../../../common/SVGIcon';

import Select from '../../../common/Select';

import { filtersDeliveriesStatus, filtersDeliveriesAssigned } from '../../../../constants';

import styles from './DeliveriesFilterModal.module.sass';
import useDelivery from "../../../../hooks/useDelivery";

export const DeliveriesFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  const { getDeliveries, deliveryStore } = useDelivery();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const filters = deliveryStore.get('filters');
  const { status, assigned } = filters;

  const handleChange = useCallback(
    (key: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
      const newFilters = { ...filters, page: 0, [key]: event.target.value as string };
      deliveryStore.set('filters')(newFilters);
    },
    [filters, deliveryStore]
  );

  const handleReset = () => {
    deliveryStore.set('filters')({
      ...filters,
      status: "ALL",
      assigned: "0",
      page: 0
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
        <div className={styles.select}>
          <Typography className={styles.label}>Status</Typography>
          <Select value={status} onChange={handleChange('status')} items={filtersDeliveriesStatus} />
        </div>

        <div className={styles.select}>
          <Typography className={styles.label}>Courier</Typography>
          <Select value={assigned} onChange={handleChange('assigned')} items={filtersDeliveriesAssigned} />
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
