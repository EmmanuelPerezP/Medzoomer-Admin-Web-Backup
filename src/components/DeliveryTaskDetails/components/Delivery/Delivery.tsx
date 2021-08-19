import React, { FC, useState, useEffect, useCallback } from 'react';
import styles from './Delivery.module.sass';
import { IDeliveryProps } from './types';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import PhotosBlock from './components/PhotosBlock/PhotosBlock';
import NotesBlock from './components/NotesBlock/NotesBlock';
import TimelineTaskItem from './components/TimelineTaskItem/TimelineTaskItem';
import TimelineTaskRow from './components/TimelineTaskRow/TimelineTaskRow';

export const Delivery: FC<IDeliveryProps> = ({ deliveryInfo }) => {
  const [statusHistory, setStatusHistory] = useState(deliveryInfo.$statusHistory || []);

  const checkStatusHistory = useCallback(() => {
    if (deliveryInfo && deliveryInfo.$statusHistory && deliveryInfo.$statusHistory.length) {
      const hasPendingStatus = deliveryInfo.$statusHistory.find(
        (el: { status: string }) => el.status && el.status === 'PENDING'
      );

      if (hasPendingStatus) {
        setStatusHistory(deliveryInfo.$statusHistory);
      } else {
        const newStatusHistory = [
          {
            createdAt: deliveryInfo.createdAt,
            status: 'PENDING'
          },
          ...deliveryInfo.$statusHistory
        ];

        setStatusHistory(newStatusHistory);
      }
    } else {
      const newStatusHistory = [
        {
          createdAt: deliveryInfo.createdAt,
          status: 'PENDING'
        }
      ];
      if (deliveryInfo.status !== 'PENDING') {
        newStatusHistory.push({
          createdAt: deliveryInfo.updatedAt,
          status: deliveryInfo.status
        });
      }
      setStatusHistory(newStatusHistory);
    }
  }, [deliveryInfo]);

  useEffect(() => {
    checkStatusHistory();
  }, [checkStatusHistory]);

  const renderIcons = () =>
    statusHistory.map((task: any, i: React.Key | undefined) => (
      <TimelineTaskItem key={i} deliveryStatus={task.status} isFirst={i === 0} />
    ));
  const renderTimelines = () =>
    statusHistory.map((task: any, i: React.Key | undefined) => <TimelineTaskRow task={task} key={i} />);

  const renderEmptyMessage = () => <div>List is empty</div>;

  return (
    <Wrapper
      title="Delivery"
      subTitle="Timeline"
      iconName="order"
      ContentLeftComponent={<div className={styles.leftComponent}>{renderIcons()}</div>}
    >
      <div className={styles.content}>
        {statusHistory.length ? renderTimelines() : renderEmptyMessage()}
        <PhotosBlock deliveryInfo={deliveryInfo} />
        <NotesBlock notes={deliveryInfo.errorNotes || ''} />
      </div>
    </Wrapper>
  );
};
