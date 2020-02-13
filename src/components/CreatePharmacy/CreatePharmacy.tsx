import React, { FC, useState } from 'react';
import classNames from 'classnames';
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
import { decodeErrors } from '../../utils';

import styles from './CreatePharmacy.module.sass';

const periodDays = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' }
];

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

const fileId = uuid();

export const CreatePharmacy: FC = () => {
  const history = useHistory();
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const user = useUser();
  const [err, setErr] = useState({
    name: '',
    price: '',
    address: '',
    longitude: '',
    latitude: '',
    preview: '',
    agreement: '',
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
    pharmacyStore.set(key)(image);
  };

  const handleUploadFile = (key: any) => async (evt: any) => {
    const file = evt.target.files[0];
    const { link } = await user.uploadFile(user.sub, file);
    pharmacyStore.set(key)(link);
  };

  const handleChangeCheckBox = () => {
    setIsSplitByDay(!isSplitByDay);
  };

  const handleChangeStep = (nextStep: number) => () => {
    setStep(nextStep);
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    switch (key) {
      default:
        pharmacyStore.set('newPharmacy')({ ...pharmacyStore.get('newPharmacy'), [key]: value });
        break;
    }
    setErr({ ...err, [key]: '' });
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
                <div className={styles.inputWrapper}>
                  {/* {renderDateInput(1)}
                  {renderDateInput(2)} */}
                  <CheckBox label={'Day Off'} checked={isSplitByDay} onChange={handleChangeCheckBox} />
                </div>
              </>
            );
          })
        ) : (
          <div className={styles.inputWrapper}>{/* {renderDateInput(1)}
            {renderDateInput(2)} */}</div>
        )}
      </div>
    );
  };

  // const renderDateInput = (order: number) => {
  //   return (
  //     <div className={styles.hourBlockInput}>
  //       <Typography className={styles.label}>{order === 1 ? 'Open' : 'Close'}</Typography>
  //       <div className={styles.dateInput}>
  //         <TextField
  //           classes={{
  //             input: styles.input,
  //             inputRoot: classNames(styles.inputRoot, styles.textCenter)
  //           }}
  //           inputProps={{
  //             type: 'number'
  //           }}
  //           value={newPharmacy.day}
  //           onChange={handleChange('day')}
  //         />
  //         <TextField
  //           classes={{
  //             input: styles.input,
  //             inputRoot: classNames(styles.inputRoot, styles.textCenter)
  //           }}
  //           inputProps={{
  //             type: 'number'
  //           }}
  //           value={newPharmacy.year}
  //           onChange={handleChange('year')}
  //         />
  //         <Select
  //           value={newPharmacy.month}
  //           onChange={handleChange('month')}
  //           items={periodDays}
  //           IconComponent={() => <ArrowDropDown style={{ height: '15px', width: '15px' }} />}
  //           classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
  //           className={styles.monthSelect}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

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
          value={newPharmacy.agreement}
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
              onClick={handleChangeStep(3)}
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
        {renderSummaryItem('Pharmacy Name', 'Duane Reade Pharmacy')}
        {renderSummaryItem('Address', '85 Bobwhite, Shafter, NJ, 17981')}
        {renderSummaryItem('Per-Prescription Price', `$10.99`)}
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
        {renderSummaryItem('Opens', '8:00 AM')}
        {renderSummaryItem('Close', `8:00 PM`)}
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
        {renderSummaryItem('Full Name', 'Duane Reade')}
        {renderSummaryItem('Contact Email', 'duane.reade@gmail.com')}
        {renderSummaryItem('Contact Phone Number', `1 (424) 956-5371`)}
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
        {renderSummaryItem('Uploaded File', `DRP-to-MZ-Agreement.pdf`)}
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
