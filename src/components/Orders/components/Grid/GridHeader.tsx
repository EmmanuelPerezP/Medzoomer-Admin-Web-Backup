import styles from './Grid.module.sass';
import React, { FC, useCallback } from 'react';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@material-ui/icons';
import classNames from 'classnames';

import { IGridHeaderProps } from './types';
import { Checkbox } from '../Checkbox';
import useOrder from '../../../../hooks/useOrder';
import { useStores } from '../../../../store';

const ArrowDesc = () => <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />;
const ArrowAsc = () => <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />;

export const GridHeader: FC<IGridHeaderProps> = ({ haveSelectedOrders, onUnselectAll }) => {
  const { orderStore } = useStores();
  const { filters } = useOrder();
  const { sortField, order } = filters;

  const isOrderAsc = order === 'asc';

  const handleChangeSort = useCallback(
    (newSortField: typeof sortField) => () => {
      if (newSortField === sortField) {
        orderStore.set('filters')({
          ...filters,
          order: isOrderAsc ? 'desc' : 'asc',
          page: 0
        });
      } else {
        orderStore.set('filters')({
          ...filters,
          sortField: newSortField,
          page: 0
        });
      }
    },
    [sortField, filters, isOrderAsc, orderStore]
  );

  const handleUnselectAll = useCallback(() => {
    onUnselectAll();
  }, [onUnselectAll]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.checkbox}>
        <Checkbox
          disabled={!haveSelectedOrders}
          value={haveSelectedOrders}
          onChange={handleUnselectAll}
          showAlternativeCheckedIcon
        />
      </div>
      <div className={classNames(styles.uuid, styles.sortable)} onClick={handleChangeSort('order_uuid')}>
        Order ID
        {sortField === 'order_uuid' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={classNames(styles.date, styles.sortable)} onClick={handleChangeSort('createdAt')}>
        Created
        {sortField === 'createdAt' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={classNames(styles.pharmacy, styles.sortable)} onClick={handleChangeSort('pharmacy.name')}>
        Pharmacy
        {sortField === 'pharmacy.name' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={styles.destination}>Destination</div>
      <div className={classNames(styles.dispatchDate, styles.sortable)} onClick={handleChangeSort('dispatchAt')}>
        Dispatch Date
        {sortField === 'dispatchAt' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={styles.deliveryId}>Delivery ID</div>
      <div className={classNames(styles.status, styles.sortable)} onClick={handleChangeSort('status')}>
        Status
        {sortField === 'status' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={styles.actions}>Actions</div>
    </div>
  );
};
