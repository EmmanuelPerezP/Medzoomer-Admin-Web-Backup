import React, { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useStores } from '../../../../store';
import useGroups from '../../../../hooks/useGroup';
import useUser from '../../../../hooks/useUser';
import { decodeErrors } from '../../../../utils';
import usePharmacy from '../../../../hooks/usePharmacy';
import SVGIcon from '../../../common/SVGIcon';
import TextField from '../../../common/TextField';
import Error from '../../../common/Error';
import Image from '../../../common/Image';
import Loading from '../../../common/Loading';
import AutoCompleteSearch from '../../../common/AutoCompleteSearch';
import styles from './CreateGroup.module.sass';
import { ConfirmationModal } from '../../../common/ConfirmationModal/ConfirmationModal';
import Select from '../../../common/Select';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import Users from '../Users/Users';
import { PharmacyUser } from '../../../../interfaces';

let timerId: any = null;

export const CreateGroup: FC = () => {
  const [temporalUsers, setTemporalUsers] = React.useState<PharmacyUser[]>([]);
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getPharmacies, filters } = usePharmacy();
  const { getSettingListGP } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<any[]>([]);
  // const [isReportGenerate, setIsReportGenerate] = useState(false);
  const [isSendBilling, setIsSendBilling] = useState(false); // eslint-disable-line
  const [reportIsGenerated, setReportIsGenerated] = useState(false);
  const [invoiceIsGenerated, setInvoiceIsGenerated] = useState(false);
  const [listSettings, setListSettings] = useState([]);

  const { groupStore } = useStores();
  const {
    newGroup,
    createGroup,
    updateGroup,
    getGroup,
    getPharmacyInGroup,
    // generateReport,
    sendInvoices // eslint-disable-line
  } = useGroups();
  const { sub } = useUser();
  const [err, setError] = useState({
    global: '',
    settingsGP: '',
    name: ''
  });
  const { addGroupToPharmacy, removeGroupFromPharmacy, getPharmacy,updatePharmacy } = usePharmacy();

  const getSettingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSettingListGP({
        page: 0,
        perPage: 1000
      });
      const listForSelect = [];
      if (data.data) {
        // tslint:disable-next-line:forin
        for (const i in data.data) {
          listForSelect.push({ value: data.data[i]._id, label: data.data[i].name });
        }
      }
      // @ts-ignore
      setListSettings(listForSelect);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getSettingListGP, setListSettings]);

  useEffect(() => {
    addNewGroupDefaultData();
    getSettingList().catch();
    if (id) {
      setIsLoading(true);
      handleGetById(id)
        .then(() => {
          setIsLoading(false);
        })
        .catch((r) => r);
      handleGetPharmacyInGroup(id).catch((r) => r);
    }

    return () => {
      addNewGroupDefaultData();
    };
    // eslint-disable-next-line
  }, [id]);

  const handleGetById = async (idGroup: string) => {
    const result = await getGroup(idGroup);
    groupStore.set('newGroup')({
      name: result.data.name,
      settingsGP: result.data.settingsGP
    });
  };
  //

  const handleGetPharmacyInGroup = async (idGroup: string) => {
    const pharmacyInGroup = await getPharmacyInGroup(idGroup);
    pharmacyInGroup.data ? setSelectedPharmacies(pharmacyInGroup.data) : setSelectedPharmacies([]);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link className={styles.link} to={'/dashboard/groups'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>

        {id ? (
          <div className={styles.textBlock}>
            <Typography className={styles.title}>Group Details</Typography>
            <Typography className={styles.subTitle}>{groupStore.get('newGroup').name}</Typography>
          </div>
        ) : (
          <Typography className={styles.title}>Add New Group</Typography>
        )}

        <div className={styles.reportBtnBlock}>
          {!id ? null : /*isReportGenerate || */ isSendBilling ? (
            <Loading />
          ) : (
            <>
              {/*<Button*/}
              {/*  color="secondary"*/}
              {/*  variant={'contained'}*/}
              {/*  onClick={handleGenerateReport}*/}
              {/*  className={styles.reportBtn}*/}
              {/*  disabled={isReportGenerate}*/}
              {/*>*/}
              {/*  Generate Report*/}
              {/*</Button>*/}
              {/*<Button*/}
              {/*  color="primary"*/}
              {/*  variant={'contained'}*/}
              {/*  onClick={handleSendInvoices}*/}
              {/*  className={styles.sendInvoicesBtn}*/}
              {/*  disabled={isSendBilling}*/}
              {/*>*/}
              {/*  Send Invoice*/}
              {/*</Button>*/}
            </>
          )}
        </div>
      </div>
    );
  };

  const addNewGroupDefaultData = () => {
    groupStore.set('newGroup')({
      name: '',
      settingsGP: ''
    });
  };
  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;

    switch (key) {
      default:
        groupStore.set('newGroup')({ ...newGroup, [key]: value });
        break;
    }

    setError({ ...err, [key]: '' });
  };

  const validate = () => {
    let isError = false;

    const errors = {
      name: '',
      settingsGP: ''
    };
    if (!newGroup.name.trim()) {
      isError = true;
      errors.name = 'Group Name is not allowed to be empty';
    }

    if (isError) {
      setError({ ...err, ...errors });
    }

    return !isError;
  };

  const handleCreateGroup = async () => {
    setError({
      global: '',
      settingsGP: '',
      name: ''
    });
    if (!validate()) {
      return false;
    }

    setIsLoading(true);
    try {
      if (id) {
        await updateGroup(id, newGroup);
      } else {
        await createGroup({ ...newGroup, name: newGroup.name.trim(), users: temporalUsers });
      }
    } catch (error) {
      const errors = error.response.data;
      setError({ ...err, ...decodeErrors(errors.details) });
      setIsLoading(false);
      return;
    }
    addNewGroupDefaultData();
    setIsLoading(false);
    history.push('/dashboard/groups');
  };

  // const handleGenerateReport = async () => {
  //   setIsReportGenerate(true);
  //   await generateReport({ groupId: id }).catch(console.error);
  //   setIsReportGenerate(false);
  //   setReportIsGenerated(true);
  // };

  // const handleSendInvoices = async () => {
  //   setIsSendBilling(true);
  //   await sendInvoices({ groupId: id }).catch(console.error);
  //   setIsSendBilling(false);
  //   setInvoiceIsGenerated(true);
  // };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <Button
          className={styles.changeStepButton}
          variant="contained"
          color="secondary"
          disabled={isLoading}
          onClick={handleCreateGroup}
        >
          <Typography className={styles.summaryText}>Save</Typography>
        </Button>
      </div>
    );
  };

  const renderGroupInfo = () => {
    return (
      <div className={styles.groupBlock}>
        <div className={styles.mainInfo}>
          <div className={styles.managerBlock}>
            <Typography className={styles.blockTitle}>General</Typography>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Group Name'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter group name'
                  }}
                  value={newGroup.name}
                  onChange={handleChange('name')}
                />
                {err.name ? <Error className={styles.error} value={err.name} /> : null}
              </div>
              <div className={styles.textField}>
                <Select
                  label="Billing Account"
                  value={newGroup.settingsGP}
                  onChange={handleChange('settingsGP')}
                  items={listSettings}
                  IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
                />
                {err.settingsGP ? <Error className={styles.error} value={err.settingsGP} /> : null}
              </div>
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  };

  const handleSearchPharmacy = (e: any) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const value: any = e.target.value;
    timerId = setTimeout(() => {
      getPharmaciesList(value, 'group').catch();
    }, 500);
  };

  const handleFocus = () => {
    getPharmaciesList('', 'group').catch();
  };

  const getPharmaciesList = useCallback(
    async (search, affiliation = '') => {
      setIsOptionLoading(true);
      try {
        const pharmaciesResult = await getPharmacies({
          ...filters,
          page: 0,
          perPage: 10,
          search,
          affiliation
        });
        setPharmacies(pharmaciesResult.data);
        setIsOptionLoading(false);
      } catch (err) {
        console.error(err);
        setIsOptionLoading(false);
      }
    },
    [getPharmacies, filters]
  );

  const handleRemovePharmacy = async (pharmacy: any) => {
    await removeGroupFromPharmacy(pharmacy._id, id);
    const { data } = await getPharmacy( pharmacy._id);
    if(!data.groups.length) {
      await updatePharmacy(pharmacy._id, {...data, affiliation:'independent', roughAddressObj: data.roughAddressObj ? data.roughAddressObj :{}})
    }
    setPharmacies([]);
    await handleGetPharmacyInGroup(id);
  };

  const handleAddPharmacy = async (pharmacy: any) => {
    const { data } = await getPharmacy( pharmacy._id);
    await updatePharmacy(data._id, {...data, affiliation:'group', roughAddressObj: data.roughAddressObj ? data.roughAddressObj :{}})
    setIsOptionLoading(true);
    await addGroupToPharmacy(pharmacy._id, id);
    setPharmacies([]);
    setIsOptionLoading(false);
    await handleGetPharmacyInGroup(id);
  };

  const closeMessageModal = () => {
    setReportIsGenerated(false);
    setInvoiceIsGenerated(false);
  };

  const renderPharmacies = () => {
    return (
      <div className={styles.pharmacies}>
        <Typography className={styles.blockTitle}>Added Pharmacies</Typography>
        <AutoCompleteSearch placeholder={'Add Pharmacy'} onFocus={handleFocus} onChange={handleSearchPharmacy} />
        <div className={styles.options}>
          {isOptionLoading ? (
            <Loading className={styles.loadPharmacyBlock} />
          ) : pharmacies && pharmacies.length === 0 ? null : (
            pharmacies.map((row: any) => {
              const { address, preview, _id, name } = row;
              if (_.find(selectedPharmacies, { _id })) {
                return null;
              }
              return (
                <div key={_id} className={styles.optionItem}>
                  <div className={styles.infoWrapper}>
                    <Image
                      className={styles.photo}
                      alt={'No Avatar'}
                      src={preview}
                      width={200}
                      height={200}
                      cognitoId={sub}
                    />
                    <div className={styles.info}>
                      <Typography className={styles.title}>{name}</Typography>
                      <Typography className={styles.subTitle}>
                        {address.street} {address.number}, {address.city}, {address.state}, {address.postalCode}
                      </Typography>
                    </div>
                  </div>
                  <SVGIcon
                    className={styles.closeIcon}
                    name="plus"
                    onClick={() => {
                      handleAddPharmacy(row).catch();
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
        {selectedPharmacies && selectedPharmacies.length > 0
          ? selectedPharmacies.map((row: any) => {
              const { address, preview, _id, name } = row;
              return (
                <div key={_id} className={styles.pharmacyItem}>
                  <div className={styles.infoWrapper}>
                    <Image
                      className={styles.photo}
                      alt={'No Avatar'}
                      src={preview}
                      width={200}
                      height={200}
                      cognitoId={sub}
                    />
                    <div className={styles.info}>
                      <Typography className={styles.title}> {name}</Typography>
                      <Typography className={styles.subTitle}>
                        {address.street} {address.number}, {address.city}, {address.state}, {address.postalCode}
                      </Typography>
                    </div>
                  </div>
                  <SVGIcon
                    className={styles.closeIcon}
                    name="close"
                    onClick={() => {
                      handleRemovePharmacy(row).catch();
                    }}
                  />
                </div>
              );
            })
          : null}
      </div>
    );
  };

  const renderAdminUsers = () => {
    return (
      <div className={styles.pharmacies}>
        <Users groupId={id} temporalUsers={temporalUsers} updateTemporalUsers={setTemporalUsers} />
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loadingWrapper}>{<Loading />}</div>;
  }

  return (
    <div className={styles.createGroupsWrapper}>
      {renderHeaderBlock()}
      {renderGroupInfo()}
      {renderAdminUsers()}
      {id ? renderPharmacies() : null}

      <ConfirmationModal
        isOpen={reportIsGenerated}
        handleModal={closeMessageModal}
        title={'Report Generated Successfully'}
      />
      <ConfirmationModal
        isOpen={invoiceIsGenerated}
        handleModal={closeMessageModal}
        title={'Invoice Sent Successfully'}
      />
    </div>
  );
};
