import React, { FC } from 'react';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import styles from './styles.module.sass';
import { CheckRStatuses } from '../../../../../../constants';
import Image from '../../../../../common/Image';
import { parseCourierRegistrationStatus, parseOnboardingStatus } from '../../../../../../utils';

interface IStatusBox {
  title: string;
  status?: any;
  label?: string;
}

const StatusBox: FC<IStatusBox> = ({ title, status, label }) => {
  return (
    <div className={styles.statusBox}>
      <div  className={classNames(styles.circleBorder, {
        [styles.registered]: status === 'REGISTERED',
        [styles.unregistered]: status === 'UNREGISTERED',
        [styles.pending]: status === 'PENDING',
        [styles.incomplete]: status === 'INCOMPLETE',
        [styles.approved]: status === 'APPROVED'
      })}>
        <div className={styles.circle}></div>
      </div>
      <div>
        <Typography className={styles.statusTitle}>{title}</Typography>
        <Typography className={styles.status}>{label}</Typography>
      </div>
    </div>
  );
};

interface ITopBlock {
  courier: any;
}

const TopBlock: FC<ITopBlock> = ({ courier }) => {
  const registrationStatus = parseCourierRegistrationStatus(courier);
  const onboardingStatus = parseOnboardingStatus(courier);

  return (
    <div className={styles.wrapper}>
      {courier.picture ? (
        <Image
          isPreview={true}
          cognitoId={courier.cognitoId}
          className={classNames(styles.avatar, styles.img)}
          src={courier.picture}
          alt={'No Avatar'}
        />
      ) : (
        <div className={styles.avatar}>
          {`${courier.name && courier.name[0].toUpperCase()} ${courier.family_name &&
            courier.family_name[0].toUpperCase()}`}
        </div>
      )}
      <Typography className={styles.title}>
        {courier.name} {courier.family_name}
      </Typography>
      <Typography className={styles.subTitle}>
        {`${courier.email && courier.email} • ${courier.phone_number && courier.phone_number}`}
      </Typography>
      <div className={styles.statusContainer}>
        <StatusBox title="CheckR Status" label={courier.checkrInvLink ? CheckRStatuses[courier.checkrStatus] : 'ChechR link is not sent'} />
        <StatusBox title="Registration Status" label={registrationStatus.label} status={registrationStatus.value} />
        <StatusBox title="Onboarding Status" label={onboardingStatus.label} status={onboardingStatus.value} />
      </div>
    </div>
  );
};

export default TopBlock;
