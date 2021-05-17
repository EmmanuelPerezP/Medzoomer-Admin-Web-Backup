import React, { FC, useCallback, useEffect, useState } from 'react';
import useDelivery from '../../../../hooks/useDelivery';
import RowBatch from './components/RowBatch';
import { get } from 'lodash';
import Loading from '../../../common/Loading';
import { useStores } from '../../../../store';
import EmptyList from '../../../common/EmptyList';
import styles from './DeliveriesDispatch.module.sass';

const PER_PAGE = 10;

interface ISearchMeta {
  order_uuid: number | null;
  isSearchByOrder: boolean;
}

// @ts-ignore
const DeliveriesDispatch: FC<> = () => {
  const { getDeliveriesBatches, filters } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [searchMeta, setSearchMeta] = useState<ISearchMeta>({
    order_uuid: null,
    isSearchByOrder: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const deliveryDispatchList = deliveryStore.get('deliveriesDispatch');

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getDeliveriesBatches({
        ...filters,
        perPage: PER_PAGE
      });
      deliveryStore.set('deliveriesDispatch')(result.data);
      deliveryStore.set('meta')(result.meta);
      setSearchMeta(result.searchMeta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [getDeliveriesBatches, filters]);

  useEffect(() => {
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  return !isLoading ? (
    get(deliveryDispatchList, 'length') ? (
      deliveryDispatchList.map((data, index) => <RowBatch key={index} data={data} searchMeta={searchMeta} />)
    ) : (
      <div className={styles.deliveries}>
        <EmptyList />
      </div>
    )
  ) : (
    <div className={styles.deliveries}>
      <Loading />
    </div>
  );
};

export default DeliveriesDispatch;
