import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SVGIcon from '../../../common/SVGIcon';
import Error from '../../../common/Error';
import CustomerAutocomplete from '../CustomerAutocomplete';
import styles from './FilterModal.module.sass';
import CustomerAutoComplete from '../../../common/CustomerAutoComplete';

export const FilterModal = ({
  onClose,
  isOpen,
  activeFilter,
  handlerSearch
}: {
  onClose: any;
  isOpen: boolean;
  activeFilter: any;
  handlerSearch: any;
}) => {
  const [filters, setFilters] = useState(activeFilter);
  const [filterCustomer, setFilterCustomer] = useState();
  const [isRequestLoading] = useState(false);

  const [err, setErr] = useState({
    startDate: '',
    endDate: ''
  });

  const { startDate, endDate, runDate } = filters;

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
    if (key === 'runDate') {
      return true;
    }

    return false;
  };
  const handleReset = () => {
    handlerSearch({
      endDate: '',
      startDate: '',
      settingsGP: '',
      runDate: ''
    });
    setFilters({
      endDate: '',
      startDate: '',
      settingsGP: '',
      runDate: ''
    });
    // onClose();
  };

  const handleChangeDate = useCallback(
    (key) => (value: any) => {
      if (isValid(key, value)) {
        setFilters({
          ...filters,
          [key]: value
        });
      }
    },
    // eslint-disable-next-line
    [filters]
  );

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
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>Start Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={startDate}
            onChange={handleChangeDate('startDate')}
            isClearable
          />
          {err.startDate ? <Error value={err.startDate} /> : null}
        </div>
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>End Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={endDate}
            onChange={handleChangeDate('endDate')}
            isClearable
          />
          {err.endDate ? <Error value={err.endDate} /> : null}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.dateBlock}>
          <Typography className={styles.dateTitle}>Run Date</Typography>
          <DatePicker
            wrapperClassName={styles.datePicker}
            className={styles.datePicker}
            selected={runDate ? new Date(runDate) : runDate}
            onChange={handleChangeDate('runDate')}
            isClearable
          />
        </div>
        <div className={styles.dateBlock}>
          <CustomerAutocomplete
            onChange={(value: any) => {
              setFilterCustomer(value);
              setFilters({
                ...filters,
                settingsGP: value.value
              });
            }}
            className={styles.field}
            labelClassName={styles.labelField}
            value={filterCustomer}
          />
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          disabled={isRequestLoading}
          onClick={() => {
            handlerSearch(filters);
            onClose();
          }}
        >
          <Typography>Apply</Typography>
        </Button>
      </div>
    </Modal>
  );
};
