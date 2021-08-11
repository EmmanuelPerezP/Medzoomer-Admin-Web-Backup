import { Divider as DividerBase } from '@material-ui/core';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useBatch from '../../hooks/useBatch';

import { useBooleanState } from '../../hooks/useBooleanState';
import useDelivery from '../../hooks/useDelivery';
import { IBatch } from '../../interfaces';
import { isPopulatedObject, parseError } from './utils';
import { DeliveryInfo } from './components/DeliveryInfo';
import { Header } from './components/Header';
import { Map } from './components/Map';
import { MedicationsInfo } from './components/MedicationsInfo';
import { OnfleetTasks } from './components/OnfleetTasks';
import styles from './DeliveriesBatchDetails.module.sass';
import { BatchErrors, DeliveriesBatchDetailsParams } from './types';
import Loading from '../common/Loading';
import ConfirmationModal from '../common/ConfirmationModal';
import { DirectionInfo } from './components/DirectionInfo';

const emptyChar = '—';

const Divider = () => <DividerBase style={{ height: 20, backgroundColor: 'transparent' }} />;

const handleAddAll = () => '';

export const DeliveriesBatchDetails: FC = () => {
  const {
    params: { id }
  } = useRouteMatch<DeliveriesBatchDetailsParams>();
  const {} = useDelivery();
  const { getBatch } = useBatch();
  const [batch, setBatch] = useState<IBatch | null>(null);
  const [errors, setErrors] = useState<Partial<BatchErrors>>({});

  const [isLoading, showLoader, hideLoader] = useBooleanState(true);
  const [isCancelModalOpen, showCancelModalOpen, hideCancelModalOpen] = useBooleanState(false);
  const [isInvoicedModaOpen, showInvoicedModalOpen, hideInvoicedModalOpen] = useBooleanState(false);
  const [isExtraLoading, showExtraLoading, hideExtraLoading] = useBooleanState(false);

  const getBatchById = useCallback(async () => {
    try {
      showLoader();
      const result = await getBatch(id);
      if (!result || !result.data) throw new Error('Delivery not found');
      setBatch(result.data);
      hideLoader();
    } catch (e) {
      hideLoader();
      setErrors((prev) => ({ ...prev, batch: parseError(e) }));
      console.error('error', { e });
    }
  }, [showLoader, hideLoader, getBatch]);

  useEffect(() => {
    void getBatchById();
  }, []);

  const render = {
    deliberyInfo: () =>
      batch && (
        <>
          <DeliveryInfo
            batch={batch}
            onAddAll={showInvoicedModalOpen}
            onCancel={showCancelModalOpen}
            isExtraLoading={isExtraLoading}
          />
          <Divider />
        </>
      ),
    medicationsInfo: () =>
      batch && (
        <>
          <MedicationsInfo deliveries={batch.deliveries} />
          <Divider />
        </>
      ),
    tasksInfo: () =>
      batch && (
        <>
          <OnfleetTasks deliveries={batch.deliveries} pharmacy={batch.pharmacy || null} />
          <Divider />
        </>
      ),
    directionInfo: () =>
      batch && (
        <>
          <DirectionInfo batch={batch} />
        </>
      )
  };

  const batchActions = {
    cancelAll: async () => {
      if (!batch) return;
      try {
        hideCancelModalOpen();
      } catch (error) {
        console.error('Error while cancel all', { error });
      }
    },
    addAllToInvoice: async () => {
      if (!batch) return;
      try {
        hideInvoicedModalOpen();
      } catch (error) {
        console.error('Error while add all to invoice', { error });
      }
    }
  };

  return (
    <div className={styles.container}>
      <Header title="Delivery Details" backRoute={`/dashboard/deliveries`} />
      <div className={styles.content}>
        {!isLoading && errors.batch && (
          <>
            <div className={styles.error}>Error: {errors.batch}</div>
            <Divider />
          </>
        )}
        {isLoading ? (
          <div className={styles.loader}>
            <Loading />
          </div>
        ) : (
          batch && (
            <>
              {render.deliberyInfo()}
              {render.medicationsInfo()}
              {render.tasksInfo()}
              {render.directionInfo()}
            </>
          )
        )}
      </div>
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        handleModal={hideCancelModalOpen}
        onConfirm={batchActions.cancelAll}
        loading={isLoading}
        title={'Do you really want to cancel all orders?'}
      />
      <ConfirmationModal
        isOpen={isInvoicedModaOpen}
        handleModal={hideInvoicedModalOpen}
        onConfirm={batchActions.addAllToInvoice}
        loading={isLoading}
        title={'Do you really want to add all orders to invoice?'}
      />
    </div>
  );
};
