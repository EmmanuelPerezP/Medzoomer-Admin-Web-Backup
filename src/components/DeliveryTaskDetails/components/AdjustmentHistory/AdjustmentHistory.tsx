import styles from './AdjustmentHistory.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';

import { IAdjustmentHistoryProps } from './types';
import { emptyChar } from '../../utils';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';

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
      const date = item.createdAt ? getDateFromTimezone(item.date, user, 'MM/DD/YYYY') : emptyChar;
      const oldPrice = item.oldPrice ? `$${item.oldPrice.toFixed(2)}` : emptyChar;
      const newPrice = item.newPrice ? `$${item.newPrice.toFixed(2)}` : emptyChar;

      return (
        <div className={styles.itemContainer} key={index}>
          <div className={classNames(styles.columnDate, styles.value)}>{date}</div>

          <div className={classNames(styles.columnOldPrice, styles.value)}>{oldPrice}</div>

          <div className={classNames(styles.columnNewPrice, styles.value)}>{newPrice}</div>

          <div className={classNames(styles.columnFor, styles.value)}>{item.for}</div>

          <div className={classNames(styles.columnUser, styles.value)}>
            <Link to={`/dashboard/orders/${item.user_id}`} style={{ textDecoration: 'none' }}>
              <Typography color="secondary">{item.user_fullName}</Typography>
            </Link>
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
