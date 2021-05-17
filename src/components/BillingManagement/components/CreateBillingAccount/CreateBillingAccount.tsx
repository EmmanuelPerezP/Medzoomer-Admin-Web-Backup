import Typography from '@material-ui/core/Typography';
import React, { FC, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../../../common/ConfirmationModal';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';
import ContactSettings from '../ContactSettings';
import DispatchSettings from '../DispatchSettings';
import styles from './CreateBillingAccount.module.sass';

export const CreateBillingAccount: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();

  const [isLoading] = useState(false);
  const [userIsAdded, setUserIsAdded] = useState(false);

  const closeUserContactModal = () => {
    setUserIsAdded(false);
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
      <ConfirmationModal
        isOpen={userIsAdded}
        handleModal={closeUserContactModal}
        title={'Group contact added successfully'}
      />
    </div>
  );
};
