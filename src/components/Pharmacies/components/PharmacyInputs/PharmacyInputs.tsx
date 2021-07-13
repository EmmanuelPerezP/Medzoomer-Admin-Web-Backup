import React, { useState, ReactNode, useRef, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid/v4';
import CheckBox from '../../../common/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { InputAdornment } from '@material-ui/core';
import usePharmacy from '../../../../hooks/usePharmacy';
import useUser from '../../../../hooks/useUser';
import { useStores } from '../../../../store';
import { days, periodDays } from '../../../../constants';

import TextField from '../../../common/TextField';
import FileInput from '../../../common/FileInput';
import Select from '../../../common/Select';
import Error from '../../../common/Error';
import MapSearch from '../../../common/MapSearch';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import Image from '../../../common/Image';
import Button from '@material-ui/core/Button';
import styles from './PharmacyInputs.module.sass';
import SelectButton from '../../../common/SelectButton';
import SelectBillingAccounts from './SelectBillingAccounts';
import { isPharmacyIndependent } from '../../helper/isPharmacyIndependent';
import moment from 'moment';

const fileId = uuid();

export const PharmacyInputs = (props: { err: any; setError: any; children?: ReactNode; reference?: any }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const user = useUser();
  const [isPreviewUpload, setIsPreviewUpload] = useState(false);
  const [turnHv, setTurnHv] = useState(newPharmacy.hvDeliveries !== 'Yes' ? 'No' : 'Yes');
  const [affiliation, setAffiliation] = useState(isPharmacyIndependent(newPharmacy) ? 'independent' : 'group');
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

  useEffect(() => {
    if (newPharmacy && !newPharmacy.roughAddressObj) {
      // newPharmacy.roughAddressObj = newPharmacy.address; // was before
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: { ...newPharmacy.address }
      });
    }
    // eslint-disable-next-line
  }, [newPharmacy]);

  const handleUploadImage = (key: any) => async (evt: any) => {
    setError({ ...err, [key]: '' });
    try {
      const size = { width: 200, height: 200 };
      const file = evt.target.files[0];
      if (file) {
        setIsPreviewUpload(true);
        const { keys } = await user.uploadImage(user.sub, file, size);
        pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: keys[0] });
      }
    } catch (error) {
      setError({ ...err, [key]: 'Something went wrong. Please try to upload another picture.' });
    }
    setIsPreviewUpload(false);
  };

  const handleChangeCheckBox = () => {
    setIsSplitByDay(!isSplitByDay);
    newPharmacy.schedule.wholeWeek.isClosed = !isSplitByDay;
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    let value;

    if (key === 'hvDeliveries') {
      value = String(e);
      setTurnHv(value);
      if (value === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [key]: value,
          hvPriceFirstDelivery: '',
          // hvPriceFollowingDeliveries: '',
          hvPriceHighVolumeDelivery: ''
        });
        return;
      }
    } else if (key === 'affiliation') {
      setAffiliation(String(e));
      value = String(e);
    } else {
      console.log(e);
      value = e.target.value;
    }

    if (key === 'apartment') {
      const tempRoughAddressObj = newPharmacy.roughAddressObj ? newPharmacy.roughAddressObj : newPharmacy.address;
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: {
          ...tempRoughAddressObj,
          apartment: value
        }
      });
    } else {
      console.log(value);
      pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: value });
    }

    setError({ ...err, [key]: '' });
  };

  const handleChangeSchedule = (day: string, param: string, key?: string) => (e: React.ChangeEvent<{ value: any }>) => {
    const { value } = e.target;
    const schedule = { ...newPharmacy.schedule };

    if (param === 'isClosed') {
      schedule[day][param] = !schedule[day][param];
    } else {
      if (key === 'hour' && (value.length > 2 || value > 12)) {
        return;
      }
      if (key === 'minutes' && (value.length > 2 || value > 59)) {
        return;
      }
      schedule[day][param][key as any] = value;
    }

    setError({ ...err, schedule: '' });

    pharmacyStore.set('newPharmacy')({
      ...newPharmacy,
      schedule
    });
  };

  const renderSwitch = () => {
    return (
      <div className={styles.affiliationWrapper}>
        <Typography className={styles.blockTitle}>Pharmacy Affiliation</Typography>
        <div className={styles.independentInput}>
          <SelectButton
            defItems={[
              { value: 'independent', label: 'Independent' },
              { value: 'group', label: 'Group' }
            ]}
            label=""
            value={affiliation}
            onChange={handleChange('affiliation')}
          />
        </div>
      </div>
    );
  };

  const renderInputBasicInfo = () => {
    return (
      <>
        {affiliation === 'independent' && <SelectBillingAccounts />}

        <div ref={refBasicInfo} className={styles.basicInfo}>
          <Typography className={styles.blockTitle}>Basic Information</Typography>
          <TextField
            label={'Pharmacy Name *'}
            classes={{
              input: styles.input,
              inputRoot: styles.inputRoot,
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Please enter pharmacy name'
            }}
            value={newPharmacy.name}
            onChange={handleChange('name')}
          />
          {err.name ? <Error className={styles.error} value={err.name} /> : null}
          <MapSearch
            handleClearError={() => setError({ ...err, roughAddress: '', latitude: '', longitude: '' })}
            setError={setError}
            err={err}
          />
          {err.roughAddress ? <Error className={styles.error} value={err.roughAddress} /> : null}
          {!err.roughAddress && (err.latitude || err.longitude) ? (
            <Error value={'Please, select an address from the proposed'} />
          ) : null}
          <TextField
            label={'Unit/Apartment Number'}
            classes={{
              input: styles.input,
              inputRoot: styles.inputRoot,
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Unit/Apartment'
            }}
            value={newPharmacy.roughAddressObj && newPharmacy.roughAddressObj.apartment}
            onChange={handleChange('apartment')}
          />

          {/*<TextField*/}
          {/*  label={'Per-Prescription Price'}*/}
          {/*  classes={{*/}
          {/*    root: classNames(styles.textField, styles.priceInput)*/}
          {/*  }}*/}
          {/*  inputProps={{*/}
          {/*    placeholder: '0.00',*/}
          {/*    endAdornment: <InputAdornment position="start">USD</InputAdornment>*/}
          {/*  }}*/}
          {/*  value={newPharmacy.price}*/}
          {/*  onChange={handleChange('price')}*/}
          {/*/>*/}
          {/*{err.price ? <Error className={styles.error} value={err.price} /> : null}*/}
          {renderDocument()}
          {renderSwitch()}
        </div>
      </>
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
        <Typography className={styles.blockTitle}>Pharmacy Contacts</Typography>
        <div className={styles.twoInput}>
          <div className={styles.textField}>
            <TextField
              label={'Manager Full Name *'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                placeholder: 'Please enter full name'
              }}
              value={newPharmacy.managerName}
              onChange={handleChange('managerName')}
            />
            {err.managerName ? <Error className={styles.error} value={err.managerName} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Manager Phone Number'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                placeholder: '+1 (000) 000-0000'
              }}
              value={newPharmacy.managerPhoneNumber}
              onChange={handleChange('managerPhoneNumber')}
            />
            {err.managerPhoneNumber ? <Error className={styles.error} value={err.managerPhoneNumber} /> : null}
          </div>
        </div>
        <div className={styles.twoInput}>
          <div className={styles.textField}>
            <TextField
              label={'Manager Contact Email *'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                placeholder: 'Please enter contact email'
              }}
              value={newPharmacy.email}
              onChange={handleChange('email')}
            />
            {err.email ? <Error className={styles.error} value={err.email} /> : null}
          </div>
          <div className={styles.textField}>
            <TextField
              label={'Pharmacy Phone Number *'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                placeholder: '+1 (000) 000-0000'
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

  const renderInputHV = () => {
    return (
      <div ref={refManagerInfo} className={styles.managerBlock}>
        <Typography className={styles.blockTitle}>High Volume Deliveries</Typography>
        <div className={styles.twoInput}>
          <div className={styles.textField}>
            <SelectButton
              defItems={[
                {
                  label: 'On',
                  value: 'Yes'
                },
                {
                  label: 'Off',
                  value: 'No'
                }
              ]}
              label=""
              value={turnHv}
              onChange={handleChange('hvDeliveries')}
            />
          </div>
        </div>
        {turnHv === 'Yes' ? (
          <>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Price for Delivery (Pharmacy)'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    type: 'number',
                    placeholder: '0.00',
                    startAdornment: <InputAdornment position="end">$</InputAdornment>
                  }}
                  value={newPharmacy.hvPriceFirstDelivery}
                  onChange={handleChange('hvPriceFirstDelivery')}
                />
                {err.hvPriceFirstDelivery ? <Error className={styles.error} value={err.hvPriceFirstDelivery} /> : null}
              </div>
              {/*<div className={styles.textField}>*/}
              {/*  <TextField*/}
              {/*    label={'Following Deliveries (invoice)'}*/}
              {/*    classes={{*/}
              {/*      root: styles.textField*/}
              {/*    }}*/}
              {/*    inputProps={{*/}
              {/*      type: 'number'*/}
              {/*    }}*/}
              {/*    value={newPharmacy.hvPriceFollowingDeliveries}*/}
              {/*    onChange={handleChange('hvPriceFollowingDeliveries')}*/}
              {/*  />*/}
              {/*  {err.hvPriceFollowingDeliveries ? (*/}
              {/*    <Error className={styles.error} value={err.hvPriceFollowingDeliveries} />*/}
              {/*  ) : null}*/}
              {/*</div>*/}
            </div>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Price for Delivery (Courier)'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    type: 'number',
                    placeholder: '0.00',
                    startAdornment: <InputAdornment position="end">$</InputAdornment>
                  }}
                  value={newPharmacy.hvPriceHighVolumeDelivery}
                  onChange={handleChange('hvPriceHighVolumeDelivery')}
                />
                {err.hvPriceHighVolumeDelivery ? (
                  <Error className={styles.error} value={err.hvPriceHighVolumeDelivery} />
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const renderInputWorkingHours = () => {
    return (
      <div ref={refWorkingHours} className={styles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Working Hours *</Typography>
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

        {err.schedule ? <Error value={err.schedule} /> : null}
      </div>
    );
  };

  const renderDateInput = (order: number, day: string, param: string) => {
    const isString = !_.get(newPharmacy, `schedule[${day}][${param}].period`);
    const data = _.get(newPharmacy, `schedule[${day}][${param}]`);

    return (
      <div className={styles.hourBlockInput}>
        <Typography className={styles.label}>{order === 1 ? 'Open' : 'Close'}</Typography>
        <div className={styles.dateInput}>
          <TextField
            classes={{
              input: styles.leftInput,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{ type: 'number' }}
            disabled={_.get(newPharmacy, `schedule[${day}].isClosed`)}
            value={isString ? (data ? moment(data).format('hh') : '') : data.hour}
            onChange={handleChangeSchedule(day, param, 'hour')}
          />
          <TextField
            classes={{
              input: styles.middleInput,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{ type: 'number' }}
            disabled={_.get(newPharmacy, `schedule[${day}].isClosed`)}
            value={isString ? (data ? moment(data).format('mm') : '') : data.minutes}
            onChange={handleChangeSchedule(day, param, 'minutes')}
          />
          <Select
            value={data ? data.period || moment(data).format('A') : 'AM'}
            onChange={handleChangeSchedule(day, param, 'period')}
            items={periodDays}
            inputProps={{
              disabled: _.get(newPharmacy, `schedule[${day}].isClosed`)
            }}
            IconComponent={() => <ArrowDropDown style={{ height: '15px', width: '15px' }} />}
            classes={{
              input: styles.rightInput,
              selectLabel: styles.selectLabel,
              inputRoot: styles.inputRoot
            }}
            className={styles.periodSelect}
          />
        </div>
      </div>
    );
  };

  // const renderInputSignedBlock = () => {
  //   return (
  //     <div ref={refSignedBlock} className={styles.signedBlock}>
  //       <Typography className={styles.blockTitle}>Signed Agreement</Typography>
  //       <FileInput
  //         label={`Upload PDF`}
  //         classes={{
  //           input: styles.fileRootInput,
  //           inputLabel: classNames(styles.fileLabel, styles.signedLabel),
  //           root: classNames(styles.textField, styles.uploadInput)
  //         }}
  //         isDocument
  //         isLoading={isPDFUploading}
  //         secondLabel={_.get(newPharmacy, 'agreement.name')}
  //         value={_.get(newPharmacy, 'agreement.link')}
  //         onChange={handleUploadFile('agreement')}
  //       />
  //       {err.agreement ? <Error value={err.agreement} /> : null}
  //     </div>
  //   );
  // };

  const renderSignedBlock = () => {
    return (
      <div ref={refSignedBlock} className={styles.signedBlock}>
        <Typography className={styles.blockTitle}>Signed Agreement</Typography>
        <a
          href={newPharmacy.signedAgreementUrl}
          download
          style={{ textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className={styles.changeStepButton} variant="contained" color="secondary">
            <Typography className={styles.summaryText}>Download PDF</Typography>
          </Button>
        </a>
      </div>
    );
  };

  return (
    <div className={styles.infoWrapper}>
      {renderInputBasicInfo()}
      {renderInputWorkingHours()}
      {renderInputManagerInfo()}
      {renderInputHV()}
      {/*{renderInputSignedBlock()}*/}
      {newPharmacy.signedAgreementUrl && renderSignedBlock()}
      {err.global ? <Error value={err.global} /> : null}
    </div>
  );
};
