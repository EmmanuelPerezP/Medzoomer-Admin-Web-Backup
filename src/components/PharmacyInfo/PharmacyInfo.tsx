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
import useBillingManagement from '../../hooks/useBillingManagement';
import classNames from 'classnames';
import TextField from '../common/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

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

  const [isUpdate, setIsUpdate] = useState(history.location.search.indexOf('edit') >= 0);
  const [groups, setGroups] = useState([]);
  const [groupsById, setActiveGroups] = useState({});
  const [showMore, setShowMore] = useState(false);
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
      let tempGroups = {};
      // eslint-disable-next-line
      data.map((item: any) => {
        tempGroups = { ...tempGroups, [item._id]: item };
        listGroups.push({
          value: item._id,
          label: item.name
        });
      });

      setActiveGroups(tempGroups);

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

  const handlerInputGeneralBlock = (field: string, value: any) => {
    pharmacyStore.set('pharmacy')({
      ...pharmacy,
      [field]: value
    });
  };

  const handlerSaveGeneralData = async () => {
    setIsLoading(true);
    await updatePharmacy(id, {
      ...pharmacy,
      address: pharmacy.roughAddress
    });
    setUpdatePharmacy();
    setIsLoading(false);
  };

  const handlerResetGeneralData = async () => {
    setIsLoading(true);

    pharmacyStore.set('pharmacy')({
      ...pharmacy,
      address: pharmacy.roughAddress,
      pricePerDelivery: '',
      volumeOfferPerMonth: '',
      volumePrice: ''
    });

    await updatePharmacy(id, {
      ...pharmacy,
      address: pharmacy.roughAddress
    });
    setUpdatePharmacy();
    setIsLoading(false);
  };

  const handlerSetStatus = async (status: string) => {
    pharmacy.status = status;
    await updatePharmacy(id, {
      ...pharmacy,
      address: pharmacy.roughAddress
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
        <div className={styles.imgBlock}>
          <Image
            isPreview={true}
            cognitoId={sub}
            className={styles.preview}
            src={pharmacy.preview}
            alt={'No Preview'}
          />
        </div>
        <div>
          <Typography className={styles.blockTitleMainInfo}>{pharmacy.name}</Typography>
        </div>
        <div>
          <Typography className={styles.blockAddressMainInfo}>
            {`${pharmacy.address.street} ${pharmacy.address.number}, ${pharmacy.address.state}`}
          </Typography>
        </div>
        <div>
          <div className={styles.status}>
            <span
              className={classNames(styles.statusColor, {
                [styles.verified]: pharmacy.status === PHARMACY_STATUS.VERIFIED,
                [styles.declined]: pharmacy.status === PHARMACY_STATUS.DECLINED,
                [styles.pending]: pharmacy.status === PHARMACY_STATUS.PENDING
              })}
            />
            {pharmacy.status ? `${pharmacy.status.charAt(0).toUpperCase()}${pharmacy.status.slice(1)}` : 'Pending'}
          </div>
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

  const renderShowMoreBlock = () => {
    return (
      <div
        className={styles.moreBlock}
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        <Typography className={styles.blockTitle}>
          {showMore ? 'Hidden Pharmacy Information' : 'Show Pharmacy Information'}
        </Typography>
      </div>
    );
  };

  const renderGroupBillingBlock = () => {
    // @ts-ignore
    const groupInfo: any = groupsById && groupsById[pharmacy.group] ? groupsById[pharmacy.group] : null;
    return (
      <div className={styles.lastBlock}>
        <div className={styles.resetGroupData} onClick={handlerResetGeneralData}>
          {'Reset to group settings'}
        </div>
        <div className={styles.mainInfo}>
          <div className={styles.managerBlock}>
            <Typography className={styles.blockTitle}>General Settings</Typography>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <Select
                  label={'Group'}
                  value={pharmacy.group || 0}
                  onChange={(e: any) => {
                    handlerInputGeneralBlock('group', e.target.value);
                  }}
                  items={groups}
                  classes={{ input: styles.input, inputRoot: styles.inputRoot }}
                  className={styles.periodSelect}
                />
              </div>
              <div className={styles.textField}>
                <Select
                  label={'Billing Accounts'}
                  value={pharmacy.billingAccount || 0}
                  onChange={(e: any) => {
                    handlerInputGeneralBlock('billingAccount', e.target.value);
                  }}
                  items={billingAccount}
                  classes={{ input: styles.input, inputRoot: styles.inputRoot }}
                  className={styles.periodSelect}
                />
              </div>
            </div>
          </div>
          <div className={styles.nextBlock}>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <Typography className={styles.blockTitle}>Default Price per Delivery</Typography>
                <TextField
                  label={'Price'}
                  classes={{
                    root: classNames(styles.textField, styles.priceInput)
                  }}
                  inputProps={{
                    placeholder: `${groupInfo && groupInfo.pricePerDelivery ? groupInfo.pricePerDelivery : '0.00'}`,
                    type: 'number',
                    endAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  value={pharmacy.pricePerDelivery}
                  onChange={(e: any) => {
                    handlerInputGeneralBlock('pricePerDelivery', e.target.value);
                  }}
                />
                {/*{err.pricePerDelivery ? <Error className={styles.error} value={err.pricePerDelivery} /> : null}*/}
              </div>
              <div className={styles.nextBlock}>
                <Typography className={styles.blockTitle}>Volume Price per Delivery</Typography>
                <div className={styles.twoInput}>
                  <div className={styles.textField}>
                    <TextField
                      label={'Offers per month'}
                      classes={{
                        root: classNames(styles.textField, styles.priceInput)
                      }}
                      inputProps={{
                        placeholder: `${
                          groupInfo && groupInfo.volumeOfferPerMonth ? groupInfo.volumeOfferPerMonth : '0.00'
                        }`,
                        endAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      value={pharmacy.volumeOfferPerMonth}
                      onChange={(e: any) => {
                        handlerInputGeneralBlock('volumeOfferPerMonth', e.target.value);
                      }}
                    />
                    {/*{err.volumeOfferPerMonth ? (*/}
                    {/*  <Error className={styles.error} value={err.volumeOfferPerMonth} />*/}
                    {/*) : null}*/}
                  </div>
                  <div className={styles.textField}>
                    <TextField
                      label={'Price'}
                      classes={{
                        root: classNames(styles.textField, styles.priceInput)
                      }}
                      inputProps={{
                        placeholder: `${groupInfo && groupInfo.volumePrice ? groupInfo.volumePrice : '0.00'}`,
                        endAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      value={pharmacy.volumePrice}
                      onChange={(e: any) => {
                        handlerInputGeneralBlock('volumePrice', e.target.value);
                      }}
                    />
                    {/*{err.volumePrice ? <Error className={styles.error} value={err.volumePrice} /> : null}*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!pharmacy.status || pharmacy.status !== PHARMACY_STATUS.PENDING ? (
            <div className={styles.nextBlock}>
              <Button
                className={styles.saveGeneralSettingsBtn}
                variant="contained"
                onClick={() => {
                  handlerSaveGeneralData().catch();
                }}
              >
                <Typography className={styles.summaryText}>Save</Typography>
              </Button>
            </div>
          ) : null}
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
    if (pharmacy.status === PHARMACY_STATUS.PENDING) {
      return (
        <>
          <div className={styles.infoBlock}>
            <div className={styles.titleWrapper}>
              <SVGIcon onClick={handleSetUpdate} className={styles.editIcon} name={'edit'} />
            </div>
            {renderViewBasicInfo()}

            {renderViewWorkingHours()}
            {renderViewManagerInfo()}
            {renderViewSignedBlock()}

            {renderGroupBillingBlock()}
            {renderApproveBlock()}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.infoBlock}>
            <div className={styles.titleWrapper}>
              <SVGIcon onClick={handleSetUpdate} className={styles.editIcon} name={'edit'} />
            </div>
            {renderViewBasicInfo()}
            {showMore ? (
              <>
                {renderViewWorkingHours()}
                {renderViewManagerInfo()}
                {renderViewSignedBlock()}
              </>
            ) : null}
            {renderShowMoreBlock()}
            {renderApproveBlock()}
          </div>
          {renderGroupBillingBlock()}
        </>
      );
    }
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
