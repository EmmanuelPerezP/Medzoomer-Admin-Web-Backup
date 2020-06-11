import React, { useState, ReactNode, useRef, useEffect } from 'react';
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
import { changeScheduleSplit } from '../../utils';
import { days, periodDays } from '../../constants';

import TextField from '../common/TextField';
import FileInput from '../common/FileInput';
import Select from '../common/Select';
import Error from '../common/Error';
import MapSearch from '../common/MapSearch';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Image from '../common/Image';

import styles from './PharmacyInputs.module.sass';

const fileId = uuid();

export const PharmacyInputs = (props: { err: any; setError: any; children?: ReactNode; reference?: any }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const user = useUser();
  const [isPreviewUpload, setIsPreviewUpload] = useState(false);
  const [isPDFUploading, setIsPDFUploading] = useState(false);
  const refBasicInfo = useRef(null);
  const refWorkingHours = useRef(null);
  const refManagerInfo = useRef(null);
  const refSignedBlock = useRef(null);
  const { err, setError, reference } = props;
  const [isSplitByDay, setIsSplitByDay] = useState(newPharmacy.schedule.wholeWeek.isClosed);

  useEffect(() => {
    switch (reference) {
      case 'refBasicInfo':
        (refBasicInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refWorkingHours':
        (refWorkingHours.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refManagerInfo':
        (refManagerInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      case 'refSignedBlock':
        (refSignedBlock.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      default:
        return;
    }
  }, [reference]);

  const handleUploadImage = (key: any) => async (evt: any) => {
    setError({ ...err, [key]: '' });
    try {
      const size = { width: 200, height: 200 };
      const file = evt.target.files[0];
      setIsPreviewUpload(true);
      const { keys } = await user.uploadImage(user.sub, file, size);
      pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: keys[0] });
    } catch (error) {
      setError({ ...err, [key]: 'Something went wrong. Please try to upload another picture.' });
    }
    setIsPreviewUpload(false);
  };

  const handleUploadFile = (key: any) => async (evt: any) => {
    setError({ ...err, [key]: '' });
    try {
      if (evt.target.files[0].type !== 'application/pdf') {
        setError({ ...err, [key]: 'Please download only PDF' });
        return;
      }
      const file = evt.target.files[0];
      const name = evt.target.files[0].name;
      setIsPDFUploading(true);
      const { link, fileKey } = await user.uploadFile(user.sub, file);
      pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: { link, name, fileKey } });
    } catch (error) {
      setError({ ...err, [key]: 'Something went wrong. Please try to upload another picture.' });
    }
    setIsPDFUploading(false);
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
      if (key === 'hour' && (value.length > 2 || value > 12)) {
        return;
      }
      if (key === 'minutes' && (value.length > 2 || value > 59)) {
        return;
      }
      schedule[day][parametr][key as any] = value;
    }

    pharmacyStore.set('newPharmacy')({
      ...newPharmacy,
      schedule
    });
  };

  const renderInputBasicInfo = () => {
    return (
      <div ref={refBasicInfo} className={styles.basicInfo}>
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
        <MapSearch handleClearError={() => setError({ ...err, address: '', latitude: '', longitude: '' })} />
        {err.address ? <Error value={err.address} /> : null}
        {!err.address && (err.latitude || err.longitude) ? (
          <Error value={'Please, select an address from the proposed'} />
        ) : null}
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
          {isPreviewUpload ? (
            <Loading />
          ) : newPharmacy.preview ? (
            <Image cognitoId={user.sub} className={styles.preview} src={newPharmacy.preview} alt="No Document" />
          ) : (
            <SVGIcon name={'uploadPhoto'} className={styles.uploadIcon} />
          )}
        </div>
        <FileInput
          id={fileId}
          classes={{
            input: styles.fileRootInput
          }}
          value={newPharmacy.preview ? newPharmacy.preview.link : ''}
          onChange={handleUploadImage('preview')}
        />
        {err.preview ? <Error value={err.preview} /> : null}
      </div>
    );
  };

  const renderInputManagerInfo = () => {
    return (
      <div ref={refManagerInfo} className={styles.managerBlock}>
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
      <div ref={refWorkingHours} className={styles.hoursBlock}>
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
      <div ref={refSignedBlock} className={styles.signedBlock}>
        <Typography className={styles.blockTitle}>Signed Agreement</Typography>
        <FileInput
          label={`Upload PDF`}
          classes={{
            input: styles.fileRootInput,
            inputLabel: classNames(styles.fileLabel, styles.signedLabel),
            root: classNames(styles.textField, styles.uploadInput)
          }}
          isDocument
          isLoading={isPDFUploading}
          secondLabel={newPharmacy.agreement.name}
          value={newPharmacy.agreement.link}
          onChange={handleUploadFile('agreement')}
        />
        {err.agreement ? <Error value={err.agreement} /> : null}
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
