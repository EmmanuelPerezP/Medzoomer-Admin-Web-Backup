import React from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Image from '../Image';
import { AvatarProps } from '../../../interfaces';
import defaultImg from '../../../assets/img/terms-logo@3x.png';

import styles from './Avatar.module.sass';

export const Avatar = ({ className, cognitoId, src, fullName, email, isHide }: AvatarProps) => (
  <div className={classNames(styles.avatarWrapper, className)}>
    <Image
      width={200}
      height={200}
      defaultImg={defaultImg}
      cognitoId={cognitoId}
      src={src}
      className={styles.photo}
      alt="Avatar"
    />
    {!isHide ? (
      <div>
        <Typography className={styles.fullName}>{fullName}</Typography>
        <Typography className={styles.email}>{email}</Typography>
      </div>
    ) : null}
  </div>
);
