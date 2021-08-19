import styles from './Header.module.sass';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { IHeaderProps } from './types';
import SVGIcon from '../../../common/SVGIcon';
import { Typography } from '@material-ui/core';

export const Header: FC<IHeaderProps> = ({ title, backRoute }) => {
  const history = useHistory();

  return (
    <div className={styles.container}>
      <div className={styles.leftPart}>
        <div className={styles.pressable} onClick={history.goBack}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </div>
      </div>

      <Typography className={styles.title}>{title}</Typography>
      <div className={styles.rightPart} />
    </div>
  );
};
