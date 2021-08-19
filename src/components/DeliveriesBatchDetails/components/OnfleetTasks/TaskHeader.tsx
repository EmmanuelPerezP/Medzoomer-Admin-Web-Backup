import styles from './OnfleetTasks.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';

import { ITaskHeaderProps } from './types';

export const TaskHeader: FC<ITaskHeaderProps> = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnOrderId, styles.label)}>Order ID</div>
      <div className={classNames(styles.columnDeliveryLeg, styles.label)}>Delivery Leg</div>
      <div className={classNames(styles.columnDestination, styles.label)}>Destination</div>
      <div className={classNames(styles.columnPrice, styles.label)}>Price</div>
      <div className={classNames(styles.columnStatus, styles.label)}>Status</div>
      <div className={classNames(styles.columnAction, styles.label)} />
    </div>
  );
};
