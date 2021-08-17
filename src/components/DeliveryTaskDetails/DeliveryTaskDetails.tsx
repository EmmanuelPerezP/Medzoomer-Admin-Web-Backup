import { Divider as DividerBase } from '@material-ui/core';
import React, { FC, Fragment } from 'react';
import { TaskInfo } from './components/TaskInfo';
import { Header } from './components/Header';
import { AdjustmentHistory } from './components/AdjustmentHistory';
import { data } from './DATA';
import styles from './DeliveryTaskDetails.module.sass';
import { DeliveryTaskDetailsParams } from './types';
import { OrderInfo } from './components/OrderInfo';
import { CustomerInfo } from '../OrderDetails/components/CustomerInfo';
import { Delivery } from './components/Delivery';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

export const DeliveryTaskDetails: FC<DeliveryTaskDetailsParams> = ({ id }) => {
  return (
    <div className={styles.container}>
      <Header title="Drop Off Task Details" backRoute={`/dashboard/deliveries`} />
      <div className={styles.content}>
        <TaskInfo item={data} />
        <Divider />

        {true && (
          <Fragment>
            <AdjustmentHistory items={data.adjustment} />
            <Divider />
          </Fragment>
        )}

        <Delivery delivery={data.timeline} />
        <Divider />

        <OrderInfo order={data.order} />
        <Divider />

        {/* <CustomerInfo customer={order.customer as Consumer} />
        <Divider /> */}
      </div>
    </div>
  );
};
