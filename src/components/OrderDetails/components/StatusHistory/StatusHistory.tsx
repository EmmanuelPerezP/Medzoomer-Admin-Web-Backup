import styles from './StatusHistory.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';

import { IStatusHistoryProps } from './types';
import { Wrapper } from '../Wrapper';

export const StatusHistory: FC<IStatusHistoryProps> = ({}) => {
  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnDate, styles.label)}>Date</div>
      <div className={classNames(styles.columnTime, styles.label)}>Time</div>
      <div className={classNames(styles.columnStatus, styles.label)}>Status</div>
    </div>
  );

  const renderItems = () => {
    return ['New', 'Ready', 'Canceled', 'Pending', 'Route', 'Delivered', 'Failed'].map((item) => (
      <div className={styles.itemContainer} key={item}>
        <div className={classNames(styles.columnDate, styles.value)}>09/23/2021</div>

        <div className={classNames(styles.columnTime, styles.value)}>2:22:34 pm</div>

        <div className={classNames(styles.columnStatus, styles.value)}>
          <div
            className={classNames(styles.itemStatus, {
              [styles.new]: item === 'New',
              [styles.ready]: item === 'Ready',
              [styles.canceled]: item === 'Canceled',
              [styles.pending]: item === 'Pending',
              [styles.route]: item === 'Route',
              [styles.delivered]: item === 'Delivered',
              [styles.failed]: item === 'Failed'
            })}
          />
          {item}
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
