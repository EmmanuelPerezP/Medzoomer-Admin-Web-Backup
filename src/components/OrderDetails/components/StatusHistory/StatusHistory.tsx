import styles from './StatusHistory.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { IStatusHistoryProps } from './types';
import { Wrapper } from '../Wrapper';

export const StatusHistory: FC<IStatusHistoryProps> = ({ statusHistory }) => {
  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnDate, styles.label)}>Date</div>
      <div className={classNames(styles.columnTime, styles.label)}>Time</div>
      <div className={classNames(styles.columnStatus, styles.label)}>Status</div>
    </div>
  );

  const renderItems = () => {
    return statusHistory.map((item: any) => (
      <div className={styles.itemContainer} key={item._id}>
        <div className={classNames(styles.columnDate, styles.value)}>{moment(item.createdAt).format('MM/DD/YYYY')}</div>

        <div className={classNames(styles.columnTime, styles.value)}>{moment(item.createdAt).format('h:mm:ss a')}</div>

        <div className={classNames(styles.columnStatus, styles.value)}>
          <div
            className={classNames(styles.itemStatus, {
              [styles.new]: item.status.toLowerCase() === 'new',
              [styles.ready]: item.status.toLowerCase() === 'ready',
              [styles.canceled]: item.status.toLowerCase() === 'canceled',
              [styles.pending]: item.status.toLowerCase() === 'pending',
              [styles.route]: item.status.toLowerCase() === 'route',
              [styles.delivered]: item.status.toLowerCase() === 'delivered',
              [styles.failed]: item.status.toLowerCase() === 'failed'
            })}
          />
          {item.status}
        </div>
      </div>
    ));
  };

  return (
    <Wrapper subTitle="Order Status History" iconName="history" biggerIcon>
      <div className={styles.content}>
        {renderHeader()}
        {renderItems()}
      </div>
    </Wrapper>
  );
};
