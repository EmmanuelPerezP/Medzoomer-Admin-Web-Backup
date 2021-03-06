import { Divider as DividerBase } from '@material-ui/core';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { TaskInfo } from './components/TaskInfo';
import { Header } from './components/Header';
import { AdjustmentHistory } from './components/AdjustmentHistory';
import styles from './DeliveryTaskDetails.module.sass';
import { DeliveryTaskDetailsParams, TaskErrors } from './types';
import { OrderInfo } from './components/OrderInfo';
import { CustomerInfo } from '../OrderDetails/components/CustomerInfo';
import { Delivery as DeliveryBase } from './components/Delivery';
import { useBooleanState } from '../../hooks/useBooleanState';
import { useRouteMatch } from 'react-router-dom';
import { Delivery, PriceHistories } from '../../interfaces';
import useDelivery from '../../hooks/useDelivery';
import Loading from '../common/Loading';
import { isPopulatedObject, parseError } from './utils';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

export const DeliveryTaskDetails: FC = () => {
  const {
    params: { id }
  } = useRouteMatch<DeliveryTaskDetailsParams>();

  const { getAdjustmentHistory, getDelivery } = useDelivery();

  const [deliveryInfo, setDeliveryInfo] = useState<Delivery | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistories>([]);

  const [errors, setErrors] = useState<Partial<TaskErrors>>({});

  const [isLoading, showLoader, hideLoader] = useBooleanState(true);

  const getDeliveryInfo = useCallback(async () => {
    try {
      showLoader();
      const result = await getDelivery(id);
      if (result.data) {
        setDeliveryInfo(result.data);
      } else throw result;
      hideLoader();
    } catch (e) {
      hideLoader();
      setErrors((prev) => ({ ...prev, batch: parseError(e) }));
      console.error('error', { e });
    }
  }, [showLoader, hideLoader, setErrors, getDelivery]); // eslint-disable-line

  const updateDeliveryInfo = useCallback(async () => {
    try {
      const result = await getDelivery(id);
      if (result.data) setDeliveryInfo(result.data);
    } catch (e) {
      console.error('Error while updating info', { e });
    }
  }, []); // eslint-disable-line

  const getHistory = useCallback(async () => {
    try {
      const result = await getAdjustmentHistory(id);
      if (result.data) setPriceHistory(result.data);
    } catch (e) {
      console.error('Error while updating history', { e });
    }
  }, [getAdjustmentHistory, setPriceHistory]); // eslint-disable-line

  useEffect(() => {
    void getHistory();
  }, []); // eslint-disable-line

  useEffect(() => {
    void getDeliveryInfo();
  }, []); // eslint-disable-line

  const render = {
    taskInfo: () =>
      deliveryInfo && (
        <>
          <TaskInfo delivery={deliveryInfo} updateDeliveryInfo={updateDeliveryInfo} getHistory={getHistory} />
          <Divider />
        </>
      ),
    adjustmentHistoryInfo: () =>
      deliveryInfo && (
        <>
          <AdjustmentHistory items={priceHistory} />
          <Divider />
        </>
      ),
    deliveryInfo: () =>
      deliveryInfo && (
        <>
          <DeliveryBase deliveryInfo={deliveryInfo} />
          <Divider />
        </>
      ),
    orderInfo: () =>
      deliveryInfo &&
      deliveryInfo.order && (
        <>
          <OrderInfo delivery={deliveryInfo} />
          <Divider />
        </>
      ),
    customerInfo: () =>
      deliveryInfo &&
      isPopulatedObject(deliveryInfo.customer) && (
        <>
          <CustomerInfo customer={deliveryInfo.customer} />
          <Divider />
        </>
      )
  };

  return (
    <div className={styles.container}>
      <Header title="Drop Off Task Details" />
      <div className={styles.content}>
        {!isLoading && errors.task && (
          <>
            <div className={styles.error}>Error: {errors.task}</div>
            <Divider />
          </>
        )}
        {isLoading ? (
          <div className={styles.loader}>
            <Loading />
          </div>
        ) : (
          deliveryInfo && (
            <>
              {render.taskInfo()}
              {render.adjustmentHistoryInfo()}
              {render.deliveryInfo()}
              {render.orderInfo()}
              {render.customerInfo()}
            </>
          )
        )}
      </div>
    </div>
  );
};
