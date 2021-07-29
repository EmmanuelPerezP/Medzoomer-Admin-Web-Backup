import styles from './Header.module.sass';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { IHeaderProps } from './types';
import SVGIcon from '../../../common/SVGIcon';
import { Typography } from '@material-ui/core';

export const Header: FC<IHeaderProps> = ({ title, backRoute }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftPart}>
        <Link to={backRoute}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
      </div>

      <Typography className={styles.title}>{title}</Typography>
      <div className={styles.rightPart} />
    </div>
  );
};
