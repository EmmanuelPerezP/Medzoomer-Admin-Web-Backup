import styles from './Grid.module.sass';
import React, { FC, useCallback } from 'react';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@material-ui/icons';
import classNames from 'classnames';
import { useStores } from '../../../../store';
import useBatch from '../../../../hooks/useBatch';

const ArrowDesc = () => <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />;
const ArrowAsc = () => <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />;

export const GridHeader: FC = () => {
  const { batchStore } = useStores();
  const { filters } = useBatch();
  const { sortField, order } = filters;

  const isOrderAsc = order === 'asc';

  const handleChangeSort = useCallback(
    (newSortField: typeof sortField) => () => {
      if (newSortField === sortField) {
        batchStore.set('filters')({
          ...filters,
          order: isOrderAsc ? 'desc' : 'asc',
          page: 0
        });
      } else {
        batchStore.set('filters')({
          ...filters,
          sortField: newSortField,
          page: 0
        });
      }
    },
    [sortField, filters, isOrderAsc, batchStore]
  );

  return (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.id, styles.sortable)} onClick={handleChangeSort('batch_uuid')}>
        Delivery ID
        {sortField === 'batch_uuid' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={classNames(styles.date, styles.sortable)} onClick={handleChangeSort('createdAt')}>
        Created
        {sortField === 'createdAt' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={classNames(styles.courier, styles.sortable)} onClick={handleChangeSort('mainUser.name')}>
        Courier
        {sortField === 'mainUser.name' && (isOrderAsc ? <ArrowDesc /> : <ArrowAsc />)}
      </div>
      <div className={styles.distance}>Total Distance</div>
      <div className={styles.totalPrice}>Total Price</div>
      <div className={styles.totalCopay}>Total Copay</div>
      <div className={styles.status}>Status</div>
      <div className={styles.actions}>Actions</div>
    </div>
  );
};
