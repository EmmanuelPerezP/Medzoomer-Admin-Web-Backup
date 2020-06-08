import React, { FC, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { prepareScheduleDay, prepareScheduleUpdate, decodeErrors } from '../../utils';
import usePharmacy from '../../hooks/usePharmacy';
import useUser from '../../hooks/useUser';
import { useStores } from '../../store';
import { days, PHARMACY_STATUS } from '../../constants';

import PharmacyInputs from '../PharmacyInputs';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Image from '../common/Image';

import styles from './PharmacyInfo.module.sass';
import Select from '../common/Select';
import useGroups from '../../hooks/useGroup';
import useBillingManagement from "../../hooks/useBillingManagement";

export const PharmacyInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { pharmacyStore } = useStores();
  const { getFileLink, sub } = useUser();
  const {
    pharmacy,
    newPharmacy,
    getPharmacy,
    setUpdatePharmacy,
    setEmptySchedule,
    resetPharmacy,
    updatePharmacy
  } = usePharmacy();
  const { getAllGroups } = useGroups();
  const { getAllBilling } = useBillingManagement();

  const [isUpdate, setIsUpdate] = useState(false);
  const [groups, setGroups] = useState([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agreement, setAgreement] = useState({ link: '', isLoading: false });
  const [isRequestLoading, setIsRequestLoading] = useState(false);

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
    phone_number: '',
    global: ''
  });

  const getPharmacyById = useCallback(async () => {
    if (sub) {
      try {
        const { data } = await getPharmacy(id);
        pharmacyStore.set('pharmacy')({
          ...data,
          agreement: { ...data.agreement, fileKey: data.agreement.link }
        });
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    }
  }, [getPharmacy, pharmacyStore, id, sub]);

  const getListGroups = useCallback(async () => {
    try {
      const { data } = await getAllGroups();
      const listGroups: any = [];
      listGroups.push({
        value: 0,
        label: 'Not Selected'
      });
      // eslint-disable-next-line
      data.map((item: any) => {
        listGroups.push({
          value: item._id,
          label: item.name
        });
      });
      setGroups(listGroups);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [getAllGroups, id]);

  const getBillingAccount = useCallback(async () => {
    try {
      const { data } = await getAllBilling();
      const listBillingAccouns: any = [];
      listBillingAccouns.push({
        value: 0,
        label: 'Not Selected'
      });
      // eslint-disable-next-line
      data.map((item: any) => {
        listBillingAccouns.push({
          value: item._id,
          label: item.name
        });
      });
      setBillingAccount(listBillingAccouns);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    getPharmacyById().catch();
    getListGroups().catch();
    getBillingAccount().catch();
    // eslint-disable-next-line
  }, [sub]);

  const handleGetFileLink = (fileId: string) => async () => {
    try {
      setAgreement({ ...agreement, isLoading: true });
      if (agreement.link) {
        setAgreement({ ...agreement, isLoading: false });
        (window.open(agreement.link, '_blank') as any).focus();
      } else {
        const { link } = await getFileLink(sub, fileId);
        setAgreement({ ...agreement, link, isLoading: false });
        (window.open(link, '_blank') as any).focus();
      }
    } catch (error) {
      setAgreement({ ...agreement, isLoading: false });
      console.error(error);
    }
  };

  const handleUpdatePharmacy = async () => {
    try {
      setIsRequestLoading(true);
      const { schedule, ...pharmacyData } = newPharmacy;

      if (Object.keys(schedule).some((d) => !!schedule[d].open.hour)) {
        prepareScheduleDay(newPharmacy.schedule, 'wholeWeek');
        days.forEach((day) => {
          prepareScheduleDay(newPharmacy.schedule, day.value);
        });
        await updatePharmacy(id, {
          ...pharmacyData,
          agreement: { link: pharmacyData.agreement.fileKey, name: pharmacyData.agreement.name },
          schedule
        });
      } else {
        await updatePharmacy(id, {
          ...pharmacyData,
          agreement: { link: pharmacyData.agreement.fileKey, name: pharmacyData.agreement.name }
        });
      }

      resetPharmacy();
      setIsRequestLoading(false);
      history.push('/dashboard/pharmacies');
    } catch (error) {
      const errors = error.response.data;
      if (errors.message !== 'validation error') {
        setErr({ ...err, global: errors.message });
      } else {
        if (errors.message === 'Phone number is not valid') {
          setErr({ ...err, phone_number: 'Phone number is not valid' });
        }
        setErr({ ...err, ...decodeErrors(errors.details) });
      }

      setIsRequestLoading(false);
    }
  };

  const handleSetUpdate = () => {
    if (Object.keys(pharmacy.schedule).some((d) => !!pharmacy.schedule[d].open)) {
      prepareScheduleUpdate(pharmacy.schedule, 'wholeWeek');
      days.forEach((day) => {
        prepareScheduleUpdate(pharmacy.schedule, day.value);
      });
      setUpdatePharmacy();
    } else {
      setEmptySchedule();
    }

    setIsUpdate(true);
  };

  const handlerSetGroupForP = async (e: any) => {
    const idGroup = e.target.value;
    pharmacy.group = idGroup;

    await updatePharmacy(id, {
      ...pharmacy
    });
    setUpdatePharmacy();
  };

  const handlerSetBillingAccountForP = async (e: any) => {
    const idBillingAccount = e.target.value;
    pharmacy.billingAccount = idBillingAccount;

    await updatePharmacy(id, {
      ...pharmacy
    });
    setUpdatePharmacy();
  };

  const handlerSetStatus = async (status:string) => {
    pharmacy.status = status;
    await updatePharmacy(id, {
      ...pharmacy
    });
    setUpdatePharmacy();
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link className={styles.link} to={'/dashboard/pharmacies'}>
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
        {renderSummaryItem(
          'Address',
          `${pharmacy.address.street} ${pharmacy.address.number}, ${pharmacy.address.state}`
        )}
        {renderSummaryItem('Per-Prescription Price', pharmacy.price)}
        {pharmacy.preview ? (
          <div className={styles.previewPhoto}>
            <Typography className={styles.field}>Preview Photo</Typography>
            <Image
              isPreview={true}
              cognitoId={sub}
              className={styles.preview}
              src={pharmacy.preview}
              alt={'No Preview'}
            />
          </div>
        ) : null}
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
                        ${moment(pharmacy.schedule[day.value].close).format('h:mm A')}`
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

  const renderGroupBillingBlock = () => {
    return (
      <div className={styles.lastBlock}>
        <div className={styles.twoInput}>
          <div className={styles.textField}>
            <Select
              label={'Group'}
              value={pharmacy.group || 0}
              onChange={handlerSetGroupForP}
              items={groups}
              classes={{ input: styles.input, selectLabel: styles.blockTitle, inputRoot: styles.inputRoot }}
              className={styles.periodSelect}
            />
          </div>
          <div className={styles.textField}>
            <Select
              label={'Billing Accounts'}
              value={pharmacy.billingAccount || 0}
              onChange={handlerSetBillingAccountForP}
              items={billingAccount}
              classes={{ input: styles.input, selectLabel: styles.blockTitle, inputRoot: styles.inputRoot }}
              className={styles.periodSelect}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderApproveBlock = () => {
    return (
      <div className={styles.btnBlock}>
        {!pharmacy.status ||
        pharmacy.status === PHARMACY_STATUS.PENDING ||
        pharmacy.status === PHARMACY_STATUS.VERIFIED ? (
          <Button
            className={styles.denyBtn}
            variant="contained"
            color="primary"
            onClick={() => {
              handlerSetStatus(PHARMACY_STATUS.DECLINED).catch();
            }}
          >
            <Typography className={styles.summaryText}>Deny</Typography>
          </Button>
        ) : null}
        {!pharmacy.status ||
        pharmacy.status === PHARMACY_STATUS.PENDING ||
        pharmacy.status === PHARMACY_STATUS.DECLINED ? (
          <Button
            className={styles.approveVtn}
            variant="contained"
            onClick={() => {
              handlerSetStatus(PHARMACY_STATUS.VERIFIED).catch();
            }}
          >
            <Typography className={styles.summaryText}>Approve</Typography>
          </Button>
        ) : null}
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
        {renderGroupBillingBlock()}
        {renderApproveBlock()}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <Button
          className={styles.changeStepButton}
          variant="contained"
          disabled={isRequestLoading}
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
        {name === 'Uploaded File' ? (
          <div onClick={handleGetFileLink(pharmacy.agreement.fileKey)} className={styles.document}>
            {agreement.isLoading ? <Loading className={styles.fileLoader} /> : value}
          </div>
        ) : (
          <Typography>{value}</Typography>
        )}
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
