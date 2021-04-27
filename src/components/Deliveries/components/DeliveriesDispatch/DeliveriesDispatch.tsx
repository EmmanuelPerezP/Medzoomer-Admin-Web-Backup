// import { IconButton } from '@material-ui/core';
// import ClearIcon from '@material-ui/icons/Clear';
// import DoneIcon from '@material-ui/icons/Done';
// import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import useDelivery from '../../../../hooks/useDelivery';
import RowBatch from './components/RowBatch';
// import EmptyList from '../../../common/EmptyList';
import Loading from '../../../common/Loading';
import styles from './components/RowBatch/RowBatch.module.sass';
import { useStores } from '../../../../store';
// import TableItem from '../TableItem';
// import styles from './DeliveriesDispatch.module.sass';

const PER_PAGE = 10;

// @ts-ignore
const DeliveriesDispatch: FC<> = () => {
  const { getDeliveriesBatches, filters } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getDeliveriesBatches({
        ...filters,
        perPage: PER_PAGE
      });
      deliveryStore.set('deliveriesDispatch')(result.data);
      deliveryStore.set('meta')(result.meta);
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
    deliveryStore.get('deliveriesDispatch') && deliveryStore.get('deliveriesDispatch').length ? (
      deliveryStore.get('deliveriesDispatch').map((data, index) => <RowBatch key={index} data={data} />)
    ) : null
  ) : (
    <div className={styles.deliveries}>
      <Loading />
    </div>
  );
};

export default DeliveriesDispatch;
