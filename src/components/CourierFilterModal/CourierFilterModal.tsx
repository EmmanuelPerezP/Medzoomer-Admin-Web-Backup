import React, { useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SVGIcon from '../common/SVGIcon';
import Select from '../common/Select';
import useCourier from '../../hooks/useCourier';
import { filtersStatus, filtersGender, filtersBoolean, filtersCheckrStatus } from '../../constants';
import { useStores } from '../../store';

import styles from './CourierFilterModal.module.sass';

export const CourierFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  const { getCouriers, filters } = useCourier();
  const { courierStore } = useStores();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const { status, checkrStatus, onboarded, completedHIPAATraining, gender } = filters;

  const handleChange = (key: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
    courierStore.set('filters')({ ...filters, page: 0, [key]: event.target.value as string });
  };

  const handleReset = () => {
    courierStore.set('filters')({
      ...filters,
      page: 0,
      checkrStatus: '',
      onboarded: '',
      completedHIPAATraining: '',
      gender: ''
    });
  };

  const handleGetCouries = async () => {
    setIsRequestLoading(true);
    try {
      const couriers = await getCouriers({
        ...filters
      });
      courierStore.set('couriers')(couriers.data);
      courierStore.set('meta')(couriers.meta);
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
          <Select value={status} onChange={handleChange('status')} items={filtersStatus} />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>Background status</Typography>
          <Select value={checkrStatus} onChange={handleChange('checkrStatus')} items={filtersCheckrStatus} />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>Confirmed HIPAA video</Typography>
          <Select
            value={completedHIPAATraining}
            onChange={handleChange('completedHIPAATraining')}
            items={filtersBoolean}
          />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>Onboarding status</Typography>
          <Select value={onboarded} onChange={handleChange('onboarded')} items={filtersBoolean} />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>Gender</Typography>
          <Select value={gender} onChange={handleChange('gender')} items={filtersGender} />
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          disabled={isRequestLoading}
          onClick={handleGetCouries}
        >
          <Typography>Apply</Typography>
        </Button>
      </div>
    </Modal>
  );
};
