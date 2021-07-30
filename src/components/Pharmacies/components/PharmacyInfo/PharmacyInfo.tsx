import React, { FC, useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { useRouteMatch, useHistory } from 'react-router';
import { isPharmacyIndependent } from '../../helper/isPharmacyIndependent';
import { isValidPharmacy } from '../../helper/validate';
import { Typography, Button } from '@material-ui/core';
import {
  prepareScheduleDay,
  prepareScheduleUpdate,
  decodeErrors,
  checkIsOpen24h7d,
  changeOpen24h7d,
  setTimeFromOldLogic
} from '../../../../utils';
import usePharmacy from '../../../../hooks/usePharmacy';
import useUser from '../../../../hooks/useUser';
import useGroups from '../../../../hooks/useGroup';
import { useStores } from '../../../../store';
import { days, PHARMACY_STATUS } from '../../../../constants';
import PharmacyUsers from './components/PharmacyUsers';
import PharmacyReports from './components/PharmacyReports';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import AutoCompleteSearch from '../../../common/AutoCompleteSearch';
import styles from './PharmacyInfo.module.sass';
import AccordionWrapper from './components/Accordion/AccordionWrapper';
import TopBlock from './components/TopBlock/TopBlock';
import GeneralInfo from './components/GeneralInfo/GeneralInfo';
import AdditionalInfo from './components/AdditionalInfo/AdditionalInfo';
import PharmacySettingsInfo from './components/PharmacySettingsInfo/PharmacySettingsInfo';
import EditGeneralInfo from './components/EditGeneralInfo/EditGeneralInfo';
import EditAdditionalInfo from './components/EditAdditionalInfo/EditAdditionalInfo';
import EditPharmacySettings from './components/EditPharmacySettings/EditPharmacySettings';
import PharmacyInfoHeader from './components/PharmacyInfoHeader/PharmacyInfoHeader';
import PharmacyInfoFooter from './components/PharmacyInfoFooter/PharmacyInfoFooter';
// import TextField from '../../../common/TextField';
// import Select from '../../../common/Select';

let timerId: any = null;

const emtyPharmacyErr = {
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
  global: '',
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
    removeGroupFromPharmacy
  } = usePharmacy();
  const { getGroups, getGroupsInPharmacy } = useGroups();
  const [isUpdate, setIsUpdate] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [agreement, setAgreement] = useState({ link: '', isLoading: false });
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const isIndependentPharmacy = isPharmacyIndependent(pharmacy);
  const [err, setErr] = useState({ ...emtyPharmacyErr });
  const [isOpen24h7d, setIsOpen24h7d] = useState(false);
  const [infoType, setInfoType] = useState('');
  const [openBasicInfo, setOpenBasicInfo] = useState(false);
  const [openAdditionalInfo, setOpenAdditionalInfo] = useState(false);
  const [openPharmacySettingsInfo, setPharmacySettingsInfo] = useState(false);

  const getPharmacyById = useCallback(
    async (withLoader = true) => {
      // setIsLoading(true);
      if (sub) {
        try {
          const { data } = await getPharmacy(id);
          let pharmacyData = { ...data };
          const oldData = infoFromOldFields(pharmacyData);

          if (oldData.addOldData) {
            pharmacyData = {
              ...data,
              managers: oldData.managers
            };
          }

          pharmacyStore.set('pharmacy')({
            ...pharmacyData,
            agreement: { ...pharmacyData.agreement, fileKey: pharmacyData.agreement.link }
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

  const handleChangeOpen24h7d = (e: React.ChangeEvent<HTMLInputElement> | null, checked: boolean) => {
    newPharmacy.schedule.wholeWeek.isClosed = !checked;
    setIsOpen24h7d(checked);
    changeOpen24h7d(checked, newPharmacy.schedule);
    setErr({ ...err, schedule: '' });
  };

  useEffect(() => {
    getPharmacyById().catch();
    handleGetPharmacyInGroup().catch((r) => r);
    // eslint-disable-next-line
  }, [sub]);

  const infoFromOldFields = (pharmacyData: any) => {
    const data: any = {
      managers: {
        primaryContact: {
          ...pharmacyData.managers.primaryContact
        },
        secondaryContact: {
          ...pharmacyData.managers.secondaryContact
        }
      },
      addOldData: false
    };
    if (!pharmacyData.managers.primaryContact.firstName && pharmacyData.managerName) {
      data.addOldData = true;
      data.managers.primaryContact.firstName = pharmacyData.managerName;
    }
    if (!pharmacyData.managers.primaryContact.phone && pharmacyData.managerPhoneNumber) {
      data.addOldData = true;
      data.managers.primaryContact.phone = pharmacyData.managerPhoneNumber;
    }
    if (!pharmacyData.managers.primaryContact.email && pharmacyData.email) {
      data.addOldData = true;
      data.managers.primaryContact.email = pharmacyData.email;
    }

    return data;
  };

  const updateSchedule = () => {
    if (Object.keys(pharmacy.schedule).some((d) => !!pharmacy.schedule[d].open)) {
      prepareScheduleUpdate(pharmacy.schedule, 'wholeWeek');
      days.forEach((day) => {
        prepareScheduleUpdate(pharmacy.schedule, day.value);
      });

      // tslint:disable-next-line:no-console
      console.log('pharmacy.schedule in updateSchedule in PharmacyInfo -----> ', pharmacy.schedule);

      if (!pharmacy.schedule.wholeWeek.isClosed && checkIsOpen24h7d(pharmacy.schedule)) {
        handleChangeOpen24h7d(null, true);
      }
      if (!pharmacy.schedule.wholeWeek.isClosed) {
        setTimeFromOldLogic(pharmacy.schedule);
      }

      setUpdatePharmacy();
    } else {
      setEmptySchedule();
    }
  };

  useEffect(() => {
    updateSchedule();
    // if (isUpdate) updateSchedule(); // was before
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
          roughAddressObj: { ...pharmacy.address },
          agreement: { link: pharmacyData.agreement.fileKey, name: pharmacyData.agreement.name },
          schedule: newSchedule,
          affiliation: !affiliation ? _affiliation : affiliation
        });
      } else {
        await updatePharmacy(id, {
          ...pharmacyData,
          roughAddressObj: { ...pharmacy.address },
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
    updateSchedule();
    setIsUpdate(true);
  };

  const handlerSetStatus = (status: string) => async () => {
    try {
      const newSchedule = { ...pharmacy.schedule };

      if (Object.keys(newSchedule).some((d) => !!newSchedule[d].open.hour)) {
        prepareScheduleDay(newSchedule, 'wholeWeek');
        days.forEach((day) => {
          prepareScheduleDay(newSchedule, day.value);
        });
      }

      await updatePharmacy(id, {
        ...pharmacy,
        schedule: newSchedule,
        roughAddressObj: { ...pharmacy.address },
        status
      });
      setUpdatePharmacy();
      history.push('/dashboard/pharmacies');
    } catch (error) {
      console.error('error in handlerSetStatus ---->', error);
    }
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

  const onSetTypeInfo = useCallback((value: string) => setInfoType(value), []);

  const onChangeBasicInfoAccordion = useCallback(
    (_event: React.ChangeEvent<{}>, expanded: boolean) => setOpenBasicInfo(expanded),
    []
  );
  const onChangeAdditionalInfoAccordion = useCallback(
    (_event: React.ChangeEvent<{}>, expanded: boolean) => setOpenAdditionalInfo(expanded),
    []
  );
  const onChangePharmacySettingsInfoAccordion = useCallback(
    (_event: React.ChangeEvent<{}>, expanded: boolean) => setPharmacySettingsInfo(expanded),
    []
  );

  const renderMainInfo = () => (
    <>
      <TopBlock pharmacy={pharmacy} />
      <AccordionWrapper
        onChangeAccordion={onChangeBasicInfoAccordion}
        expandedAccordion={openBasicInfo}
        onSetTypeInfo={onSetTypeInfo} //
        onSetEdit={handleSetUpdate} //
        label={'General Information'}
        renderAccordionDetails={() => <GeneralInfo pharmacy={pharmacy} />}
      />
      <AccordionWrapper
        onChangeAccordion={onChangeAdditionalInfoAccordion}
        expandedAccordion={openAdditionalInfo}
        onSetTypeInfo={onSetTypeInfo} //
        onSetEdit={handleSetUpdate} //
        label={'Additional Information'}
        renderAccordionDetails={() => <AdditionalInfo pharmacy={pharmacy} />}
      />
      <AccordionWrapper
        onChangeAccordion={onChangePharmacySettingsInfoAccordion}
        expandedAccordion={openPharmacySettingsInfo}
        onSetTypeInfo={onSetTypeInfo} //
        onSetEdit={handleSetUpdate} //
        label={'Pharmacy Settings'}
        renderAccordionDetails={() => <PharmacySettingsInfo pharmacy={pharmacy} />}
      />
    </>
  );

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
            {renderMainInfo()}
            {!isIndependentPharmacy && renderGroupsBlock()}
            {/* {renderReturnCashCongifurationBlock()} */}
            {/* {renderGroupBillingBlock()} */}
            {renderApproveBlock()}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={styles.infoBlock}>
            {renderMainInfo()}
            {renderApproveBlock()}
          </div>
          {!isIndependentPharmacy && renderGroupsBlock()}
          {/* {renderReturnCashCongifurationBlock()} */}
          {/* {renderGroupBillingBlock()} */}
          <PharmacyUsers getPharmacyById={getPharmacyById} />
          <PharmacyReports pharmacyId={id} />
        </>
      );
    }
  };

  return (
    <div className={styles.pharmacyWrapper}>
      <PharmacyInfoHeader
        id={id}
        label={infoType && isUpdate ? `Edit ${infoType}` : 'Pharmacy Details'}
        pharmacyName={pharmacy.name || ''}
        setIsUpdate={setIsUpdate}
        isUpdate={isUpdate}
      />
      {
        <div className={styles.pharmacyBlock}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className={styles.mainInfo}>
                {isUpdate && infoType === 'General Information' && (
                  <EditGeneralInfo
                    err={err}
                    setError={setErr}
                    isOpen24_7={isOpen24h7d}
                    handleChangeOpen24_7={handleChangeOpen24h7d}
                  />
                )}
                {isUpdate && infoType === 'Additional Information' && (
                  <EditAdditionalInfo err={err} setError={setErr} />
                )}
                {isUpdate && infoType === 'Pharmacy Settings' && <EditPharmacySettings err={err} setError={setErr} />}
                {!isUpdate && renderInfo()}
              </div>
              {isUpdate && (
                <PharmacyInfoFooter isRequestLoading={isRequestLoading} handleUpdatePharmacy={handleUpdatePharmacy} />
              )}
            </>
          )}
        </div>
      }
    </div>
  );
};
// old logic

// import ReturnCashConfiguration from './components/ReturnCashConfiguration';

// const [rcEnable, setRcEnable] = useState<boolean>(false);
// const [rcFlatFeeForCourier, setRcFlatFeeForCourier] = useState<number>(0);
// const [rcFlatFeeForPharmacy, setRcFlatFeeForPharmacy] = useState<number>(0);

// setRcEnable(pharmacy.rcEnable); // was in useEffect
// setRcFlatFeeForCourier(pharmacy.rcFlatFeeForCourier || 0);
// setRcFlatFeeForPharmacy(pharmacy.rcFlatFeeForPharmacy || 0);

// const renderReturnCashCongifurationBlock = () => (
//   <ReturnCashConfiguration
//     {...{
//       rcEnable,
//       rcFlatFeeForCourier,
//       rcFlatFeeForPharmacy
//     }}
//     id={id}
//     onChangeRcEnable={setRcEnable}
//     onChangeRcFlatFeeForCourier={setRcFlatFeeForCourier}
//     onChangeRcFlatFeeForPharmacy={setRcFlatFeeForPharmacy}
//   />
// );

// const renderSummaryItem = (name: string, value: string) => {
//   return (
//     <div className={styles.summaryItem}>
//       <Typography className={styles.field}>{name}</Typography>
//       {name === 'Uploaded File' ? (
//         <div onClick={handleGetFileLink(pharmacy.agreement.fileKey)} className={styles.document}>
//           {agreement.isLoading ? <Loading className={styles.fileLoader} /> : value}
//         </div>
//       ) : (
//         <Typography>{value}</Typography>
//       )}
//     </div>
//   );
// };
