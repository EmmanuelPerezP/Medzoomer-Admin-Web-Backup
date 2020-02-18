import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { decodeErrors, prepareScheduleDay, prepareScheduleUpdate } from '../../utils';
import usePharmacy from '../../hooks/usePharmacy';
import { useStores } from '../../store';
import { days } from '../../constants';

import PharmacyInputs from '../PharmacyInputs';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './PharmacyInfo.module.sass';

export const PharmacyInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { pharmacyStore } = useStores();
  const { pharmacy, newPharmacy, getPharmacy, setUpdatePharmacy, resetPharmacy, updatePharmacy } = usePharmacy();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    getPharmacyById().catch();
  }, []);

  const getPharmacyById = async () => {
    setIsLoading(true);
    const courierInfo = await getPharmacy(id);
    pharmacyStore.set('pharmacy')(courierInfo.data);
    setIsLoading(false);
  };

  const handleUpdatePharmacy = async () => {
    prepareScheduleDay(newPharmacy.schedule, 'wholeWeek');
    days.map((day) => {
      prepareScheduleDay(newPharmacy.schedule, day.value);
    });

    await updatePharmacy(id, newPharmacy);
    resetPharmacy();
    history.push('/dashboard/pharmacies');
  };

  const handleSetUpdate = () => {
    prepareScheduleUpdate(pharmacy.schedule, 'wholeWeek');
    days.map((day) => {
      prepareScheduleUpdate(pharmacy.schedule, day.value);
    });
    setUpdatePharmacy();
    setIsUpdate(true);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link className={styles.link} href={'/dashboard/pharmacies'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>Pharmacy Details</Typography>
      </div>
    );
  };

  const renderViewBasicInfo = () => {
    return (
      <div className={styles.basicInfo}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Basic Information</Typography>
        </div>
        {renderSummaryItem('Address', pharmacy.address)}
        {renderSummaryItem('Per-Prescription Price', pharmacy.price)}
        <div className={styles.previewPhoto}>
          <Typography className={styles.field}>Preview Photo</Typography>
          <img style={{ maxWidth: '328px', maxHeight: '200px' }} src={pharmacy.preview} alt="No Image" />
        </div>
      </div>
    );
  };

  const renderViewWorkingHours = () => {
    return (
      <div className={styles.hoursBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Working Hours</Typography>
        </div>
        {pharmacy.schedule.wholeWeek.isClosed ? (
          days.map((day) => {
            return (
              <>
                {pharmacy.schedule[day.value].isClosed
                  ? renderSummaryItem(day.label, `Day Off`)
                  : renderSummaryItem(
                      day.label,
                      `${moment(pharmacy.schedule[day.value].open).format('h:mm A')} - 
                        ${moment(pharmacy.schedule[day.value].open).format('h:mm A')}`
                    )}
              </>
            );
          })
        ) : (
          <>
            {renderSummaryItem('Opens', `${moment(pharmacy.schedule.wholeWeek.open).format('h:mm A')}`)}
            {renderSummaryItem('Close', `${moment(pharmacy.schedule.wholeWeek.close).format('h:mm A')}`)}
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
        </div>
        {renderSummaryItem('Full Name', pharmacy.managerName)}
        {renderSummaryItem('Contact Email', pharmacy.email)}
        {renderSummaryItem('Contact Phone Number', pharmacy.phone_number)}
      </div>
    );
  };

  const renderViewSignedBlock = () => {
    return (
      <div className={styles.signedBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Signed Agreement</Typography>
        </div>
        {renderSummaryItem('Uploaded File', pharmacy.agreement.name)}
      </div>
    );
  };

  const renderInfo = () => {
    return (
      <>
        <div className={styles.titleWrapper}>
          <Typography className={styles.summaryTitle}>{pharmacy.name}</Typography>
          <SVGIcon onClick={handleSetUpdate} className={styles.editIcon} name={'edit'} />
        </div>
        {renderViewBasicInfo()}
        {renderViewWorkingHours()}
        {renderViewManagerInfo()}
        {renderViewSignedBlock()}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <Button
          className={styles.changeStepButton}
          variant="contained"
          color="secondary"
          onClick={handleUpdatePharmacy}
        >
          <Typography className={styles.summaryText}>Update</Typography>
        </Button>
      </div>
    );
  };

  const renderPharmacyInfo = () => {
    return (
      <div className={styles.pharmacyBlock}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={styles.mainInfo}>
              {isUpdate ? <PharmacyInputs err={err} setError={setErr} /> : renderInfo()}
            </div>
            {isUpdate ? renderFooter() : null}
          </>
        )}
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

  return (
    <div className={styles.pharmacyWrapper}>
      {renderHeaderBlock()}
      {renderPharmacyInfo()}
    </div>
  );
};
