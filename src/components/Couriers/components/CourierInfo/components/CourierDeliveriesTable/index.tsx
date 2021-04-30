import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import useDelivery from '../../../../../../hooks/useDelivery';
import { useStores } from '../../../../../../store';
import CourierLogTable from '../CourierLogTable';
const PER_PAGE = 50;

const CourierDeliveriesTable: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const { getDeliveriesCourier, filters } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const deliveries = await getDeliveriesCourier({
        page,
        perPage: PER_PAGE,
        sortField,
        order,
        sub: id
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [deliveryStore, getDeliveriesCourier, order, page, sortField]);

  useEffect(() => {
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, [page, order, sortField]);

  const handleChangePage = (e: object, nextPage: number) => {
    deliveryStore.set('filters')({ ...filters, page: nextPage });
  };

  return (
    <CourierLogTable
      page={page}
      filteredCount={deliveryStore.get('meta').filteredCount}
      handleChangePage={handleChangePage}
      clickBackTo={`/dashboard/couriers/${id}`}
      logTitle={'Log of Deliveries'}
      perPage={PER_PAGE}
      data={deliveryStore.get('deliveries')}
      isLoading={isLoading}
      dataEmptyMessage={'There is no delivery history yet'}
      isDeliveries
    />
  );
};

export default CourierDeliveriesTable;
