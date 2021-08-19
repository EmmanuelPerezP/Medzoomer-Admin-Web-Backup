import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.sass';
import { ITaskIconProps } from '../../types';

export const TimelineTaskItem: FC<ITaskIconProps> = ({ task, isFirst }) => {
  return (
    <div className={styles.box}>
      {!isFirst && <div className={styles.divider} />}
      <div
        className={classNames(styles.circle, {
          [styles.created]: task.type === 'created',
          [styles.assigned]: task.type === 'assigned',
          [styles.started]: task.type === 'started',
          [styles.completed]: task.type === 'completed'
        })}
      />
    </div>
  );
};

export default TimelineTaskItem;
