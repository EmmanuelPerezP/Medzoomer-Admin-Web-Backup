import React, { FC, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';

import { useStores } from '../../../../store';
import useGroups from '../../../../hooks/useGroup';
import useUser from '../../../../hooks/useUser';
import { decodeErrors } from '../../../../utils';
import SVGIcon from '../../../common/SVGIcon';
import TextField from '../../../common/TextField';
import Select from '../../../common/Select';
import Error from '../../../common/Error';
import Image from '../../../common/Image';
import Loading from '../../../common/Loading';
import PharmacySearch from '../../../common/PharmacySearch';
import styles from './CreateGroup.module.sass';
import usePharmacy from '../../../../hooks/usePharmacy';
import useBillingManagement from '../../../../hooks/useBillingManagement';
let timerId: any = null;

export const CreateGroup: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getPharmacies } = usePharmacy();
  const { getAllBilling } = useBillingManagement();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<any[]>([]);
  const { groupStore } = useStores();
  const { newGroup, createGroup, updateGroup, getGroup, getPharmacyInGroup } = useGroups();
  const { sub } = useUser();
  const [err, setError] = useState({
    global: '',
    name: '',
    billingAccount: '',
    pricePerDelivery: '',
    volumeOfferPerMonth: '',
    volumePrice: ''
  });
  const { updatePharmacy } = usePharmacy();

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
    groupStore.set('newGroup')({
      name: '',
      billingAccount: '',
      pricePerDelivery: 0,
      volumeOfferPerMonth: 0,
      volumePrice: 0
    });
    getBillingAccount().catch((r) => r);
    if (id) {
      setIsLoading(true);
      handleGetById(id)
        .then(() => {
          setIsLoading(false);
        })
        .catch((r) => r);
      handleGetPharmacyInGroup(id).catch((r) => r);
    }
    // eslint-disable-next-line
  }, [id]);

  const handleGetById = async (idGroup: string) => {
    const result = await getGroup(idGroup);
    groupStore.set('newGroup')({
      name: result.data.name,
      billingAccount: result.data.billingAccount || null,
      pricePerDelivery: result.data.pricePerDelivery || null,
      volumeOfferPerMonth: result.data.volumeOfferPerMonth || null,
      volumePrice: result.data.volumePrice || null
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
            <Typography className={styles.title}>Edit Group</Typography>
            <Typography className={styles.subTitle}>{groupStore.get('newGroup').name}</Typography>
          </div>
        ) : (
          <Typography className={styles.title}>Add New Group</Typography>
        )}
      </div>
    );
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    groupStore.set('newGroup')({ ...newGroup, [key]: value });
    setError({ ...err, [key]: '' });
  };

  const handleCreateGroup = async () => {
    setIsLoading(true);
    try {
      if (id) {
        await updateGroup(id, newGroup);
      } else {
        await createGroup(newGroup);
      }
    } catch (error) {
      const errors = error.response.data;
      setError({ ...err, ...decodeErrors(errors.details) });
      setIsLoading(false);
      return;
    }
    groupStore.set('newGroup')({
      name: '',
      billingAccount: '',
      pricePerDelivery: 0,
      volumeOfferPerMonth: 0,
      volumePrice: 0
    });
    setIsLoading(false);
    history.push('/dashboard/groups');
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
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Group Name'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter'
                  }}
                  value={newGroup.name}
                  onChange={handleChange('name')}
                />
                {err.name ? <Error className={styles.error} value={err.name} /> : null}
              </div>
              <div className={styles.textField}>
                <Select
                  label={'Billing Accounts'}
                  value={newGroup.billingAccount}
                  onChange={handleChange('billingAccount')}
                  items={billingAccount}
                  classes={{ input: styles.input, selectLabel: styles.selectLabel, inputRoot: styles.inputRoot }}
                  className={styles.periodSelect}
                />
                {err.billingAccount ? <Error className={styles.error} value={err.billingAccount} /> : null}
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
                    placeholder: '0.00',
                    type: 'number',
                    endAdornment: <InputAdornment position="start">$</InputAdornment>
                  }}
                  value={newGroup.pricePerDelivery}
                  onChange={handleChange('pricePerDelivery')}
                />
                {err.pricePerDelivery ? <Error className={styles.error} value={err.pricePerDelivery} /> : null}
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
                        placeholder: '0.00',
                        endAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      value={newGroup.volumeOfferPerMonth}
                      onChange={handleChange('volumeOfferPerMonth')}
                    />
                    {err.volumeOfferPerMonth ? (
                      <Error className={styles.error} value={err.volumeOfferPerMonth} />
                    ) : null}
                  </div>
                  <div className={styles.textField}>
                    <TextField
                      label={'Price'}
                      classes={{
                        root: classNames(styles.textField, styles.priceInput)
                      }}
                      inputProps={{
                        placeholder: '0.00',
                        endAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      value={newGroup.volumePrice}
                      onChange={handleChange('volumePrice')}
                    />
                    {err.volumePrice ? <Error className={styles.error} value={err.volumePrice} /> : null}
                  </div>
                </div>
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
    [getPharmacies]
  );

  const handleRemovePharmacy = async (pharmacy: any) => {
    await updatePharmacy(pharmacy._id, { ...pharmacy, group: null, address: pharmacy.roughAddress });
    setPharmacies([]);
    await handleGetPharmacyInGroup(id);
  };

  const handleAddPharmacy = async (pharmacy: any) => {
    setIsOptionLoading(true);
    await updatePharmacy(pharmacy._id, { ...pharmacy, group: id, address: pharmacy.roughAddress });
    setPharmacies([]);
    setIsOptionLoading(false);
    await handleGetPharmacyInGroup(id);
  };

  const renderPharmacies = () => {
    return (
      <div className={styles.pharmacies}>
        <Typography className={styles.blockTitle}>Added Pharmacies</Typography>
        <PharmacySearch onFocus={handleFocus} onChange={handleSearchPharmacy} />
        <div className={styles.options}>
          {isOptionLoading ? (
            <Loading className={styles.loadPharmacyBlock} />
          ) : pharmacies && pharmacies.length === 0 ? null : (
            pharmacies.map((row: any) => {
              if (_.find(selectedPharmacies, { _id: row._id })) {
                return null;
              }
              const { address } = row;
              return (
                <div key={row._id} className={styles.optionItem}>
                  <div className={styles.infoWrapper}>
                    <Image
                      className={styles.photo}
                      alt={'No Avatar'}
                      src={row.preview}
                      width={200}
                      height={200}
                      cognitoId={sub}
                    />
                    <div className={styles.info}>
                      <Typography className={styles.title}>{row.name}</Typography>
                      <Typography
                        className={styles.subTitle}
                      >{`${address.number} ${address.street} ${address.city} ${address.zip} ${address.state}`}</Typography>
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
              const { address } = row;
              return (
                <div key={row._id} className={styles.pharmacyItem}>
                  <div className={styles.infoWrapper}>
                    <Image
                      className={styles.photo}
                      alt={'No Avatar'}
                      src={row.preview}
                      width={200}
                      height={200}
                      cognitoId={sub}
                    />
                    <div className={styles.info}>
                      <Typography className={styles.title}> {row.name}</Typography>
                      <Typography
                        className={styles.subTitle}
                      >{`${address.number} ${address.street} ${address.city} ${address.zip} ${address.state}`}</Typography>
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
    </div>
  );
};
