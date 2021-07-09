import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import _ from 'lodash';
import { useRouteMatch, useHistory } from 'react-router';
import classNames from 'classnames';
import { isPharmacyIndependent } from '../../helper/isPharmacyIndependent';
import { isValidPharmacy } from '../../helper/validate';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { prepareScheduleDay, prepareScheduleUpdate, decodeErrors, getAddressString, getDateFromTimezone } from '../../../../utils';
import usePharmacy from '../../../../hooks/usePharmacy';
import useUser from '../../../../hooks/useUser';
import useGroups from '../../../../hooks/useGroup';
import { useStores } from '../../../../store';
import { days, PHARMACY_STATUS } from '../../../../constants';

import PharmacyInputs from '../PharmacyInputs';
import PharmacyUsers from './components/PharmacyUsers';
import PharmacyReports from './components/PharmacyReports';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import Image from '../../../common/Image';
import Back from '../../../common/Back';
// import TextField from '../../../common/TextField';
// import Select from '../../../common/Select';
import AutoCompleteSearch from '../../../common/AutoCompleteSearch';

import styles from './PharmacyInfo.module.sass';
import AddFeeModal from './components/AddFeeModal';
import ReturnCashConfiguration from './components/ReturnCashConfiguration';

let timerId: any = null;
export const PharmacyInfo: FC = () => {
  const {
    params: { id }
  }: any = useRouteMatch();
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
    updatePharmacy,
    addGroupToPharmacy,
    removeGroupFromPharmacy,
    sendAdditionalPharmacyFee
  } = usePharmacy();
  const { getGroups, getGroupsInPharmacy } = useGroups();

  const [isUpdate, setIsUpdate] = useState(history.location.search.indexOf('edit') >= 0);
  const [groups, setGroups] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [agreement, setAgreement] = useState({ link: '', isLoading: false });
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [newFeeModal, setNewFeeModal] = useState<boolean>(false);
  const [rcEnable, setRcEnable] = useState<boolean>(false);
  const [rcFlatFeeForCourier, setRcFlatFeeForCourier] = useState<number>(0);
  const [rcFlatFeeForPharmacy, setRcFlatFeeForPharmacy] = useState<number>(0);
  const isIndependentPharmacy = isPharmacyIndependent(pharmacy);

  const user = useUser();

  const [err, setErr] = useState({
    name: '',
    price: '',
    roughAddress: '',
    longitude: '',
    latitude: '',
    preview: '',
    agreement: '',
    managerName: '',
    email: '',
    phone_number: '',
    global: ''
  });

  const getPharmacyById = useCallback(
    async (withLoader = true) => {
      // setIsLoading(true);
      if (sub) {
        try {
          const { data } = await getPharmacy(id);

          pharmacyStore.set('pharmacy')({
            ...data,
            agreement: { ...data.agreement, fileKey: data.agreement.link }
          });
          withLoader && setIsLoading(false);
        } catch (err) {
          console.error(err);
          withLoader && setIsLoading(false);
        }
      }
    },
    // eslint-disable-next-line
    [getPharmacy, pharmacyStore, id, sub, isUpdate, pharmacy.schedule, setEmptySchedule, setUpdatePharmacy]
  );

  useEffect(() => {
    getPharmacyById().catch();
    handleGetPharmacyInGroup().catch((r) => r);
    // eslint-disable-next-line
  }, [sub]);

  useEffect(() => {
    if (isUpdate) {
      if (Object.keys(pharmacy.schedule).some((d) => !!pharmacy.schedule[d].open)) {
        prepareScheduleUpdate(pharmacy.schedule, 'wholeWeek');
        days.forEach((day) => {
          prepareScheduleUpdate(pharmacy.schedule, day.value);
        });
        setUpdatePharmacy();
      } else {
        setEmptySchedule();
      }
    }

    setRcEnable(pharmacy.rcEnable);
    setRcFlatFeeForCourier(pharmacy.rcFlatFeeForCourier || 0);
    setRcFlatFeeForPharmacy(pharmacy.rcFlatFeeForPharmacy || 0);
    // eslint-disable-next-line
  }, [pharmacy]);

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
      if (!isValidPharmacy(newPharmacy, err, setErr)) {
        setIsRequestLoading(false);
        return false;
      }
      const { schedule, hellosign, affiliation, ...pharmacyData } = newPharmacy;
      if (!schedule.wholeWeek.isClosed) {
        days.forEach((day) => {
          schedule[day.value].isClosed = true;
        });
      }
      const newSchedule = JSON.parse(JSON.stringify(schedule));
      let _affiliation;

      if (hellosign && hellosign.isAgreementSigned) {
        _affiliation = 'independent';
      } else if (!hellosign && !affiliation) {
        _affiliation = 'group';
      }
      if (Object.keys(newSchedule).some((d) => !!newSchedule[d].open.hour)) {
        prepareScheduleDay(newSchedule, 'wholeWeek');
        days.forEach((day) => {
          prepareScheduleDay(newSchedule, day.value);
        });
        await updatePharmacy(id, {
          ...pharmacyData,
          agreement: { link: pharmacyData.agreement.fileKey, name: pharmacyData.agreement.name },
          schedule: newSchedule,
          affiliation: !affiliation ? _affiliation : affiliation
        });
      } else {
        await updatePharmacy(id, {
          ...pharmacyData,
          agreement: { link: pharmacyData.agreement.fileKey, name: pharmacyData.agreement.name },
          affiliation: !affiliation ? _affiliation : affiliation
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

  // const handlerInputGeneralBlock = (field: string, value: any) => {
  //   switch (field) {
  //     case 'pricePerDelivery':
  //     case 'volumeOfferPerMonth':
  //     case 'volumePrice':
  //       if (value >= 0) pharmacyStore.set('pharmacy')({ ...pharmacy, [field]: value });
  //       break;
  //     default:
  //       pharmacyStore.set('pharmacy')({
  //         ...pharmacy,
  //         [field]: value
  //       });
  //       break;
  //   }
  // };

  // const handlerSaveGeneralData = async () => {
  //   setIsLoading(true);
  //   await updatePharmacy(id, {
  //     ...pharmacy
  //   });
  //   setUpdatePharmacy();
  //   setIsLoading(false);
  //   history.push('/dashboard/pharmacies');
  // };

  // const handlerResetGeneralData = async () => {
  //   setIsLoading(true);
  //
  //   pharmacyStore.set('pharmacy')({
  //     ...pharmacy,
  //     pricePerDelivery: '',
  //     volumeOfferPerMonth: '',
  //     volumePrice: ''
  //   });
  //
  //   await updatePharmacy(id, {
  //     ...pharmacy
  //   });
  //   setUpdatePharmacy();
  //   setIsLoading(false);
  // };

  const handlerSetStatus = (status: string) => async () => {
    await updatePharmacy(id, {
      ...pharmacy,
      roughAddressObj: { ...pharmacy.address },
      status
    });
    setUpdatePharmacy();
    history.push('/dashboard/pharmacies');
  };

  const handleGetPharmacyInGroup = async () => {
    const pharmacyInGroup = await getGroupsInPharmacy(id);
    pharmacyInGroup.data ? setSelectedGroups(pharmacyInGroup.data) : setSelectedGroups([]);
  };

  const handleRemoveGroup = async (groupData: any) => {
    await removeGroupFromPharmacy(id, groupData._id);
    setGroups([]);
    await handleGetPharmacyInGroup();
  };

  const handleAddGroup = async (groupData: any) => {
    setIsOptionLoading(true);
    await addGroupToPharmacy(id, groupData._id);
    setGroups([]);
    setIsOptionLoading(false);
    await handleGetPharmacyInGroup();
  };

  const handleSendFee = async (amount: number) => {
    try {
      await sendAdditionalPharmacyFee(id, amount);
    } catch (e) {
      console.error('handleSendFee', { e });
    }
  };

  const feeModalActions = useMemo(
    () => ({
      show: () => setNewFeeModal(true),
      hide: () => setNewFeeModal(false)
    }),
    [setNewFeeModal]
  );

  const renderHeaderBlock = () => {
    return (
      <>
        <div className={styles.header}>
          <Back onClick={resetPharmacy} />
          <Typography className={styles.title}>Pharmacy Details</Typography>
          {/* <Button color="primary" variant={'contained'} onClick={feeModalActions.show} className={styles.addFeeButton}>
            &nbsp;Send&nbsp;Fee&nbsp;
          </Button> */}
        </div>
        <AddFeeModal setNewFee={handleSendFee} isOpen={newFeeModal} onClose={feeModalActions.hide} />
      </>
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
          <Typography className={styles.blockAddressMainInfo}>{getAddressString(pharmacy.address)}</Typography>
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
        {pharmacy.dayPlannedDeliveryCount && (
          <div className={styles.deliveryCount}>{pharmacy.dayPlannedDeliveryCount} deliveries/day</div>
        )}
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
                      `${getDateFromTimezone(pharmacy.schedule[day.value].open, user, 'h:mm A')} -
                        ${getDateFromTimezone(pharmacy.schedule[day.value].close, user, 'h:mm A')}`
                    )}
              </>
            );
          })
        ) : (
          <>
            {renderSummaryItem('Opens', `${getDateFromTimezone(pharmacy.schedule.wholeWeek.open, user, 'h:mm A')}`)}
            {renderSummaryItem('Close', `${getDateFromTimezone(pharmacy.schedule.wholeWeek.close, user, 'h:mm A')}`)}
          </>
        )}
      </div>
    );
  };

  const renderViewManagerInfo = () => {
    return (
      <div className={styles.managerBlock}>
        <div className={styles.titleBlock}>
          <Typography className={styles.blockTitle}>Pharmacy Contacts</Typography>
        </div>
        {renderSummaryItem('Manager Full Name', pharmacy.managerName)}
        {renderSummaryItem('Manager Contact Email', pharmacy.email)}
        {renderSummaryItem('Pharmacy Phone Number', pharmacy.phone_number)}
        {pharmacy.managerPhoneNumber && renderSummaryItem('Manager Phone Number', pharmacy.managerPhoneNumber)}
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

  const handleFocus = () => {
    getGroupsList('').catch();
  };

  const handleSearchGroup = (e: any) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const value: any = e.target.value;
    timerId = setTimeout(() => {
      getGroupsList(value).catch();
    }, 500);
  };

  const getGroupsList = useCallback(
    async (search) => {
      setIsOptionLoading(true);
      try {
        const { data } = await getGroups({ page: 0, perPage: 10, search });
        setGroups(data);
        setIsOptionLoading(false);
      } catch (err) {
        console.error(err);
        setIsOptionLoading(false);
      }
    },
    [getGroups]
  );

  const renderGroupsBlock = () => {
    return (
      <div className={styles.groups}>
        <Typography className={styles.blockTitle}>Added Groups</Typography>
        <AutoCompleteSearch placeholder={'Add Group'} onFocus={handleFocus} onChange={handleSearchGroup} />
        <div className={styles.options}>
          {isOptionLoading ? (
            <Loading className={styles.loadGroupBlock} />
          ) : groups && groups.length === 0 ? null : (
            groups.map((row: any) => {
              const { _id, name } = row;
              if (_.find(selectedGroups, { _id })) {
                return null;
              }
              return (
                <div key={_id} className={styles.optionItem}>
                  <div className={styles.infoWrapper}>
                    <div className={styles.info}>
                      <Typography className={styles.title}>{name}</Typography>
                    </div>
                  </div>
                  <SVGIcon className={styles.closeIcon} name="plus" onClick={() => handleAddGroup(row).catch()} />
                </div>
              );
            })
          )}
        </div>
        {selectedGroups && selectedGroups.length > 0
          ? selectedGroups.map((row: any) => {
              const { _id, name } = row;
              return (
                <div key={_id} className={styles.groupItem}>
                  <div className={styles.infoWrapper}>
                    <div className={styles.info}>
                      <Typography className={styles.title}> {name}</Typography>
                    </div>
                  </div>
                  <SVGIcon className={styles.closeIcon} name="close" onClick={() => handleRemoveGroup(row).catch()} />
                </div>
              );
            })
          : null}
      </div>
    );
  };

  const renderReturnCashCongifurationBlock = () => (
    <ReturnCashConfiguration
      {...{
        rcEnable,
        rcFlatFeeForCourier,
        rcFlatFeeForPharmacy
      }}
      id={id}
      onChangeRcEnable={setRcEnable}
      onChangeRcFlatFeeForCourier={setRcFlatFeeForCourier}
      onChangeRcFlatFeeForPharmacy={setRcFlatFeeForPharmacy}
    />
  );

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
            onClick={handlerSetStatus(PHARMACY_STATUS.DECLINED)}
          >
            <Typography className={styles.summaryText}>Disable</Typography>
          </Button>
        ) : null}
        {!pharmacy.status ||
        pharmacy.status === PHARMACY_STATUS.PENDING ||
        pharmacy.status === PHARMACY_STATUS.DECLINED ? (
          <Button
            className={styles.approveVtn}
            variant="contained"
            onClick={handlerSetStatus(PHARMACY_STATUS.VERIFIED)}
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
            {/*{renderViewSignedBlock()}*/}
            {!isIndependentPharmacy && renderGroupsBlock()}
            {renderReturnCashCongifurationBlock()}
            {/* {renderGroupBillingBlock()} */}
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
                {/*{renderViewSignedBlock()}*/}
              </>
            ) : null}
            {renderShowMoreBlock()}
            {renderApproveBlock()}
          </div>
          {!isIndependentPharmacy && renderGroupsBlock()}
          {renderReturnCashCongifurationBlock()}
          {/* {renderGroupBillingBlock()} */}
          <PharmacyUsers getPharmacyById={getPharmacyById} />
          <PharmacyReports pharmacyId={id} />
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
              {isUpdate ? <PharmacyInputs key="test-key" err={err} setError={setErr} /> : renderInfo()}
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
