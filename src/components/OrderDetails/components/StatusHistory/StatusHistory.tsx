import styles from './StatusHistory.module.sass';
import React, { FC, useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { IStatusHistoryProps } from './types';
import { Wrapper } from '../Wrapper';
import { TOrderStatuses } from '../../../../interfaces';

export const StatusHistory: FC<IStatusHistoryProps> = ({ statusHistory, order }) => {
  const [statuses, setStatuses] = useState(statusHistory);

  const checkStatusHistory = useCallback(() => {
    if (statusHistory && statusHistory.length) {
      const hasPendingStatus = statusHistory.find((el: { status: string }) => el.status && el.status === 'new');

      if (hasPendingStatus) {
        setStatuses(statusHistory);
      } else {
        const newStatusHistory = [
          {
            createdAt: order.createdAt,
            status: 'new'
          },
          ...statusHistory
        ];

        setStatuses(newStatusHistory);
      }
    } else {
      const newStatusHistory = [
        {
          createdAt: order.createdAt,
          status: 'new'
        }
      ];
      if (order.status !== 'new') {
        newStatusHistory.push({
          createdAt: order.updatedAt,
          status: order.status
        });
      }
      setStatuses(newStatusHistory);
    }
  }, [order.createdAt, order.status, order.updatedAt, statusHistory]);

  useEffect(() => {
    checkStatusHistory();
  }, [checkStatusHistory]);

  const getItemStatus = (status: TOrderStatuses) => {
    switch (status) {
      case 'new':
        return 'New';
      case 'ready':
        return 'Ready';
      case 'canceled':
        return 'Canceled';
      case 'pending':
        return 'Pending Pickup';
      case 'route':
        return 'En Route';
      case 'delivered':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'New';
    }
  };

  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnDate, styles.label)}>Date</div>
      <div className={classNames(styles.columnTime, styles.label)}>Time</div>
      <div className={classNames(styles.columnStatus, styles.label)}>Status</div>
    </div>
  );

  const renderItems = () => {
    return statuses.map((item: any) => (
      <div className={styles.itemContainer} key={item._id}>
        <div className={classNames(styles.columnDate, styles.value)}>{moment(item.createdAt).format('MM/DD/YYYY')}</div>

        <div className={classNames(styles.columnTime, styles.value)}>{moment(item.createdAt).format('h:mm:ss a')}</div>

        <div className={classNames(styles.columnStatus, styles.value)}>
          <div
            className={classNames(styles.itemStatus, {
              [styles.new]: item.status === 'new',
              [styles.ready]: item.status === 'ready',
              [styles.canceled]: item.status === 'canceled',
              [styles.pending]: item.status === 'pending',
              [styles.route]: item.status === 'route',
              [styles.delivered]: item.status === 'delivered',
              [styles.failed]: item.status === 'failed'
            })}
          />
          {getItemStatus(item.status)}
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
