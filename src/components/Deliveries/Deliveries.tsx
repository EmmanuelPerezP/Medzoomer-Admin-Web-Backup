import React, { FC, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import { DeliveryStatuses } from '../../constants';
import useDelivery from '../../hooks/useDelivery';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './Deliveries.module.sass';

const PER_PAGE = 10;

export const Deliveries: FC = () => {
  const { path } = useRouteMatch();
  const { getDeliveries, filters } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const deliveries = await getDeliveries({
        page,
        perPage: PER_PAGE,
        search,
        sortField,
        order
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [deliveryStore, getDeliveries, order, page, search, sortField]);

  useEffect(() => {
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  const handleChangePage = (e: object, nextPage: number) => {
    deliveryStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    deliveryStore.set('filters')({ ...filters, page: 0, search: e.target.value });
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Search
            classes={{
              input: styles.input,
              root: styles.search,
              inputRoot: styles.inputRoot
            }}
            value={filters.search}
            onChange={handleChangeSearch}
          />
          <Typography className={styles.title}>Consumer Orders</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={deliveryStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.date}>Date</div>
          <div className={styles.uuid}>ID</div>
          <div className={styles.consumer}>Consumer</div>
          <div className={styles.courier}>Courier</div>
          <div className={styles.status}>Status</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderConsumers = () => {
    return (
      <div className={classNames(styles.consumers, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {deliveryStore.get('deliveries')
              ? deliveryStore.get('deliveries').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={classNames(styles.item, styles.date)}>{moment(row.createdAt).format('lll')}</div>
                    <div className={classNames(styles.item, styles.uuid)}>{row.order_uuid}</div>
                    <div className={classNames(styles.item, styles.consumer)}>{row.customer.fullName}</div>
                    <div className={classNames(styles.item, styles.courier)}>{row.user}</div>
                    <div className={classNames(styles.item, styles.status)}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: row.status === 'ACTIVE',
                          [styles.pending]: row.status === 'PENDING',
                          [styles.inprogress]: row.status === 'PROCESSED',
                          [styles.suspicious]: row.status === 'SUSPICIOUS',
                          [styles.canceled]: row.status === 'CANCELED',
                          [styles.completed]: row.status === 'COMPLETED'
                        })}
                      />
                      {row.status && DeliveryStatuses.PENDING}
                    </div>
                    <div className={classNames(styles.item, styles.actions)}>
                      <Link to={`${path}/${row._id}`}>
                        <SVGIcon name={'details'} style={{ height: '15px', width: '15px' }} />
                      </Link>
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}
      {renderConsumers()}
    </div>
  );
};
