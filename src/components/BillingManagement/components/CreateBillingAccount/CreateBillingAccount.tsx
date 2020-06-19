import React, { FC, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import SVGIcon from '../../../common/SVGIcon';

import styles from './CreateBillingAccount.module.sass';
import TextField from '../../../common/TextField';
import { useStores } from '../../../../store';
import useBillingManagement from '../../../../hooks/useBillingManagement';

import { Error } from '../../../common/Error/Error';
import { decodeErrors } from '../../../../utils';
import Loading from '../../../common/Loading';

export const CreateBillingAccount: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { billingAccountStore } = useStores();
  const { newBilling, createBilling, updateBilling, get } = useBillingManagement();
  const [err, setError] = useState({
    global: '',
    name: '',
    companyName: '',
    title: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    billingAccountStore.set('newBilling')({
      name: '',
      companyName: '',
      title: '',
      email: '',
      phone: ''
    });
    if (id) {
      setIsLoading(true);
      handleGetById(id)
        .then(() => {
          setIsLoading(false);
        })
        .catch((r) => r);
    }
    // eslint-disable-next-line
  }, [id]);

  const handleGetById = async (billingAccountId: string) => {
    setIsLoading(true);
    const result = await get(billingAccountId);
    billingAccountStore.set('newBilling')({
      name: result.data.name,
      companyName: result.data.companyName || null,
      title: result.data.title || null,
      email: result.data.email || null,
      phone: result.data.phone || null
    });
    setIsLoading(false);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link className={styles.link} to={'/dashboard/billing_management'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>{id ? 'Edit Billing Account' : 'Add New Billing Account'}</Typography>
        <Typography className={styles.title} />
      </div>
    );
  };

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    billingAccountStore.set('newBilling')({ ...newBilling, [key]: value });
    setError({ ...err, [key]: '' });
  };

  const handleCreatePharmacy = async () => {
    setIsLoading(true);
    try {
      if (id) {
        await updateBilling(id, newBilling);
      } else {
        await createBilling(newBilling);
      }
    } catch (error) {
      const errors = error.response.data;
      setError({ ...err, ...decodeErrors(errors.details) });
      setIsLoading(false);
      return;
    }
    billingAccountStore.set('newBilling')({
      name: '',
      companyName: '',
      title: '',
      email: '',
      phone: ''
    });
    setIsLoading(false);
    history.push('/dashboard/billing_management');
  };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <>
          <Button
            className={styles.changeStepButton}
            variant="contained"
            color="secondary"
            disabled={isLoading}
            onClick={handleCreatePharmacy}
          >
            <Typography className={styles.summaryText}>Save</Typography>
          </Button>
        </>
      </div>
    );
  };

  const renderBillingInfo = () => {
    if (isLoading) {
      return <Loading />;
    }
    return (
      <div className={styles.pharmacyBlock}>
        <div className={styles.mainInfo}>
          <div className={styles.managerBlock}>
            <Typography className={styles.blockTitle}>General</Typography>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Account Name'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter'
                  }}
                  value={newBilling.name}
                  onChange={handleChange('name')}
                />
                {err.name ? <Error className={styles.error} value={err.name} /> : null}
              </div>
              <div className={styles.textField}>
                <TextField
                  label={'Title'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter'
                  }}
                  value={newBilling.title}
                  onChange={handleChange('title')}
                />
                {err.title ? <Error className={styles.error} value={err.title} /> : null}
              </div>
            </div>
          </div>
          <div className={styles.managerBlock}>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Company Name'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter'
                  }}
                  value={newBilling.companyName}
                  onChange={handleChange('companyName')}
                />
                {err.companyName ? <Error className={styles.error} value={err.companyName} /> : null}
              </div>
            </div>
          </div>
          <div className={styles.managerBlock}>
            <div className={styles.twoInput}>
              <div className={styles.textField}>
                <TextField
                  label={'Phone number'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter'
                  }}
                  value={newBilling.phone}
                  onChange={handleChange('phone')}
                />
                {err.phone ? <Error className={styles.error} value={err.phone} /> : null}
              </div>
              <div className={styles.textField}>
                <TextField
                  label={'Email'}
                  classes={{
                    root: styles.textField
                  }}
                  inputProps={{
                    placeholder: 'Please enter'
                  }}
                  value={newBilling.email}
                  onChange={handleChange('email')}
                />
                {err.email ? <Error className={styles.error} value={err.email} /> : null}
              </div>
            </div>
          </div>
        </div>
        {renderFooter()}
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loadingWrapper}>{<Loading />}</div>;
  }

  return (
    <div className={styles.createBillingAcountWrapper}>
      {renderHeaderBlock()}
      {renderBillingInfo()}
    </div>
  );
};
