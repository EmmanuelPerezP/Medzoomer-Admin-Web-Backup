import styles from './OrderDetails.module.sass';
import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Divider as DividerBase } from '@material-ui/core';

import { Header } from './components/Header';
import { OrderDetailsParams, OrderErrors } from './types';
import { OrderInfo } from './components/OrderInfo';
import { useBooleanState } from '../../hooks/useBooleanState';
import useOrder from '../../hooks/useOrder';
import { Consumer, Delivery, IOrder, Pharmacy, PharmacyUser } from '../../interfaces';
import Loading from '../common/Loading';

import { CustomerInfo } from './components/CustomerInfo';
import { MedicationsInfo } from './components/MedicationsInfo';
import { PharmacyInfo } from './components/PharmacyInfo';
import { StatusHistory } from './components/StatusHistory';
import { DeliveryInfo } from './components/DeliveryInfo';
import { TaskInfo } from './components/TaskInfo';
import { checkIfOrderAlreadyInBatch, isPopulatedObject, parseError } from './utils';
import { IBatch } from '../../interfaces/batch';
import { setDeliveriesToDispatch } from '../../store/actions/delivery';
import { get } from 'lodash';
import ConfirmationModal from '../common/ConfirmationModal';
import useDelivery from '../../hooks/useDelivery';

const emptyChar = '—';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

export const OrderDetails: FC = () => {
  const {
    params: { id }
  } = useRouteMatch<OrderDetailsParams>();
  const { canceledOrder, forcedInvoicedOrder } = useDelivery();
  const [order, setOrder] = useState<IOrder | null>(null);
  const { getOrder } = useOrder();
  const [errors, setErrors] = useState<Partial<OrderErrors>>({});

  const [isCancelModalOpen, showCancelModalOpen, hideCancelModalOpen] = useBooleanState(false);
  const [isInvoicedModaOpen, showInvoicedModalOpen, hideInvoicedModalOpen] = useBooleanState(false);
  const [isLoading, showLoader, hideLoader] = useBooleanState(true);
  const [isCancelLoading, showCancelLoader, hideCancelLoader] = useBooleanState(false);
  const [isInvoicedLoading, showInvoicedLoader, hideInvoicedLoader] = useBooleanState(false);
  const [isAlreadyInBatch, setInBatch, setNotInBatch] = useBooleanState(checkIfOrderAlreadyInBatch(order));

  const getOrderById = useCallback(async () => {
    try {
      showLoader();
      const result = await getOrder(id);
      if (!result || !result.data) throw new Error('Order not found');
      setOrder(result.data);
      hideLoader();
    } catch (e) {
      console.error('error', { e });
      setErrors((prev) => ({ ...prev, order: parseError(e) }));
      hideLoader();
    }
  }, [showLoader, hideLoader, getOrder]);

  const orderActions = {
    cancel: async () => {
      if (!order) return;
      try {
        hideCancelModalOpen();
        showCancelLoader();
        await canceledOrder(id);
        const result = await getOrder(id);
        if (!result || !result.data) throw new Error('Order not found');
        setOrder(result.data);
        hideCancelLoader();
      } catch (e) {
        setErrors((prev) => ({ ...prev, order: parseError(e) }));
        hideCancelLoader();
      }
    },
    createDelivery: async () => {
      if (isAlreadyInBatch) return;
      try {
        showCancelLoader();
        await setDeliveriesToDispatch([get(order, 'delivery._id')]);
        const result = await getOrder(id);
        if (!result || !result.data) throw new Error('Order not found');
        setOrder(result.data);
        hideCancelLoader();
      } catch (e) {
        setErrors((prev) => ({ ...prev, order: parseError(e) }));
        hideCancelLoader();
      }
    },
    addToInvoice: async () => {
      if (!order) return;
      try {
        hideInvoicedModalOpen();
        showInvoicedLoader();
        await forcedInvoicedOrder(id);
        const result = await getOrder(id);
        if (!result || !result.data) throw new Error('Order not found');
        setOrder(result.data);
        hideInvoicedLoader();
      } catch (e) {
        setErrors((prev) => ({ ...prev, order: parseError(e) }));
        hideInvoicedLoader();
      }
    }
  };

  useEffect(() => {
    void getOrderById();
  }, []);

  useEffect(() => {
    if (checkIfOrderAlreadyInBatch(order)) {
      setInBatch();
    } else {
      setNotInBatch();
    }
  }, [order]);

  const render = {
    customerInfo: () =>
      order &&
      isPopulatedObject(order.customer) && (
        <>
          <CustomerInfo customer={order.customer as Consumer} />
          <Divider />
        </>
      ),
    medicationsInfo: () =>
      order && (
        <>
          <MedicationsInfo medications={order.prescriptions} />
          <Divider />
        </>
      ),
    pharmacyInfo: () =>
      order &&
      isPopulatedObject(order.pharmacy) && (
        <>
          <PharmacyInfo pharmacy={order.pharmacy as Pharmacy} pharmacist={order.pharmacist} />
          <Divider />
        </>
      ),
    deliveryInfo: () =>
      isAlreadyInBatch &&
      order &&
      isPopulatedObject(order.$batch) && (
        <>
          <DeliveryInfo batch={order.$batch as IBatch} />
          <Divider />
        </>
      ),
    taskInfo: () =>
      isAlreadyInBatch &&
      order &&
      isPopulatedObject(order.delivery) && (
        <>
          <TaskInfo
            order={order}
            delivery={order.delivery as Delivery}
            isLoading={isInvoicedLoading}
            onForceInvoiced={showInvoicedModalOpen}
          />
          <Divider />
        </>
      )
  };

  return (
    <div className={styles.container}>
      <Header title="Order Details" backRoute={`/dashboard/orders/?type=1`} />
      <div className={styles.content}>
        {!isLoading && errors.order && (
          <>
            <div className={styles.error}>Error: {errors.order}</div>
            <Divider />
          </>
        )}
        {isLoading ? (
          <div className={styles.loader}>
            <Loading />
          </div>
        ) : (
          order && (
            <>
              <OrderInfo
                item={order}
                onCancelOrder={showCancelModalOpen}
                onCreateDelivery={orderActions.createDelivery}
                isAlreadyInBatch={isAlreadyInBatch}
                isLoading={isCancelLoading}
              />
              <Divider />

              {render.customerInfo()}
              {render.medicationsInfo()}
              {render.pharmacyInfo()}
              {render.deliveryInfo()}
              {render.taskInfo()}

              {/* <StatusHistory /> */}
            </>
          )
        )}
      </div>
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        handleModal={hideCancelModalOpen}
        onConfirm={orderActions.cancel}
        loading={isLoading}
        title={'Do you really want to cancel the order?'}
      />
      <ConfirmationModal
        isOpen={isInvoicedModaOpen}
        handleModal={hideInvoicedModalOpen}
        onConfirm={orderActions.addToInvoice}
        loading={isLoading}
        title={'Do you really want to send forced invoice for this order?'}
      />
    </div>
  );
};
