import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SVGIcon from '../../../common/SVGIcon';
import CourierAutoCompleteField from './CourierAutoCompleteField';
import Select from '../../../common/Select';
import useCourier from '../../../../hooks/useCourier';
import { filtersBoolean, filtersCheckrStatus, filtersGender, filtersStatus } from '../../../../constants';

import styles from './CourierFilterModal.module.sass';

export const CourierFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  const { getCouriers, courierStore } = useCourier();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const filters = courierStore.get('filters');
  const { status, checkrStatus, onboarded, completedHIPAATraining, gender, city, state, zipCode } = filters;

  const handleChange = useCallback(
    (key: string) => (event: React.ChangeEvent<{ value: unknown }>) => {
      const newFilters = { ...filters, page: 0, [key]: event.target.value as string };
      courierStore.set('filters')(newFilters);
    },
    [filters, courierStore]
  );

  const handleChangeValue = useCallback(
    (key) => (value: string) => {
      const newFilters = { ...filters, page: 0, [key]: value };
      courierStore.set('filters')(newFilters);
    },
    [filters, courierStore]
  );

  const handleReset = () => {
    courierStore.set('filters')({
      ...filters,
      status: filtersStatus[1].value,
      page: 0,
      checkrStatus: '',
      onboarded: '',
      completedHIPAATraining: '',
      city: '',
      state: '',
      zipCode: '',
      gender: ''
    });
  };

  const handleGetCouriers = async () => {
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
          <Typography className={styles.label}>Registration Status</Typography>
          <Select
            value={status}
            onChange={handleChange('status')}
            items={filtersStatus.filter((e: any, i: number) => i < 3)}
          />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>CheckR Status</Typography>
          <Select value={checkrStatus} onChange={handleChange('checkrStatus')} items={filtersCheckrStatus} />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>Onboarding Completed?</Typography>
          <Select
            value={onboarded}
            onChange={handleChange('onboarded')}
            items={[...filtersStatus.filter((e: any, i: number) => i > 2), { value: 'true', label: 'Onboarded' }]}
          />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>HIPAA Training Completed?</Typography>
          <Select
            value={completedHIPAATraining}
            onChange={handleChange('completedHIPAATraining')}
            items={filtersBoolean}
          />
        </div>
        <div className={styles.select}>
          <Typography className={styles.label}>Gender</Typography>
          <Select value={gender} onChange={handleChange('gender')} items={filtersGender} />
        </div>
        <div className={styles.location}>
          <Typography className={styles.label}>Location</Typography>
          <div className={styles.inputs}>
            <CourierAutoCompleteField
              className={styles.city}
              labelClassName={styles.labelField}
              placeHolder={'City'}
              label={'City'}
              value={city}
              defaultValue={city}
              isClearable
              field={'address.city'}
              onSelect={handleChangeValue('city')}
            />
            <CourierAutoCompleteField
              className={styles.state}
              labelClassName={styles.labelField}
              placeHolder={'State'}
              label={'State'}
              value={state}
              defaultValue={state}
              isClearable
              field={'address.state'}
              onSelect={handleChangeValue('state')}
            />
          </div>
          <div className={styles.inputs}>
            <CourierAutoCompleteField
              className={styles.zip}
              labelClassName={styles.labelField}
              placeHolder={'Zip Code'}
              label={'Zip Code'}
              value={zipCode}
              defaultValue={zipCode}
              isClearable
              field={'address.zipCode'}
              onSelect={handleChangeValue('zipCode')}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          disabled={isRequestLoading}
          onClick={handleGetCouriers}
        >
          <Typography>Apply</Typography>
        </Button>
      </div>
    </Modal>
  );
};
