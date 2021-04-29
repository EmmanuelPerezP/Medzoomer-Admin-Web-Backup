import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
// import SendIcon from '@material-ui/icons/Send';
// import AssessmentIcon from '@material-ui/icons/Assessment';

import { useStores } from '../../../../store';
import useGroups from '../../../../hooks/useGroup';
import useUser from '../../../../hooks/useUser';
import { decodeErrors } from '../../../../utils';
import {
  contactTypesArray,
  contactTypes,
  invoiceFrequency,
  invoiceFrequencyWeeklyDays,
  invoiceFrequencyMonthlyDays
} from '../../../../constants';
import usePharmacy from '../../../../hooks/usePharmacy';
import useBillingManagement from '../../../../hooks/useBillingManagement';

import SVGIcon from '../../../common/SVGIcon';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import Error from '../../../common/Error';
import Image from '../../../common/Image';
import Loading from '../../../common/Loading';
import AutoCompleteSearch from '../../../common/AutoCompleteSearch';
// import MenuSmall from '../../../common/MenuSmall';

import styles from './CreateGroup.module.sass';
import { ConfirmationModal } from '../../../common/ConfirmationModal/ConfirmationModal';

let timerId: any = null;

export const CreateGroup: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getPharmacies, filters } = usePharmacy();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<any[]>([]);
  const [isReportGenerate, setIsReportGenerate] = useState(false);
  const [isSendBilling, setIsSendBilling] = useState(false);
  const [reportIsGenerated, setReportIsGenerated] = useState(false);
  const [invoiceIsGenerated, setInvoiceIsGenerated] = useState(false);

  const { groupStore } = useStores();
  const {
    newGroup,
    createGroup,
    updateGroup,
    getGroup,
    getPharmacyInGroup,
    generateReport,
    sendInvoices
  } = useGroups();
  const { sub } = useUser();
  const [err, setError] = useState({
    global: '',
    name: ''
  });
  const { addGroupToPharmacy, removeGroupFromPharmacy } = usePharmacy();

  useEffect(() => {
    addNewGroupDefaultData();
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
          {!id ? null : isReportGenerate || isSendBilling ? (
            <Loading />
          ) : (
            <>
              <Button
                color="secondary"
                variant={'contained'}
                onClick={handleGenerateReport}
                className={styles.reportBtn}
                disabled={isReportGenerate}
              >
                Generate Report
              </Button>
              <Button
                color="primary"
                variant={'contained'}
                onClick={handleSendInvoices}
                className={styles.sendInvoicesBtn}
                disabled={isSendBilling}
              >
                Send Invoice
              </Button>
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
      name: ''
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
        await createGroup({ ...newGroup, name: newGroup.name.trim() });
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

  const handleGenerateReport = async () => {
    setIsReportGenerate(true);
    await generateReport({ groupId: id }).catch(console.error);
    setIsReportGenerate(false);
    setReportIsGenerated(true);
  };

  const handleSendInvoices = async () => {
    setIsSendBilling(true);
    await sendInvoices({ groupId: id }).catch(console.error);
    setIsSendBilling(false);
    setInvoiceIsGenerated(true);
  };

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
            <div className={styles.oneInput}>
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
      getPharmaciesList(value).catch();
    }, 500);
  };

  const handleFocus = () => {
    getPharmaciesList('').catch();
  };

  const getPharmaciesList = useCallback(
    async (search) => {
      setIsOptionLoading(true);
      try {
        const pharmaciesResult = await getPharmacies({
          ...filters,
          page: 0,
          perPage: 10,
          search
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
    setPharmacies([]);
    await handleGetPharmacyInGroup(id);
  };

  const handleAddPharmacy = async (pharmacy: any) => {
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

   if (isLoading) {
    return <div className={styles.loadingWrapper}>{<Loading />}</div>;
  }

  return (
    <div className={styles.createGroupsWrapper}>
      {renderHeaderBlock()}
      {renderGroupInfo()}
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
