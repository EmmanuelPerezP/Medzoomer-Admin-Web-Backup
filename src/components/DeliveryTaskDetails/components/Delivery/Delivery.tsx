import styles from './Delivery.module.sass';
import React, { FC, Fragment, useMemo } from 'react';

import { IDeliveryProps } from './types';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import moment from 'moment';
import classNames from 'classnames';

export const Delivery: FC<IDeliveryProps> = ({ delivery }) => {
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

  return (
    <Wrapper
      title="Delivery"
      subTitle="Timeline"
      iconName="order"
      ContentLeftComponent={<div className={styles.leftComponent}>{renderTypeItems()}</div>}
    >
      <div className={styles.content}>
        {delivery.map((item, index) => {
          const type = () => {
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
            <Fragment key={index}>
              <div className={styles.row}>
                <p className={styles.title}>{moment(item.date).format('D/MM/YYYY, LT')}</p>
                <p className={styles.subTitle}>{type()}</p>
              </div>
              {item.type === 'completed' && item.signature ? (
                <div className={styles.row}>
                  <p className={styles.title}>Signature</p>
                  <p className={styles.imgBox}>
                    <img src={item.signature} alt="signature" />
                  </p>
                </div>
              ) : null}
              {item.type === 'completed' && item.photo ? (
                <div className={styles.row}>
                  <p className={styles.title}>Photo</p>
                  <p className={styles.imgBox}>
                    <img src={item.photo} alt="photo" />
                  </p>
                </div>
              ) : null}
              {item.type === 'completed' && item.note ? (
                <div className={styles.row}>
                  <p className={styles.title}>Note</p>
                  <p className={styles.subTitle}>{item.note}</p>
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </Wrapper>
  );
};
