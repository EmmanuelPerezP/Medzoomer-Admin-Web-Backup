import React, { FC, useState } from 'react';
import { useHistory } from 'react-router';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import usePharmacy from '../../hooks/usePharmacy';
import useUser from '../../hooks/useUser';
import { decodeErrors, prepareScheduleDay, prepareScheduleUpdate } from '../../utils';
import { days } from '../../constants';

import PharmacyInputs from '../PharmacyInputs';
import SVGIcon from '../common/SVGIcon';
import Image from '../common/Image';

import styles from './CreatePharmacy.module.sass';

export const CreatePharmacy: FC = () => {
  const history = useHistory();
  const { newPharmacy, createPharmacy, resetPharmacy, setEmptySchedule } = usePharmacy();
  const { getFileLink, sub } = useUser();
  const [err, setErr] = useState({
    global: '',
    name: '',
    price: '',
    address: '',
    longitude: '',
    latitude: '',
    preview: '',
    agreement: '',
    managerName: '',
    email: '',
    phone: ''
  });
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleScorollTo = (ref: string) => () => {
    setReference(ref);
    handleChangeStep(1)();
  };

  const handleGoToPharmacies = () => {
    history.push('/dashboard/pharmacies');
  };

  const handleGetFileLink = (fileId: string) => async () => {
    try {
      const { link } = await getFileLink(sub, `${fileId}`);
      (window.open(link, '_blank') as any).focus();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeStep = (nextStep: number) => () => {
    setStep(nextStep);
  };

  const handleCreatePharmacy = async () => {
    setIsLoading(true);
    try {
      const { schedule, ...pharmacy } = newPharmacy;

      if (Object.keys(schedule).some((d) => !!schedule[d].open.hour)) {
        prepareScheduleDay(schedule, 'wholeWeek');
        days.forEach((day) => {
          prepareScheduleDay(schedule, day.value);
        });
        await createPharmacy({
          ...pharmacy,
          agreement: { link: pharmacy.agreement.fileKey, name: pharmacy.agreement.name },
          schedule
        });
      } else {
        await createPharmacy({
          ...pharmacy,
          agreement: { link: pharmacy.agreement.fileKey, name: pharmacy.agreement.name }
        });
      }

      resetPharmacy();
      setIsLoading(false);
      handleChangeStep(3)();
    } catch (error) {
      const errors = error.response.data;
      if (errors.message !== 'validation error' && errors.message !== 'Phone number is not valid') {
        setErr({ ...err, global: errors.message });
      } else {
        setErr({ ...err, ...decodeErrors(errors.details) });
        if (errors.message === 'Phone number is not valid') {
          setErr({ ...err, phone: 'Phone number is not valid' });
        }

        if (Object.keys(newPharmacy.schedule).some((d) => typeof newPharmacy.schedule[d].open === 'string')) {
          prepareScheduleUpdate(newPharmacy.schedule, 'wholeWeek');
          days.forEach((day) => {
            prepareScheduleUpdate(newPharmacy.schedule, day.value);
          });
        } else {
          setEmptySchedule();
        }
      }

      setIsLoading(false);
      handleChangeStep(1)();
    }
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        {step === 1 ? (
          <Link className={styles.link} to={'/dashboard/pharmacies'}>
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
              disabled={isLoading}
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

  const renderViewBasicInfo = () => {
    return (
      <div className={styles.basicInfo}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Basic Information</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleScorollTo('refBasicInfo')} />
        </div>
        {renderSummaryItem('Pharmacy Name', newPharmacy.name)}
        {renderSummaryItem('Address', newPharmacy.address)}
        {renderSummaryItem('Per-Prescription Price', newPharmacy.price)}
        <div className={styles.previewPhoto}>
          <Typography className={styles.field}>Preview Photo</Typography>
          <Image cognitoId={sub} className={styles.preview} src={newPharmacy.preview} alt="No Preview" />
        </div>
      </div>
    );
  };

  const renderViewWorkingHours = () => {
    return (
      <div className={styles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Working Hours</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleScorollTo('refWorkingHours')} />
        </div>
        {newPharmacy.schedule.wholeWeek.isClosed ? (
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
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleScorollTo('refManagerInfo')} />
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
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleScorollTo('refSignedBlock')} />
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
        <div className={styles.mainInfo}>
          {step === 1 ? <PharmacyInputs reference={reference} err={err} setError={setErr} /> : renderSecondStep()}
        </div>
        {renderFooter()}
      </div>
    );
  };

  const renderSummaryItem = (name: string, value: string) => {
    return (
      <div className={styles.summaryItem}>
        <Typography className={styles.field}>{name}</Typography>
        {name === 'Uploaded File' ? (
          <div onClick={handleGetFileLink(newPharmacy.agreement.fileKey)} className={styles.document}>
            {value}
          </div>
        ) : (
          <Typography>{value}</Typography>
        )}
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
