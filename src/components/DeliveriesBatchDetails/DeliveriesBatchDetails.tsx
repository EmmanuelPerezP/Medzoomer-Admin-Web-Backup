import { Divider as DividerBase } from '@material-ui/core';
import React, { FC } from 'react';
import { DeliveryInfo } from './components/DeliveryInfo';
import { Header } from './components/Header';
import { MedicationsInfo } from './components/MedicationsInfo';
import { OnfleetTasks } from './components/OnfleetTasks';
import { data } from './DATA';
import styles from './DeliveriesBatchDetails.module.sass';
import { DeliveriesBatchDetailsParams } from './types';

const emptyChar = '—';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

const handleAddAll = () => '';
const handleCancelTasks = () => '';

export const DeliveriesBatchDetails: FC<DeliveriesBatchDetailsParams> = ({ id }) => {
  return (
    <div className={styles.container}>
      <Header title="Delivery Details" backRoute={`/dashboard/deliveries`} />
      <div className={styles.content}>
        <DeliveryInfo id={data.deliveryId} onAddAll={handleAddAll} onCancel={handleCancelTasks} />
        <Divider />

        <MedicationsInfo medications={data.prescriptions} />
        <Divider />

        <OnfleetTasks tasks={data.tasks} />
        <Divider />
      </div>
    </div>
  );
};
