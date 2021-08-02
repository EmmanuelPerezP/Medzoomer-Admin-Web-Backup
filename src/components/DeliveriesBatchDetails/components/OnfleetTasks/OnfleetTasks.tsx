import { IconButton, Tooltip, Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import SVGIcon from '../../../common/SVGIcon';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { emptyChar } from '../../utils';
import styles from './OnfleetTasks.module.sass';
import { IOnfleetTasksProps } from './types';

export const OnfleetTasks: FC<IOnfleetTasksProps> = ({ tasks }) => {
  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnOrderId, styles.label)}>Order ID</div>
      <div className={classNames(styles.columnDeliveryLeg, styles.label)}>Delivery Leg</div>
      <div className={classNames(styles.columnDestination, styles.label)}>Destination</div>
      <div className={classNames(styles.columnPrice, styles.label)}>Price</div>
      <div className={classNames(styles.columnStatus, styles.label)}>Status</div>
      <div className={classNames(styles.columnAction, styles.label)} />
    </div>
  );

  const renderIconItems = () => {
    return tasks.map((item, index) => {
      // const iconName = () => {
      //   switch (item.type) {
      //     case 'type1':
      //       return 'customerDark';
      //     case 'type2':
      //       return 'pharmacyDark';
      //     default:
      //       return 'default';
      //   }
      // };

      return (
        <div key={index} className={styles.iconBox}>
          {index !== 0 &&  <div className={styles.divider}/>}
          <SVGIcon name={item.order_uuid ? 'customerDark' : 'pharmacyDark'} />
        </div>
      );
    });
  };

  const renderItems = () => {
    return tasks.map((item, index) => {
      const orderId = item.orderId;
      const order_uuid = item.order_uuid;
      const deliveryLeg = item.deliveryLeg || emptyChar;
      const price = item.price ? `$${item.price.toFixed(2)}` : emptyChar;
      const status = () => {
        switch (item.status) {
          case 'completed':
            return 'Completed';
          case 'transit':
            return 'In Transit';
          case 'assigned':
            return 'Assigned';
          default:
            return;
        }
      };

      return (
        <div className={styles.itemContainer} key={index}>
          <div className={classNames(styles.columnOrderId, styles.value)}>
            {order_uuid ? (
              <Link to={`/dashboard/orders/${orderId}`} style={{ textDecoration: 'none' }}>
                <Typography color="secondary">{order_uuid}</Typography>
              </Link>
            ) : (
              emptyChar
            )}
          </div>

          <div className={classNames(styles.columnDeliveryLeg, styles.value)}>{deliveryLeg}</div>

          <div className={classNames(styles.columnDestination, styles.value)}>{emptyChar}</div>

          <div className={classNames(styles.columnPrice, styles.value)}>{price}</div>

          <div className={classNames(styles.columnStatus, styles.value)}>
            <div
              className={classNames(styles.itemStatus, {
                [styles.progress]: item.status === 'transit',
                [styles.completed]: item.status === 'completed',
                [styles.assigned]: item.status === 'assigned'
              })}
            />
            {status()}
          </div>

          <div className={classNames(styles.columnAction, styles.value)}>
            <Link to={`/dashboard/deliveries/task/${item._id}`}>
              <Tooltip title="Details" placement="top" arrow>
                <IconButton size="small">
                  <SVGIcon name={'details'} />
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        </div>
      );
    });
  };

  const renderEmptyMessage = () => <div className={styles.emptyMessage}>Onfleet tasks list is empty</div>;

  return (
    <Wrapper
      title="Delivery"
      subTitle="Onfleet Tasks"
      iconName="onfleetTasks"
      HeaderRightComponent={
        <div className={styles.totalContainer}>
          <div className={styles.label}>Total Onfleet Distance</div>
          <div className={styles.value}>8.4 mi</div>
        </div>
      }
      ContentLeftComponent={<div className={styles.leftComponent}>{renderIconItems()}</div>}
    >
      <div className={styles.content}>
        {renderHeader()}
        {tasks.length ? renderItems() : renderEmptyMessage()}
      </div>
    </Wrapper>
  );
};
