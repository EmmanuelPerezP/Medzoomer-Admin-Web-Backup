import React, { FC } from 'react';
import { IWrapperTableProps } from './types';
import styles from './WrapperTable.module.sass';
import SVGIcon from '../../../common/SVGIcon';
import classNames from 'classnames';
import { Typography } from '@material-ui/core';

export const WrapperTable: FC<IWrapperTableProps> = ({
  children,
  HeaderRightComponent = null,
  BottomRightComponent = null,
  title,
  subTitle,
  iconName,
  biggerIcon = false
}) => {
  return (
    <div className={styles.container} style={BottomRightComponent ? { paddingBottom: 0 } : {}}>
      <div className={styles.header}>
        <div className={styles.leftPart}>
          <div className={styles.iconContainer}>
            <SVGIcon className={classNames(styles.icon, { [styles.biggerIcon]: biggerIcon })} name={iconName} />
          </div>
          <div className={styles.descriptionContainer}>
            <Typography className={styles.title}>{title}</Typography>
            <Typography className={styles.subtitle}>{subTitle}</Typography>
          </div>
        </div>
        <div className={styles.rightPart}>{HeaderRightComponent}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.underline} />
        {children}
      </div>
      <div className={styles.footer}>{BottomRightComponent}</div>
    </div>
  );
};
