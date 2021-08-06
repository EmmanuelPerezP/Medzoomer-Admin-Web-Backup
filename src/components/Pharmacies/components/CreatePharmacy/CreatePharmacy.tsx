import React, { FC, useState } from 'react';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import usePharmacy from '../../../../hooks/usePharmacy';
import {
  decodeErrors,
  newScheduleForSendingToServer,
  updateScheduleFromServerToRender,
  changeOpen24h7d
} from '../../../../utils';
import { days } from '../../../../constants';
import PharmacyInputs from '../PharmacyInputs';
import SVGIcon from '../../../common/SVGIcon';
import { isValidPharmacy } from '../../helper/validate';
import styles from './CreatePharmacy.module.sass';
import SummaryBlock from './SummaryBlock/SummaryBlock';
import PharmacyCreatedBlock from './PharmacyCreatedBlock/PharmacyCreatedBlock';

const emptyPharmacyErr = {
  global: '',
  name: '',
  price: '',
  roughAddress: '',
  hvPriceFirstDelivery: '',
  // hvPriceFollowingDeliveries: '',
  hvPriceHighVolumeDelivery: '',
  longitude: '',
  latitude: '',
  preview: '',
  agreement: '',
  managerName: '',
  email: '',
  phone_number: '',
  schedule: '',
  phone: '',
  managers: {
    primaryContact: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    secondaryContact: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    }
  }
};

export const CreatePharmacy: FC = () => {
  const history = useHistory();
  const { newPharmacy, createPharmacy, resetPharmacy, setPharmacy } = usePharmacy();
  const [err, setErr] = useState({ ...emptyPharmacyErr });
  const [step, setStep] = useState(1);
  const [reference, setReference] = useState('');
  const [namePharmacy, setNamePharmacy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen24h7d, setIsOpen24h7d] = useState(false);

  const handleChangeOpen24h7d = (e: React.ChangeEvent<HTMLInputElement> | null, checked: boolean) => {
    let newSchedule = Object.assign({}, newPharmacy.schedule);
    setIsOpen24h7d(checked);
    newSchedule = changeOpen24h7d(checked, newSchedule);
    setErr({ ...err, schedule: '' });

    return newSchedule;
  };

  const handleGoToPharmacies = () => {
    history.push('/dashboard/pharmacies');
  };

  const handleChangeStep = (nextStep: number) => () => {
    if (step === 1 && !isValidPharmacy(newPharmacy, err, setErr)) return;
    setStep(nextStep);
  };

  const handleCreatePharmacy = async () => {
    setIsLoading(true);

    try {
      const { schedule, ...pharmacy } = newPharmacy;
      if (!schedule.wholeWeek.isClosed) {
        days.forEach((day) => {
          schedule[day.value].isClosed = true;
        });
      }
      const newSchedule = newScheduleForSendingToServer(schedule);
      await createPharmacy({
        ...pharmacy,
        rcFlatFeeForCourier: pharmacy.rcFlatFeeForCourier ? +pharmacy.rcFlatFeeForCourier : 0,
        rcFlatFeeForPharmacy: pharmacy.rcFlatFeeForPharmacy ? +pharmacy.rcFlatFeeForPharmacy : 0,
        agreement: { link: pharmacy.agreement.fileKey, name: pharmacy.agreement.name },
        schedule: newSchedule,
        signUpStep: pharmacy.affiliation ? 'summary' : ''
      });
      setNamePharmacy(pharmacy.name);
      resetPharmacy();
      setIsLoading(false);
      handleChangeStep(3)();
    } catch (error) {
      const errors = error.response.data;
      if (errors.message !== 'validation error' && errors.message !== 'Phone number is not valid') {
        setErr({ ...err, global: errors.message });
      } else {
        if (errors.message === 'Phone number is not valid') {
          setErr({ ...err, phone_number: 'Phone number is not valid' });
        } else
        if (decodeErrors(errors.details).email === 'Contact Email is not allowed to be empty') {
          setErr({ ...err, email: 'Contact Email is not valid' });
        } else {
          setErr({ ...err, ...decodeErrors(errors.details) });
        }
        const { schedule } = updateScheduleFromServerToRender(newPharmacy.schedule, 'creating');
        setPharmacy({ ...newPharmacy, schedule });
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

  const renderFooter = () => (
    <div className={styles.buttons}>
      {step === 1 ? (
        <Button className={styles.changeStepButton} variant="contained" color="secondary" onClick={handleChangeStep(2)}>
          <Typography className={styles.summaryText}>Continue</Typography>
        </Button>
      ) : (
        <>
          <div className={styles.link} onClick={handleChangeStep(1)}>
            <SVGIcon name="backArrow2" className={styles.backArrowIcon} />
            <Typography className={styles.previousStep}>Previous step</Typography>
          </div>
          <Button
            className={styles.createPharmacyButton}
            variant="contained"
            color="default"
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

  return (
    <div className={styles.createPharmacyWrapper}>
      {step === 3 ? (
        <PharmacyCreatedBlock
          namePharmacy={namePharmacy}
          handleGoToPharmacies={handleGoToPharmacies}
          handleChangeStep={handleChangeStep}
        />
      ) : (
        <>
          {renderHeaderBlock()}
          <div className={styles.pharmacyBlock}>
            {step === 1 ? (
              <PharmacyInputs
                reference={reference}
                err={err}
                setError={setErr}
                isOpen24_7={isOpen24h7d}
                handleChangeOpen24_7={handleChangeOpen24h7d}
              />
            ) : (
              <SummaryBlock setReference={setReference} handleChangeStep={handleChangeStep} />
            )}
            {renderFooter()}
          </div>
        </>
      )}
    </div>
  );
};
