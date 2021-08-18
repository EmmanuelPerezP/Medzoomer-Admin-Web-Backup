import React, { FC } from 'react';
import styles from './Delivery.module.sass';
import { IDeliveryProps } from './types';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import PhotosBlock from './components/PhotosBlock/PhotosBlock';
import NotesBlock from './components/NotesBlock/NotesBlock';
import TimelineTaskItem from './components/TimelineTaskItem/TimelineTaskItem';
import TimelineTaskRow from './components/TimelineTaskRow/TimelineTaskRow';

export const Delivery: FC<IDeliveryProps> = ({ delivery, deliveryInfo }) => {
  const renderIcons = () => delivery.map((task, i) => <TimelineTaskItem key={i} task={task} isFirst={i === 0} />);
  const renderTimelines = () => delivery.map((task, i) => <TimelineTaskRow task={task} key={i} />);
  const renderEmptyMessage = () => <div>List is empty</div>;

  return (
    <Wrapper
      title="Delivery"
      subTitle="Timeline"
      iconName="order"
      ContentLeftComponent={<div className={styles.leftComponent}>{renderIcons()}</div>}
    >
      <div className={styles.content}>
        {delivery.length ? renderTimelines() : renderEmptyMessage()}
        <PhotosBlock deliveryInfo={deliveryInfo} />
        <NotesBlock notes={deliveryInfo.errorNotes || ''} />
      </div>
    </Wrapper>
  );
};
