import React, { FC, useState, ReactNode } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid/v4';
import CheckBox from '../common/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

import usePharmacy from '../../hooks/usePharmacy';
import useUser from '../../hooks/useUser';
import { useStores } from '../../store';
import { decodeErrors, changeScheduleSplit } from '../../utils';
import { days, periodDays } from '../../constants';

import TextField from '../common/TextField';
import FileInput from '../common/FileInput';
import Select from '../common/Select';
import Error from '../common/Error';
import MapSearch from '../common/MapSearch';
import SVGIcon from '../common/SVGIcon';

import styles from './PharmacyInputs.module.sass';

const fileId = uuid();

export const PharmacyInputs = (props: { err: any; setError: any; children?: ReactNode }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const user = useUser();
  const { err, setError } = props;
  const [isSplitByDay, setIsSplitByDay] = useState(newPharmacy.schedule.wholeWeek.isClosed);

  const handleUploadImage = (key: any) => async (evt: any) => {
    const size = { width: 200, height: 200 };
    const file = evt.target.files[0];
    const [image] = (await user.uploadImage(user.sub, file, size)).links;
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: image });
  };

  const handleUploadFile = (key: any) => async (evt: any) => {
    const file = evt.target.files[0];
    const name = evt.target.files[0].name;
    const { link } = await user.uploadFile(user.sub, file);
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: { link, name } });
  };

  const handleChangeCheckBox = () => {
    setIsSplitByDay(!isSplitByDay);
    changeScheduleSplit(!isSplitByDay, newPharmacy.schedule);
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: value });
    setError({ ...err, [key]: '' });
  };

  const handleChangeSchedule = (day: string, parametr: string, key?: string) => (
    e: React.ChangeEvent<{ value: any }>
  ) => {
    const { value } = e.target;
    const schedule = { ...newPharmacy.schedule };

    if (parametr === 'isClosed') {
      schedule[day][parametr] = !schedule[day][parametr];
    } else {
      schedule[day][parametr][key as any] = value;
    }

    pharmacyStore.set('newPharmacy')({
      ...newPharmacy,
      schedule
    });
  };

  const renderInputBasicInfo = () => {
    return (
      <div className={styles.basicInfo}>
        <Typography className={styles.blockTitle}>Basic Information</Typography>
        <TextField
          label={'Pharmacy Name'}
          classes={{
            input: styles.input,
            inputRoot: styles.inputRoot,
            root: styles.textField
          }}
          inputProps={{
            placeholder: 'Please enter'
          }}
          value={newPharmacy.name}
          onChange={handleChange('name')}
        />
        {err.name ? <Error className={styles.error} value={err.name} /> : null}
        <MapSearch handleClearError={() => setError({ ...err, address: '' })} />
        <TextField
          label={'Per-Prescription Price'}
          classes={{
            root: classNames(styles.textField, styles.priceInput)
          }}
          inputProps={{
            placeholder: '0.00',
            endAdornment: <InputAdornment position="start">USD</InputAdornment>
          }}
          value={newPharmacy.price}
          onChange={handleChange('price')}
        />
        {err.price ? <Error className={styles.error} value={err.price} /> : null}
        {renderDocument()}
      </div>
    );
  };

  const renderDocument = () => {
    return (
      <div className={styles.document}>
        <div className={styles.documentTitle}>
          <Typography className={styles.subtitle}>Preview Photo</Typography>
          <InputLabel className={styles.option} htmlFor={fileId}>
            Upload
          </InputLabel>
        </div>
        <div className={styles.documentPhoto}>
          {newPharmacy.preview ? (
            <img style={{ maxWidth: '328px', maxHeight: '200px' }} src={newPharmacy.preview} alt="No Image" />
          ) : (
            <SVGIcon name={'uploadPhoto'} className={styles.uploadIcon} />
          )}
        </div>
        <FileInput
          id={fileId}
          classes={{
            input: styles.fileRootInput
          }}
          value={newPharmacy.preview}
          onChange={handleUploadImage('preview')}
        />
        {err.preview ? <Error value={err.preview} /> : null}
      </div>
    );
  };

  const renderInputManagerInfo = () => {
    return (
      <div className={styles.managerBlock}>
        <Typography className={styles.blockTitle}>Manager Contacts</Typography>
        <TextField
          label={'Full Name'}
          classes={{
            root: styles.textField
          }}
          inputProps={{
            placeholder: 'Please enter'
          }}
          value={newPharmacy.managerName}
          onChange={handleChange('managerName')}
        />
        {err.managerName ? <Error className={styles.error} value={err.managerName} /> : null}
        <div className={styles.twoInput}>
          <div className={styles.textField}>
            <TextField
              label={'Contact Email'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                placeholder: 'Please enter'
              }}
              value={newPharmacy.email}
              onChange={handleChange('email')}
            />
            {err.email ? <Error className={styles.error} value={err.email} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Contact Phone Number'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                placeholder: 'Please enter'
              }}
              value={newPharmacy.phone_number}
              onChange={handleChange('phone_number')}
            />
            {err.phone_number ? <Error className={styles.error} value={err.phone_number} /> : null}
          </div>
        </div>
      </div>
    );
  };

  const renderInputWorkingHours = () => {
    return (
      <div className={styles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Working Hours</Typography>
          <CheckBox label={'Split by days'} checked={isSplitByDay} onChange={handleChangeCheckBox} />
        </div>
        {isSplitByDay ? (
          days.map((day) => {
            return (
              <>
                <Typography className={styles.dayTitle}>{day.label}</Typography>
                <div
                  className={classNames(styles.inputWrapper, {
                    [styles.isDisabled]: newPharmacy.schedule[day.value].isClosed
                  })}
                >
                  {renderDateInput(1, day.value, 'open')}
                  {renderDateInput(2, day.value, 'close')}
                  <CheckBox
                    label={'Day Off'}
                    checked={newPharmacy.schedule[day.value].isClosed}
                    onChange={handleChangeSchedule(day.value, 'isClosed')}
                  />
                </div>
              </>
            );
          })
        ) : (
          <div className={styles.inputWrapper}>
            {renderDateInput(1, 'wholeWeek', 'open')}
            {renderDateInput(2, 'wholeWeek', 'close')}
          </div>
        )}
      </div>
    );
  };

  const renderDateInput = (order: number, day: string, parametr: string) => {
    return (
      <div className={styles.hourBlockInput}>
        <Typography className={styles.label}>{order === 1 ? 'Open' : 'Close'}</Typography>
        <div className={styles.dateInput}>
          <TextField
            classes={{
              input: styles.input,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{
              type: 'number',
              disabled: newPharmacy.schedule[day].isClosed
            }}
            value={newPharmacy.schedule[day][parametr].hour}
            onChange={handleChangeSchedule(day, parametr, 'hour')}
          />
          <TextField
            classes={{
              input: styles.input,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{
              type: 'number',
              disabled: newPharmacy.schedule[day].isClosed
            }}
            value={newPharmacy.schedule[day][parametr].minutes}
            onChange={handleChangeSchedule(day, parametr, 'minutes')}
          />
          <Select
            value={newPharmacy.schedule[day][parametr].period}
            onChange={handleChangeSchedule(day, parametr, 'period')}
            items={periodDays}
            inputProps={{
              disabled: newPharmacy.schedule[day].isClosed
            }}
            IconComponent={() => <ArrowDropDown style={{ height: '15px', width: '15px' }} />}
            classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
            className={styles.periodSelect}
          />
        </div>
      </div>
    );
  };

  const renderInputSignedBlock = () => {
    return (
      <div className={styles.signedBlock}>
        <Typography className={styles.blockTitle}>Signed Agreement</Typography>
        <FileInput
          label={`Upload PDF`}
          classes={{
            input: styles.fileRootInput,
            inputLabel: classNames(styles.fileLabel, styles.signedLabel),
            root: classNames(styles.textField, styles.uploadInput)
          }}
          isDocument
          value={newPharmacy.agreement.link}
          onChange={handleUploadFile('agreement')}
        />
      </div>
    );
  };

  return (
    <>
      {renderInputBasicInfo()}
      {renderInputWorkingHours()}
      {renderInputManagerInfo()}
      {renderInputSignedBlock()}
    </>
  );
};
