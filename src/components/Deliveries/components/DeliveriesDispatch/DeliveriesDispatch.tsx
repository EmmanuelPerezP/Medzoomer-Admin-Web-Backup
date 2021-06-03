import React, { FC, useCallback, useEffect, useState } from 'react';
import useDelivery from '../../../../hooks/useDelivery';
import RowBatch from './components/RowBatch';
import { get } from 'lodash';
import Loading from '../../../common/Loading';
import { useStores } from '../../../../store';
import EmptyList from '../../../common/EmptyList';
import styles from './DeliveriesDispatch.module.sass';
import { parseFilterToValidQuery } from '../../utils';

const PER_PAGE = 10;

interface ISearchMeta {
  order_uuid: number | null;
  isSearchByOrder: boolean;
}

let timerId: NodeJS.Timeout;

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

  const getDeliveriesList = useCallback(
    async (withLoader: boolean = false) => {
      withLoader && setIsLoading(true);
      try {
        const result = await getDeliveriesBatches(
          parseFilterToValidQuery({
            ...filters,
            perPage: PER_PAGE
          })
        );
        deliveryStore.set('deliveriesDispatch')(result.data);
        deliveryStore.set('meta')(result.meta);
        setSearchMeta(result.searchMeta);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
      // eslint-disable-next-line
    },
    [getDeliveriesBatches, filters]
  );

  useEffect(() => {
    runAutoUpdate();
    // eslint-disable-next-line
  }, [deliveryStore]);

  const runAutoUpdate = () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      getDeliveriesList().catch();
    }, 15000);
  };

  useEffect(() => {
    getDeliveriesList(true)
      .then()
      .catch();
    // eslint-disable-next-line
  }, [filters]);

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
