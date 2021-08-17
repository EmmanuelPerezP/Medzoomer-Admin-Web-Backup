import styles from './AdjustmentHistory.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';

import { IAdjustmentHistoryProps } from './types';
import { emptyChar, isPopulatedObject } from '../../utils';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import { Typography } from '@material-ui/core';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { User } from '../../../../interfaces';

export const AdjustmentHistory: FC<IAdjustmentHistoryProps> = ({ items }) => {
  const user = useUser();

  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnDate, styles.label)}>Date</div>
      <div className={classNames(styles.columnOldPrice, styles.label)}>Old Price</div>
      <div className={classNames(styles.columnNewPrice, styles.label)}>New Price</div>
      <div className={classNames(styles.columnFor, styles.label)}>For</div>
      <div className={classNames(styles.columnUser, styles.label)}>User</div>
    </div>
  );

  const renderItems = () => {
    return items.map((item, index) => {
      const date = item.createdAt ? getDateFromTimezone(item.createdAt, user, 'MM/DD/YYYY') : emptyChar;
      const prevValue = item.prevValue ? `$${Number(item.prevValue).toFixed(2)}` : emptyChar;
      const nextValue = item.nextValue ? `$${Number(item.nextValue).toFixed(2)}` : emptyChar;
      const adjustedType = item.adjustedType === 'courier' ? 'Courier' : 'Pharmacy';
      const isByCRON = !item.adjustedBy;

      const adjustedBy = isPopulatedObject(item.adjustedBy)
        ? `${(item.adjustedBy as User).name} ${(item.adjustedBy as User).family_name}`
        : 'Internal System';

      return (
        <div className={styles.itemContainer} key={index}>
          <div className={classNames(styles.columnDate, styles.value)}>{date}</div>
          <div className={classNames(styles.columnOldPrice, styles.value)}>{prevValue}</div>
          <div className={classNames(styles.columnNewPrice, styles.value)}>{nextValue}</div>
          <div className={classNames(styles.columnFor, styles.value)}>{adjustedType}</div>
          <div className={classNames(styles.columnUser, styles.value)}>
            <Typography {...(isByCRON ? {} : { color: 'secondary' })}>{adjustedBy}</Typography>
          </div>
        </div>
      );
    });
  };

  const renderEmptyMessage = () => <div className={styles.emptyMessage}>History list is empty</div>;

  return (
    <Wrapper subTitle="Delivery Price Adjustment History" iconName="update">
      <div className={styles.content}>
        {renderHeader()}
        {items.length ? renderItems() : renderEmptyMessage()}
      </div>
    </Wrapper>
  );
};
