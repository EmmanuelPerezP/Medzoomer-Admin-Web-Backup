import React, { useState, ReactNode, useRef, useEffect } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import CheckBox from '../../../common/Checkbox';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { InputAdornment } from '@material-ui/core';
import usePharmacy from '../../../../hooks/usePharmacy';
import useUser from '../../../../hooks/useUser';
import { useStores } from '../../../../store';
import { days, periodDays } from '../../../../constants';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import Error from '../../../common/Error';
import Button from '@material-ui/core/Button';
import styles from './PharmacyInputs.module.sass';
import SelectButton from '../../../common/SelectButton';
import SelectBillingAccounts from './SelectBillingAccounts';
import { isPharmacyIndependent } from '../../helper/isPharmacyIndependent';
import { getDateFromTimezone, changeOpen24_7 } from '../../../../utils';
import BasicInfoBlock from './BasicInfo/BasicInfoBlock';
import WorkingHours from './WorkingHours/WorkingHours';
import ManagerProfile from './ManagerProfile/ManagerProfile';

export const PharmacyInputs = (props: { err: any; setError: any; children?: ReactNode; reference?: any }) => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const user = useUser();
  const [turnHv, setTurnHv] = useState(newPharmacy.hvDeliveries !== 'Yes' ? 'No' : 'Yes');
  const refBasicInfo = useRef(null);
  const refWorkingHours = useRef(null);
  const refManagerInfo = useRef(null);
  const refSignedBlock = useRef(null);
  const { err, setError, reference } = props;
  const [isSplitByDay, setIsSplitByDay] = useState(newPharmacy.schedule.wholeWeek.isClosed);

  const [isOpen24_7, setIsOpen24_7] = useState(false);

  const handleChangeOpen24_7 = (e: React.ChangeEvent<HTMLInputElement> | null, checked: boolean) => {
    newPharmacy.schedule.wholeWeek.isClosed = !checked;
    setIsOpen24_7(checked);
    changeOpen24_7(checked, newPharmacy.schedule);
  };

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

  const handleChangeCheckBox = () => {
    setIsSplitByDay(!isSplitByDay);
    newPharmacy.schedule.wholeWeek.isClosed = !isSplitByDay;
  };

  const handleChange = (key: string) => (e: any) => {
    const { value, checked } = e.target;
    let newValue: any = value;

    if (key === 'hvDeliveries') {
      newValue = String(e);
      setTurnHv(newValue);
      if (newValue === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [key]: newValue,
          hvPriceFirstDelivery: '',
          // hvPriceFollowingDeliveries: '',
          hvPriceHighVolumeDelivery: ''
        });
        return;
      }
    }

    if (key === 'apartment') {
      const tempRoughAddressObj = newPharmacy.roughAddressObj ? newPharmacy.roughAddressObj : newPharmacy.address;
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: {
          ...tempRoughAddressObj,
          apartment: newValue
        }
      });
    }

    // console.log('key', key);
    // console.log('value', value);
    // console.log('checked', checked);

    if (key.includes('reportedBackItems') || key.includes('ordersSettings')) {
      return handleItemsWithTwoKeyNames(key, checked);
    }
    if (key.includes('controlledMedications')) return handleControlledMedications(key, newValue, checked);
    if (key.includes('existingDrivers') || key.includes('assistedLivingFacilitiesOrGroupHomes')) {
      const keyName1 = key.split('_')[0] as 'existingDrivers' | 'assistedLivingFacilitiesOrGroupHomes';
      const keyName2 = key.split('_')[1];

      if (keyName2 === 'value' && newValue === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName1]: {
            ...newPharmacy[keyName1],
            [keyName2]: newValue,
            volume: ''
          }
        });
      } else {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName1]: {
            ...newPharmacy[keyName1],
            [keyName2]: newValue
          }
        });
      }

      setError({
        ...err,
        [keyName1]: {
          value: '',
          volume: ''
        }
      });

      return;
    }

    if (key.includes('managers')) return handleManagers(key, newValue);

    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: newValue });
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

  const renderInputBasicInfo = () => {
    const isIndependentPharmacy = isPharmacyIndependent(newPharmacy);

    return (
      <>
        {isIndependentPharmacy && <SelectBillingAccounts />}
        <div ref={refBasicInfo} className={styles.basicInfo}>
          <BasicInfoBlock err={err} setError={setError} newPharmacy={newPharmacy} handleChange={handleChange} />
        </div>
      </>
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
            <SelectButton label="" value={turnHv} onChange={handleChange('hvDeliveries')} />
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
      <>
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
      </>
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
            value={isString ? (data ? getDateFromTimezone(data, user, 'hh') : '') : data.hour}
            onChange={handleChangeSchedule(day, param, 'hour')}
          />
          <TextField
            classes={{
              input: styles.middleInput,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{ type: 'number' }}
            disabled={_.get(newPharmacy, `schedule[${day}].isClosed`)}
            value={isString ? (data ? getDateFromTimezone(data, user, 'mm') : '') : data.minutes}
            onChange={handleChangeSchedule(day, param, 'minutes')}
          />
          <Select
            value={data ? data.period || getDateFromTimezone(data, user, 'A') : 'AM'}
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
  console.log('newPharmacy ---->', newPharmacy);

  // useEffect(() => {
  //   switch (reference) {
  //     case 'refBasicInfo':
  //       (refBasicInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       break;
  //     case 'additionalInfo':
  //       (additionalInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       break;
  //     case 'refWorkingHours':
  //       (refWorkingHours.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       if (checkIsOpen24_7(newPharmacy.schedule)) handleChangeOpen24_7(null, true);
  //       break;
  //     case 'refManagerInfo':
  //       (refManagerInfo.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       break;
  //     case 'refSignedBlock':
  //       (refSignedBlock.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       break;
  //     case 'refAffiliation':
  //       (refAffiliation.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       break;
  //     case 'refOrdersSettings':
  //       (refOrdersSettings.current as any).scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       break;
  //     default:
  //       return;
  //   }
  // }, [reference]); // eslint-disable-line

  const handleControlledMedications = (key: string, newValue: string, checked: boolean) => {
    const keyName = key.split('_')[1];

    if (keyName === 'value' && newValue === 'No') {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        controlledMedications: {
          value: 'No',
          signature: false,
          photoOfId: false,
          specialRequirements: false,
          specialRequirementsNote: ''
        }
      });
    } else {
      let value: string | boolean = newValue;
      if (['signature', 'photoOfId', 'specialRequirements'].includes(keyName)) {
        value = checked;
      }
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        controlledMedications: {
          ...newPharmacy.controlledMedications,
          [keyName]: value
        }
      });
    }
    setError({
      ...err,
      controlledMedications: {
        value: '',
        signature: '',
        photoOfId: '',
        specialRequirements: '',
        specialRequirementsNote: ''
      }
    });
  };

  const handleManagers = (key: string, newValue: string) => {
    const keyName1 = key.split('_')[1] as 'primaryContact' | 'secondaryContact';
    const keyName2 = key.split('_')[2] as 'firstName' | 'lastName' | 'phone' | 'email';

    // console.log('keyName1 -------->', keyName1);
    // console.log('keyName2 -------->', keyName2);
    // console.log('newValue -------->', newValue);
    // if (keyName2 === 'phone' && newValue && !newValue.startsWith('+') && !newValue.startsWith(PHONE_COUNTRY_CODE)) {
    //   newValue = `${PHONE_COUNTRY_CODE}${newValue}`;
    // }

    if (keyName1 === 'primaryContact') {
      let oldKeyName = '';
      let managerName,
        firstName,
        lastName = '';

      if (keyName2 === 'firstName' || keyName2 === 'lastName') {
        oldKeyName = 'managerName';
        firstName = (keyName2 === 'firstName' ? newValue : '') || newPharmacy.managers.primaryContact.firstName;
        lastName = (keyName2 === 'lastName' ? newValue : '') || newPharmacy.managers.primaryContact.lastName;
        managerName = (firstName + ' ' + lastName).trim();
      }
      if (keyName2 === 'phone') oldKeyName = 'managerPhoneNumber';
      if (keyName2 === 'email') oldKeyName = 'email';

      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        [oldKeyName]: oldKeyName === 'managerName' ? managerName : newValue,
        managers: {
          ...newPharmacy.managers,

          [keyName1]: {
            ...newPharmacy.managers[keyName1],
            [keyName2]: newValue
          }
        }
      });
    } else {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        managers: {
          ...newPharmacy.managers,
          [keyName1]: {
            ...newPharmacy.managers[keyName1],
            [keyName2]: newValue
          }
        }
      });
    }

    setError({
      ...err,
      managers: {
        ...err.managers,

        [keyName1]: {
          ...err.managers[keyName1],
          [keyName2]: ''
        }
      }
    });
  };

  const handleItemsWithTwoKeyNames = (key: string, checked: boolean) => {
    const keyName1 = key.split('_')[0] as 'reportedBackItems' | 'ordersSettings';
    const keyName2 = key.split('_')[1];

    pharmacyStore.set('newPharmacy')({
      ...newPharmacy,
      [keyName1]: {
        ...newPharmacy[keyName1],
        [keyName2]: checked
      }
    });
    setError({
      ...err,
      [keyName1]: {
        ...err[keyName1],
        [keyName2]: ''
      }
    });
  };

  const onChangeApartment = (e: { target: { value: any } }) => {
    const { value } = e.target;
    pharmacyStore.set('newPharmacy')({
      ...newPharmacy,
      roughAddressObj: { ...newPharmacy.roughAddressObj, apartment: value }
    });
  };

  return (
    <div className={styles.infoWrapper}>
      {renderInputBasicInfo()}

      <div ref={refWorkingHours}>
        <WorkingHours
          err={err}
          setError={setError}
          handleChangeOpen24_7={handleChangeOpen24_7}
          isOpen24_7={isOpen24_7}
        />
      </div>

      <div ref={refManagerInfo}>
        {newPharmacy.managers && newPharmacy.managers.primaryContact && (
          <ManagerProfile err={err} newPharmacy={newPharmacy} handleChange={handleChange} />
        )}
      </div>
      {renderInputWorkingHours()}
      {renderInputManagerInfo()}
      {renderInputHV()}
      {newPharmacy.signedAgreementUrl && renderSignedBlock()}
      {err.global ? <Error value={err.global} /> : null}
    </div>
  );
};
