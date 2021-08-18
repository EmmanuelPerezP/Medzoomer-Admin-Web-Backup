import React, { FC } from 'react';
import moment from 'moment';
import { ITimelineTaskRowProps } from '../../types';
import generalStyles from '../../Delivery.module.sass';

export const TimelineTaskRow: FC<ITimelineTaskRowProps> = ({ task }) => {
  const type = (task: any) => {
    switch (task.type) {
      case 'created':
        return 'Task Created';
      case 'assigned':
        return 'Task Assigned';
      case 'started':
        return 'Task Started';
      case 'completed':
        return 'Task Completed Successfully';
      default:
        return;
    }
  };

  return (
    <div className={generalStyles.row}>
      <p className={generalStyles.title}>{moment(task.date).format('D/MM/YYYY, LT')}</p>
      <p className={generalStyles.subTitle}>{type(task)}</p>
    </div>
  );
};

export default TimelineTaskRow;
