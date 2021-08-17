import styles from './Delivery.module.sass';
import React, { FC, Fragment } from 'react';
import { IDeliveryProps } from './types';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import moment from 'moment';
import classNames from 'classnames';
import PhotosBlock from './components/PhotosBlock/PhotosBlock';
import NotesBlock from './components/NotesBlock/NotesBlock';

export const Delivery: FC<IDeliveryProps> = ({ delivery, deliveryInfo }) => {
  const renderTypeItems = () => {
    return delivery.map((item, index) => {
      return (
        <div key={index} className={styles.box}>
          {index !== 0 && <div className={styles.divider} />}
          <div
            className={classNames(styles.circle, {
              [styles.created]: item.type === 'created',
              [styles.assigned]: item.type === 'assigned',
              [styles.started]: item.type === 'started',
              [styles.completed]: item.type === 'completed'
            })}
          />
        </div>
      );
    });
  };

  const type = (item: any) => {
    switch (item.type) {
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
    <Wrapper
      title="Delivery"
      subTitle="Timeline"
      iconName="order"
      ContentLeftComponent={<div className={styles.leftComponent}>{renderTypeItems()}</div>}
    >
      <div className={styles.content}>
        {delivery.map((item, index) => (
          <Fragment key={index}>
            <div className={styles.row}>
              <p className={styles.title}>{moment(delivery[0].date).format('D/MM/YYYY, LT')}</p>
              <p className={styles.subTitle}>{type(delivery[0])}</p>
            </div>
          </Fragment>
        ))}
        <PhotosBlock deliveryInfo={deliveryInfo} />
        <NotesBlock notes={deliveryInfo.errorNotes || ''} />
      </div>
    </Wrapper>
  );
};
