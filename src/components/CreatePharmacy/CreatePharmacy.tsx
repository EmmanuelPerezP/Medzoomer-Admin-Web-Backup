import React, { FC, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid/v4';
import Button from '@material-ui/core/Button';
import CheckBox from '../common/Checkbox';
import Link from '@material-ui/core/Link';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import SVGIcon from '../common/SVGIcon';
import usePharmacy from '../../hooks/usePharmacy';
import MapSearch from '../common/MapSearch';
import useUser from '../../hooks/useUser';
import { useStores } from '../../store';
import TextField from '../common/TextField';
import FileInput from '../common/FileInput';
import Select from '../common/Select';
import { decodeErrors, prepareScheduleDay, changeScheduleSplit } from '../../utils';
import { days, periodDays } from '../../constants';

import styles from './CreatePharmacy.module.sass';

const fileId = uuid();

export const CreatePharmacy: FC = () => {
  const history = useHistory();
  const { pharmacyStore } = useStores();
  const { newPharmacy, createPharmacy, resetPharmacy } = usePharmacy();
  const user = useUser();
  const [err, setErr] = useState({
    name: '',
    price: '',
    address: '',
    longitude: '',
    latitude: '',
    preview: '',
    agreement: { link: '', name: '' },
    managerName: '',
    email: '',
    phone_number: ''
  });
  const [step, setStep] = useState(1);
  const [isSplitByDay, setIsSplitByDay] = useState(false);

  const handleGoToPharmacies = () => {
    history.push('/dashboard/pharmacies');
  };

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

  const handleChangeStep = (nextStep: number) => () => {
    setStep(nextStep);
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: value });
    setErr({ ...err, [key]: '' });
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

  const handleCreatePharmacy = async () => {
    prepareScheduleDay(newPharmacy.schedule, 'wholeWeek');
    days.map((day) => {
      prepareScheduleDay(newPharmacy.schedule, day.value);
    });

    await createPharmacy(newPharmacy);
    resetPharmacy();
    handleChangeStep(3)();
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        {step === 1 ? (
          <Link className={styles.link} href={'/dashboard/pharmacies'}>
            <SVGIcon name="backArrow" className={styles.backArrowIcon} />
          </Link>
        ) : (
          <div className={styles.link} onClick={handleChangeStep(1)}>
            <SVGIcon name="backArrow" className={styles.backArrowIcon} />
            <Typography className={styles.steps}>Step 1</Typography>
          </div>
        )}
        <Typography className={styles.title}>Add New Pharmacy</Typography>
        <Typography className={styles.steps}>Step {step} of 2</Typography>
      </div>
    );
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
        <MapSearch handleClearError={() => setErr({ ...err, address: '' })} />
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
        <div className={styles.twoInput}>
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

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        {step === 1 ? (
          <Button
            className={styles.changeStepButton}
            variant="contained"
            color="secondary"
            onClick={handleChangeStep(2)}
          >
            <Typography className={styles.summaryText}>View Summary</Typography>
          </Button>
        ) : (
          <>
            <div className={styles.link} onClick={handleChangeStep(1)}>
              <SVGIcon name="backArrow2" className={styles.backArrowIcon} />
              <Typography className={styles.previousStep}>Previous step</Typography>
            </div>
            <Button
              className={styles.changeStepButton}
              variant="contained"
              color="primary"
              onClick={handleCreatePharmacy}
            >
              <Typography className={styles.summaryText}>Create Pharmacy</Typography>
            </Button>
            <span style={{ width: '100%' }} />
          </>
        )}
      </div>
    );
  };

  const renderFirstStep = () => {
    return (
      <>
        {renderInputBasicInfo()}
        {renderInputWorkingHours()}
        {renderInputManagerInfo()}
        {renderInputSignedBlock()}
      </>
    );
  };

  const renderViewBasicInfo = () => {
    return (
      <div className={styles.basicInfo}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Basic Information</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleChangeStep(1)} />
        </div>
        {renderSummaryItem('Pharmacy Name', newPharmacy.name)}
        {renderSummaryItem('Address', newPharmacy.address)}
        {renderSummaryItem('Per-Prescription Price', newPharmacy.price)}
        <div className={styles.previewPhoto}>
          <Typography className={styles.field}>Preview Photo</Typography>
          <img style={{ maxWidth: '328px', maxHeight: '200px' }} src={newPharmacy.preview} alt="No Image" />
        </div>
      </div>
    );
  };

  const renderViewWorkingHours = () => {
    return (
      <div className={styles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Working Hours</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleChangeStep(1)} />
        </div>
        {isSplitByDay ? (
          days.map((day) => {
            return (
              <>
                {newPharmacy.schedule[day.value].isClosed
                  ? renderSummaryItem(day.label, `Day Off`)
                  : renderSummaryItem(
                      day.label,
                      `${newPharmacy.schedule[day.value].open.hour}:${newPharmacy.schedule[day.value].open.minutes} ${
                        newPharmacy.schedule[day.value].open.period
                      } - ${newPharmacy.schedule[day.value].close.hour}:${
                        newPharmacy.schedule[day.value].close.minutes
                      } ${newPharmacy.schedule[day.value].close.period}`
                    )}
              </>
            );
          })
        ) : (
          <>
            {renderSummaryItem(
              'Opens',
              `${newPharmacy.schedule.wholeWeek.open.hour}:${newPharmacy.schedule.wholeWeek.open.minutes} ${newPharmacy.schedule.wholeWeek.open.period}`
            )}
            {renderSummaryItem(
              'Close',
              `${newPharmacy.schedule.wholeWeek.close.hour}:${newPharmacy.schedule.wholeWeek.close.minutes} ${newPharmacy.schedule.wholeWeek.close.period}`
            )}
          </>
        )}
      </div>
    );
  };

  const renderViewManagerInfo = () => {
    return (
      <div className={styles.managerBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Manager Contacts</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleChangeStep(1)} />
        </div>
        {renderSummaryItem('Full Name', newPharmacy.managerName)}
        {renderSummaryItem('Contact Email', newPharmacy.email)}
        {renderSummaryItem('Contact Phone Number', newPharmacy.phone_number)}
      </div>
    );
  };

  const renderViewSignedBlock = () => {
    return (
      <div className={styles.signedBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Signed Agreement</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleChangeStep(1)} />
        </div>
        {renderSummaryItem('Uploaded File', newPharmacy.agreement.name)}
      </div>
    );
  };

  const renderSecondStep = () => {
    return (
      <>
        <Typography className={styles.summaryTitle}>Summary</Typography>
        {renderViewBasicInfo()}
        {renderViewWorkingHours()}
        {renderViewManagerInfo()}
        {renderViewSignedBlock()}
      </>
    );
  };

  const renderPharmacyInfo = () => {
    return (
      <div className={styles.pharmacyBlock}>
        <div className={styles.mainInfo}>{step === 1 ? renderFirstStep() : renderSecondStep()}</div>
        {renderFooter()}
      </div>
    );
  };

  const renderSummaryItem = (name: string, value: string) => {
    return (
      <div className={styles.summaryItem}>
        <Typography className={styles.field}>{name}</Typography>
        <Typography className={classNames({ [styles.document]: name === 'Uploaded File' })}>{value}</Typography>
      </div>
    );
  };

  const renderSuccessCreate = () => {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCreateBlock}>
          <SVGIcon name={'successCreate'} />
          <Typography className={styles.successTitle}>Pharmasy Created</Typography>
          <Typography className={styles.successSubTitle}>Duane Reade Pharmacy</Typography>
          <Button className={styles.okButton} variant="contained" color="secondary" onClick={handleGoToPharmacies}>
            <Typography className={styles.summaryText}>Ok</Typography>
          </Button>
        </div>
        <Typography onClick={handleChangeStep(1)} className={styles.createNew}>
          Create One More
        </Typography>
      </div>
    );
  };

  return (
    <div className={styles.createPharmacyWrapper}>
      {step === 3 ? (
        renderSuccessCreate()
      ) : (
        <>
          {renderHeaderBlock()}
          {renderPharmacyInfo()}
        </>
      )}
    </div>
  );
};
