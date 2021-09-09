import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useHistory, useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Divider as DividerBase } from '@material-ui/core';
import useCourier from '../../../../hooks/useCourier';
import useTeams from '../../../../hooks/useTeams';
import { useStores } from '../../../../store';
import Back from '../../../common/Back';
import Loading from '../../../common/Loading';
import IncreaseBalanceModal from '../IncreaseBalanceModal';
import ConfirmationModal from '../../../common/ConfirmationModal';
import styles from './CourierInfo.module.sass';
import ChangeEmailModal from '../ChangeEmailModal';
import ChangePhoneModal from '../ChangePhoneModal';
import CourierLastBonuses from './components/CourierLastBonuses';
import CourierLastDeliveries from './components/CourierLastDeliveries';
import TopBlock from './components/TopBlock/TopBlock';
import AccordionWrapper from '../../../Pharmacies/components/PharmacyInfo/components/Accordion/AccordionWrapper';
import OnboardingInfo from './components/OnboardingInfo/OnboardingInfo';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import VerificationInfo from './components/VerificationInfo/VerificationInfo';
import SVGIcon from '../../../common/SVGIcon';
import CourierStatistic from './components/CourierStatistic';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

interface ISummaryItem {
  title: string;
  value: string;
  subValue?: string;
  onClick?: () => void;
  icon?: string;
  onIconClick?: () => void;
}

export const SummaryItem: FC<ISummaryItem> = ({ title, value, subValue, onClick, icon, onIconClick }) => {
  return (
    <div className={styles.summaryItem}>
      <Typography className={styles.field}>{title}</Typography>
      <Typography onClick={onClick && onClick} className={classNames({ [styles.isNotSent]: onClick })}>
        {value}
        <span className={styles.years}>{subValue}</span>
      </Typography>
      {icon && (
        <IconButton onClick={onIconClick} className={styles.summaryItemIconBtn}>
          <SVGIcon name={icon} />
        </IconButton>
      )}
    </div>
  );
};

