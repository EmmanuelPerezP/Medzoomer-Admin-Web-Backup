import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
import Image from '../../../../../common/Image';
import { SummaryItem } from '../../CourierInfo';
import styles from './VerificationInfo.module.sass';
import classNames from 'classnames';


interface IImageBox {
  label: string;
  src: any;
  cognitoId: any;
  isDocument?: boolean;
}

export const ImageBox: FC<IImageBox> = ({ label, src, cognitoId, isDocument }) => {
  return (
    <div className={styles.imgBox}>
      <Typography className={styles.label}>{label}</Typography>
      <div className={classNames(styles.photo, { [styles.isDocument]: isDocument } )}>
        <Image
          isPreview={true}
          className={styles.img}
          cognitoId={cognitoId}
          src={src}
          alt={`No img ${label}`}
        />
      </div>
    </div>
  );
};


interface IVerificationInfo {
  courier: any;
}

const VerificationInfo: FC<IVerificationInfo> = ({ courier }) => {
  return (
    <div className={styles.wrapper}>
      <Typography className={styles.subInfoTitle}>Documents</Typography>

      <div className={styles.imageContainer}>
        <ImageBox label="Driver's License" src={courier.license} cognitoId={courier.cognitoId} isDocument />
        <ImageBox label="Car Insurance Card" src={courier.insurance} cognitoId={courier.cognitoId} isDocument />
      </div>

      <Typography className={styles.subInfoTitle}>Vehicle Information</Typography>
      <SummaryItem title="Make" value={courier.make} />
      <SummaryItem title="Model" value={courier.carModel} />
      <SummaryItem title="Year" value={courier.carYear} />


      <Typography className={styles.subInfoTitle}>Vehicle Photos</Typography>
      <div className={styles.imageContainer}>
        <ImageBox label="Front" src={courier.photosCar && courier.photosCar.front} cognitoId={courier.cognitoId} />
        <ImageBox label="Back" src={courier.photosCar && courier.photosCar.back} cognitoId={courier.cognitoId} />
        <ImageBox label="Left Side" src={courier.photosCar && courier.photosCar.left} cognitoId={courier.cognitoId} />
        <ImageBox label="Right Side" src={courier.photosCar && courier.photosCar.right} cognitoId={courier.cognitoId} />
      </div>
    </div>
  );
};

export default VerificationInfo;
