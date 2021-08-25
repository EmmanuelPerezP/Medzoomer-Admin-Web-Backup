import React, { FC, useMemo } from 'react';
import moment from 'moment';
import { ITimelineTaskRowProps } from '../../types';
import generalStyles from '../../Delivery.module.sass';
import { TDeliveryStatuses } from '../../../../../../interfaces';

export const TimelineTaskRow: FC<ITimelineTaskRowProps> = ({ task }) => {
  const deliveryStatus = task.status as TDeliveryStatuses;
  const statusType = useMemo(() => {
    switch (deliveryStatus) {
      case 'PENDING':
        return 'Task Created';
      case 'PROCESSED':
        return 'Task Processed';
      case 'UNASSIGNED':
        return 'Task Unassigned';
      case 'ASSIGNED':
        return 'Task Assigned';
      case 'ACTIVE':
        return 'Task Active';
      case 'COMPLETED':
        return 'Task Completed';
      case 'CANCELED':
        return 'Task Canceled';
      case 'FAILED':
        return 'Task Failed';
      default:
        return 'Task Created';
    }
  }, [deliveryStatus]);

  return (
    <div className={generalStyles.row}>
      <p className={generalStyles.title}>{moment(task.createdAt).format('D/MM/YYYY, LT')}</p>
      <p className={generalStyles.subTitle}>{statusType}</p>
    </div>
  );
};

export default TimelineTaskRow;