export const CourierInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const {
    courier,
    getCourier,
    updateCourierStatus,
    updateCourierOnboarded,
    reAddToOnfleet,
    setEmptyCourier,
    increaseCourierBalance,
    checkCreateCandidate,
    changeCourierEmail,
    changeCourierPhone
  } = useCourier();
  const { getTeams, teams } = useTeams();
  const { courierStore, deliveryStore, teamsStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [newBalanceModal, setNewBalanceModal] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [checkRCreateLoading, setCheckRCreateLoading] = useState(false);
  const [checkRModal, setCheckRModal] = useState(false);
  const [newEmailModal, setNewEmailModal] = useState(false);
  const [newPhoneModal, setNewPhoneModal] = useState(false);
  const [openOnboardingInfo, setOpenOnboardingInfo] = useState(false);
  const [openPersonalInfo, setOpenPersonalInfo] = useState(false);
  const [openVerificationInfo, setOpenVerificationInfo] = useState(false);

  const onChangeOnboardingInfoAccordion = useCallback(
    (_event: React.ChangeEvent<{}>, expanded: boolean) => setOpenOnboardingInfo(expanded),
    []
  );

  const onChangePersonalInfoAccordion = useCallback(
    (_event: React.ChangeEvent<{}>, expanded: boolean) => setOpenPersonalInfo(expanded),
    []
  );

  const onChangeVerificationInfoAccordion = useCallback(
    (_event: React.ChangeEvent<{}>, expanded: boolean) => setOpenVerificationInfo(expanded),
    []
  );

  useEffect(() => {
    getCourierInfo().catch();
    if (!teams) {
      getTeamsList().catch();
    }
    return () => {
      setEmptyCourier();
      deliveryStore.set('meta')({ totalCount: 0, filteredCount: 0, totalFees: 0, bonus: 0 });
    };
    // eslint-disable-next-line
  }, []);

  const getCourierInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getCourier(id);
      courierStore.set('courier')(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [courierStore, getCourier, id]);

  const getTeamsList = useCallback(async () => {
    try {
      const groups = await getTeams();
      teamsStore.set('teams')(groups.data.teams);
    } catch (err) {
      console.error(err);
    }
  }, [getTeams, teamsStore]);

  const handleUpdateStatus = (status: string) => async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      const courierInfo = await updateCourierStatus(id, status);
      courierStore.set('courier')({ ...courierInfo.data });
      history.push('/dashboard/couriers');
      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleReAddToOnfleet = () => async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      await reAddToOnfleet(id);

      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleAddBalance = async (data: { amount: number; type: string; reason: string; note: string }) => {
    setIsLoading(true);
    setIsRequestLoading(true);
    await increaseCourierBalance(id, data);
    await getCourierInfo();
    setIsLoading(false);
    setIsRequestLoading(false);
  };

  const handleSetNewEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setIsRequestLoading(true);
      await changeCourierEmail({ _id: courier._id, email });
      await getCourierInfo();
    } catch (e) {
      console.error('error', e);
    } finally {
      setIsLoading(false);
      setIsRequestLoading(false);
    }
  };
  const handleSetNewPhone = async (phone: string) => {
    try {
      setIsLoading(true);
      setIsRequestLoading(true);
      await changeCourierPhone({ _id: courier._id, phone });
      await getCourierInfo();
    } catch (e) {
      console.error('error', e);
    } finally {
      setIsLoading(false);
      setIsRequestLoading(false);
    }
  };

  const handleUpdateOnboard = async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      const courierInfo = await updateCourierOnboarded(id, !courier.onboarded);

      courierStore.set('courier')({ ...courierInfo.data });
      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsRequestLoading(false);
      setIsLoading(false);
    }
  };

  const handleCreateCheckRCandidate = async () => {
    setCheckRCreateLoading(true);
    const { checkrData } = await checkCreateCandidate({ cognitoId: courier.cognitoId });
    setCheckRModal(false);
    setCheckRCreateLoading(false);
    courierStore.set('courier')({ ...courier, ...checkrData });
  };

  const toggleCheckRModal = () => {
    setCheckRModal(!checkRModal);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Back />
        <Typography className={styles.title}>Courier Details</Typography>
      </div>
    );
  };

  const renderCourierInfo = () => {
    return (
      <div className={styles.courierBlock}>
        {isLoading ? (
          <div className={styles.mainLoadingWrapper}>
            <Loading />
          </div>
        ) : (
          <>
            <TopBlock courier={courier} />
            <div>
              <AccordionWrapper
                onChangeAccordion={onChangeOnboardingInfoAccordion}
                expandedAccordion={openOnboardingInfo}
                label={'Onboarding Information'}
                renderAccordionDetails={() => (
                  <OnboardingInfo courier={courier} handleUpdateOnboard={handleUpdateOnboard} />
                )}
              />
              <AccordionWrapper
                onChangeAccordion={onChangePersonalInfoAccordion}
                expandedAccordion={openPersonalInfo}
                label={'Personal Information'}
                renderAccordionDetails={() => (
                  <PersonalInfo
                    courier={courier}
                    teams={teams}
                    setNewEmailModal={setNewEmailModal}
                    setNewPhoneModal={setNewPhoneModal}
                  />
                )}
              />
              <AccordionWrapper
                onChangeAccordion={onChangeVerificationInfoAccordion}
                expandedAccordion={openVerificationInfo}
                label={'Verification Information'}
                renderAccordionDetails={() => <VerificationInfo courier={courier} />}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    const checkRButton = (
      <Button
        className={styles.checkRButton}
        variant="outlined"
        color="secondary"
        // disabled={checkRCreateLoading}
        onClick={toggleCheckRModal}
      >
        <Typography>{!courier.checkrId ? 'Create CheckR Candidate' : 'Resend CheckR Link'}</Typography>
      </Button>
    );

    switch (courier.status) {
      case 'ACTIVE':
        return (
          <div className={classNames(styles.buttons)}>
            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('DECLINED')}
            >
              <Typography>Disable</Typography>
            </Button>

            {/*<Button*/}
            {/*  className={styles.increaseBalance}*/}
            {/*  variant="outlined"*/}
            {/*  color="secondary"*/}
            {/*  disabled={isRequestLoading}*/}
            {/*  onClick={() => setNewBalanceModal(true)}*/}
            {/*>*/}
            {/*  <Typography>Increase Courier Balance</Typography>*/}
            {/*</Button>*/}

            <Button
              className={styles.reAddToOnfleet}
              variant="outlined"
              color="secondary"
              disabled={isRequestLoading}
              onClick={handleReAddToOnfleet()}
            >
              <Typography>Re-add to Onfleet</Typography>
            </Button>

            {checkRButton}

            <IncreaseBalanceModal
              sendToBalance={handleAddBalance}
              isOpen={newBalanceModal}
              onClose={() => {
                setNewBalanceModal(false);
              }}
            />
          </div>
        );
      case 'DECLINED':
        return (
          <div className={classNames(styles.buttons, styles.oneButton)}>
            <Button
              className={classNames(styles.updateButton)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('ACTIVE')}
            >
              <Typography>Activate</Typography>
            </Button>

            {checkRButton}
          </div>
        );
      default:
        return (
          <div className={styles.buttons}>
            <Button
              className={classNames(styles.updateButton, styles.approve)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading /*|| courier.checkrStatus !== 'clear'*/}
              onClick={handleUpdateStatus('ACTIVE')}
            >
              <Typography>Approve</Typography>
            </Button>

            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('DECLINED')}
            >
              <Typography>Deny</Typography>
            </Button>
            {checkRButton}
          </div>
        );
    }
  };

  return (
    <div className={styles.courierInfoWrapper}>
      {renderHeaderBlock()}
      <div className={styles.content}>
        {renderCourierInfo()}
        {!isLoading && renderFooter()}
        {!isLoading && courier.status === 'ACTIVE' && (
          <>
            <CourierStatistic />
            <CourierLastDeliveries id={id} path={`/dashboard/couriers/${id}/deliveries`} />
            <Divider />
            <CourierLastBonuses
              id={id}
              path={`/dashboard/couriers/${id}/bonuses`}
              setNewBalanceModal={setNewBalanceModal}
            />
          </>
        )}
      </div>
      <ConfirmationModal
        title={'CheckR request'}
        subtitle={`Send checkR link to courier?`}
        isOpen={checkRModal}
        handleModal={toggleCheckRModal}
        loading={checkRCreateLoading}
        onConfirm={handleCreateCheckRCandidate}
      />

      {newEmailModal && (
        <ChangeEmailModal
          defaultValue={courier.email}
          setNewEmail={handleSetNewEmail}
          onClose={() => {
            setNewEmailModal(false);
          }}
        />
      )}
      {newPhoneModal && (
        <ChangePhoneModal
          defaultValue={courier.phone_number}
          setNewPhone={handleSetNewPhone}
          onClose={() => {
            setNewPhoneModal(false);
          }}
        />
      )}
    </div>
  );
};
