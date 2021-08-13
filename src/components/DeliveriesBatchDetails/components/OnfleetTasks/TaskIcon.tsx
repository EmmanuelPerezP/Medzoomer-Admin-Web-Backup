import styles from './OnfleetTasks.module.sass';
import React, { FC } from 'react';

import { ITaskIconProps } from './types';
import SVGIcon from '../../../common/SVGIcon';

export const TaskIcon: FC<ITaskIconProps> = ({ task, isFirst }) => {
  return (
    <div className={styles.iconBox}>
      {!isFirst && <div className={styles.divider} />}
      <SVGIcon name={task.order_uuid ? 'customerDark' : 'pharmacyDark'} />
    </div>
  );
};
