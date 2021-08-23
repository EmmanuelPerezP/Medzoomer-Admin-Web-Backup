import React, { FC } from 'react';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';
import styles from './styles.module.sass';
// import { getAddressString } from '../../../../../../utils';
import { CheckRStatuses, PHARMACY_STATUS } from '../../../../../../constants';
import Image from '../../../../../common/Image';
import { parseCourierRegistrationStatus, parseOnboardingStatus } from '../../../../../../utils';

interface IStatusBox {
  title: string;
  status: string;
}

const StatusBox: FC<IStatusBox> = ({ title, status }) => {
  return (
    <div className={styles.statusBox}>
      <div className={styles.circleBorder}>
        <div className={styles.circle}></div>
      </div>
      <div>
        <Typography className={styles.statusTitle}>{title}</Typography>
        <Typography className={styles.status}>{status}</Typography>
      </div>
    </div>
  )
}

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
      <Typography className={styles.title}>{courier.name} ${courier.family_name}</Typography>
      <Typography className={styles.subTitle}>
        {`${courier.email && courier.email} • ${courier.phone_number && courier.phone_number}`}
      </Typography>
      <div className={styles.statusContainer}>
        <StatusBox title="CheckR Status" status={courier.checkrInvLink && CheckRStatuses[courier.checkrStatus]} />
        <StatusBox title="Registration Status" status={registrationStatus.label} />
        <StatusBox title="Onboarding Status" status={onboardingStatus.label} />
      </div>
    </div>
  );
};

export default TopBlock;
