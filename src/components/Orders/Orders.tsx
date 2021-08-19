import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';

import { Grid, Header } from './components';
import { GetOrdersResponse } from './types';
import { OrdersConfiguration, parseBatchFilter, parseOrderFilter } from './utils';

import styles from './Orders.module.sass';
import { useBooleanState } from '../../hooks/useBooleanState';
import { IOrder, IOrders } from '../../interfaces';
import useOrder from '../../hooks/useOrder';
import { useStores } from '../../store';
import { FilterModal } from './components/FilterModal';
import { BottomDrawer } from './components/BottomDrawer';
import { useItemsSelection } from '../../hooks/useItemsSelection';
import { get } from 'lodash';
import useDelivery from '../../hooks/useDelivery';
import useBatch from '../../hooks/useBatch';
import { canCreateDelivery } from '../OrderDetails/utils';

export const Orders: FC = () => {
  const { orderStore } = useStores();
  const { getOrders, filters } = useOrder();
  const { getBatches, filters: batchFilters } = useBatch();
  const { setDeliveriesToDispatch } = useDelivery();
  const [orders, setOrders] = useState<IOrders>([]);

  const [selectedIDs, selectedActions] = useItemsSelection<string>();

  const [isFilterOpen, showFilter, hideFilter] = useBooleanState();
  const [isLoading, showLoader, hideLoader] = useBooleanState();
  const [isDrawerOpen, showDrawer, hideDrawer] = useBooleanState();

  const getOrdersList = async () => {
    try {
      showLoader();
      const result: GetOrdersResponse = await getOrders(parseOrderFilter(filters));
      if (!result.data) throw result;
      const { data, meta } = result;
      setOrders(data);
      orderStore.set('meta')(meta);
      hideLoader();
    } catch (e) {
      console.error('Error: Orders.getOrdersList()', { e });
      hideLoader();
    }
  };

  useEffect(() => {
    void getOrdersList();
  }, [filters]);

  const handleCreateDelivery = useCallback(async () => {
    try {
      showLoader();
      await setDeliveriesToDispatch(selectedIDs);
      const result = await getOrders(parseOrderFilter(filters));
      if (result.data) {
        setOrders(result.data);
        orderStore.set('meta')(result.meta);
      }
      selectedActions.deselectAll();
      hideLoader();
    } catch (e) {
      hideLoader();
    }
  }, [selectedIDs, filters, orderStore, selectedActions]);

  const handleSelectOrder = useCallback(
    (order: IOrder) => {
      selectedActions.forceSelectOne(get(order, 'delivery._id'));
    },
    [selectedActions]
  );

  const handleSelectAll = useCallback(() => {
    const deliveriesIDs: string[] = [];
    orders.map((order) => {
      if (canCreateDelivery(order)) {
        deliveriesIDs.push(get(order, 'delivery._id'));
      }
    });
    selectedActions.replaceAllWith(deliveriesIDs);
  }, [selectedActions, orders]);

  useEffect(() => {
    if (selectedIDs.length) showDrawer();
    else hideDrawer();
  }, [selectedIDs]);

  return (
    <div className={styles.container}>
      <Header configuration={OrdersConfiguration} handleOpenFilter={showFilter} />
      <Grid
        items={orders}
        isLoading={isLoading}
        onUnselectAll={selectedActions.deselectAll}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOrder}
        selectedOrders={selectedIDs}
      />
      <BottomDrawer
        selectedItems={selectedIDs.length}
        onCreate={handleCreateDelivery}
        onUnselectAll={selectedActions.deselectAll}
        isOpen={isDrawerOpen}
      />
      <FilterModal isOpen={isFilterOpen} onClose={hideFilter} />
    </div>
  );
};
