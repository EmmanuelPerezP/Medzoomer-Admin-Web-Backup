import { Divider as DividerBase } from '@material-ui/core';
import React, { FC, Fragment, useState, useEffect } from 'react';
import { TaskInfo } from './components/TaskInfo';
import { Header } from './components/Header';
import { AdjustmentHistory } from './components/AdjustmentHistory';
import { data } from './DATA';
import styles from './DeliveryTaskDetails.module.sass';
import { DeliveryTaskDetailsParams } from './types';
import { OrderInfo } from './components/OrderInfo';
import { CustomerInfo } from '../OrderDetails/components/CustomerInfo';
import { Delivery } from './components/Delivery';
import { useBooleanState } from '../../hooks/useBooleanState';
import { useRouteMatch } from 'react-router-dom';
import { PriceHistories } from '../../interfaces';
import useDelivery from '../../hooks/useDelivery';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

const handleAdd = () => '';
const handleSend = () => '';
const handleMark = () => '';

export const DeliveryTaskDetails: FC = () => {
  const {
    params: { id }
  } = useRouteMatch<DeliveryTaskDetailsParams>();

  const { getAdjustmentHistory } = useDelivery()

  const [priceHistory, setPriceHistory] = useState<PriceHistories>([])

  const [isPriceHistoryLoading, showPriceHistoryLoader, hidePriceHistoryLoader] = useBooleanState(false)

  const getHistory = async () => {
    try {
      showPriceHistoryLoader()
      const result = await getAdjustmentHistory(id)
      if(result.data) setPriceHistory(result.data)
      hidePriceHistoryLoader()
    }
    catch(e) {
      hidePriceHistoryLoader()
    }
  }

  useEffect(() => {
    void getHistory()
  }, [])

  return (
    <div className={styles.container}>
      <Header title="Drop Off Task Details" backRoute={`/dashboard/deliveries`} />
      <div className={styles.content}>
        <TaskInfo item={data} onAdd={handleAdd} onSend={handleSend} onMark={handleMark} />
        <Divider />

        <AdjustmentHistory items={priceHistory} />
        <Divider />

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
