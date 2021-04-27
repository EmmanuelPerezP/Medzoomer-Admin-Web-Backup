import Typography from '@material-ui/core/Typography';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import useBillingManagement from '../../../../hooks/useBillingManagement';
import { useStores } from '../../../../store';
import ConfirmationModal from '../../../common/ConfirmationModal';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';
import ContactSettings from '../ContactSettings';
import ContactsTable from '../ContactsTable';
import DispatchSettings from '../DispatchSettings';
import styles from './CreateBillingAccount.module.sass';

export const CreateBillingAccount: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();

  const [isLoading, setIsLoading] = useState(false);
  const [userIsAdded, setUserIsAdded] = useState(false);
  const { billingAccountStore } = useStores();
  const { get } = useBillingManagement();

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

  const closeUserContactModal = () => {
    setUserIsAdded(false);
  };

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

  if (isLoading) {
    return <div className={styles.loadingWrapper}>{<Loading />}</div>;
  }

  return (
    <div className={styles.createBillingAcountWrapper}>
      {renderHeaderBlock()}
      <div className={styles.groupBlock}>
        <DispatchSettings notDefaultBilling typeObject="group" />
      </div>
      {id && <ContactSettings />}
      {id && <ContactsTable />}

      <ConfirmationModal
        isOpen={userIsAdded}
        handleModal={closeUserContactModal}
        title={'Group contact added successfully'}
      />
    </div>
  );
};
