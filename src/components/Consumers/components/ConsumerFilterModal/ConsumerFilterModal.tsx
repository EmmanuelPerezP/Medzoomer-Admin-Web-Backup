import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SVGIcon from '../../../common/SVGIcon';
import AutoCompleteField from './AutoCompleteField';
import useConsumer from '../../../../hooks/useConsumer';

import styles from './ConsumerFilterModal.module.sass';

export const ConsumerFilterModal = ({ onClose, isOpen }: { onClose: any; isOpen: boolean }) => {
  const { getConsumers, filters, consumerStore, consumerSearchField } = useConsumer();
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const { fullName, email, phone } = filters;

  const handleChangeValue = useCallback(
    (key) => (value: string) => {
      const newFilters = { ...filters, page: 0, [key]: value };
      consumerStore.set('filters')(newFilters);
    },
    [filters, consumerStore]
  );

  const handleReset = () => {
    consumerStore.set('filters')({
      ...filters,
      page: 0,
      email: '',
      phone: '',
      fullName: ''
    });
  };

  const handleGetConsumers = async () => {
    setIsRequestLoading(true);
    try {
      const consumers = await getConsumers({
        ...filters
      });
      consumerStore.set('consumers')(consumers.data);
      consumerStore.set('meta')(consumers.meta);
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
        <div className={styles.location}>
          <Typography className={styles.label}>Location</Typography>
          <div className={styles.inputs}>
            <AutoCompleteField
              className={styles.fullName}
              labelClassName={styles.labelField}
              placeHolder={'Name'}
              label={'Name'}
              value={fullName}
              defaultValue={fullName}
              isClearable
              field={'fullName'}
              searchFun={consumerSearchField}
              onSelect={handleChangeValue('fullName')}
            />
            <AutoCompleteField
              className={styles.email}
              labelClassName={styles.labelField}
              placeHolder={'Email'}
              label={'Email'}
              value={email}
              defaultValue={email}
              isClearable
              field={'email'}
              searchFun={consumerSearchField}
              onSelect={handleChangeValue('email')}
            />
            <AutoCompleteField
              className={styles.phone}
              labelClassName={styles.labelField}
              placeHolder={'Phone'}
              label={'Phone'}
              value={phone}
              defaultValue={phone}
              isClearable
              field={'phone'}
              searchFun={consumerSearchField}
              onSelect={handleChangeValue('phone')}
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
          onClick={handleGetConsumers}
        >
          <Typography>Apply</Typography>
        </Button>
      </div>
    </Modal>
  );
};
