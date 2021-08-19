import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.sass';
import { ITaskIconProps } from '../../types';

export const TimelineTaskItem: FC<ITaskIconProps> = ({ deliveryStatus, isFirst }) => {
  return (
    <div className={styles.box}>
      {!isFirst && <div className={styles.divider} />}
      <div
        className={classNames(styles.circle, {
          [styles.pending]: deliveryStatus === 'PENDING',
          [styles.proccessed]: deliveryStatus === 'PROCESSED',
          [styles.unassigned]: deliveryStatus === 'UNASSIGNED',
          [styles.assigned]: deliveryStatus === 'ASSIGNED',
          [styles.active]: deliveryStatus === 'ACTIVE',
          [styles.completed]: deliveryStatus === 'COMPLETED',
          [styles.canceled]: deliveryStatus === 'CANCELED',
          [styles.failed]: deliveryStatus === 'FAILED'
        })}
      />
    </div>
  );
};

export default TimelineTaskItem;
