import React, { FC, useEffect, useState, useCallback } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import { DeliveryStatuses } from '../../../../constants';
import useDelivery from '../../../../hooks/useDelivery';
import { useStores } from '../../../../store';

import Pagination from '../../../common/Pagination';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';

import styles from './OrdersConsumer.module.sass';
import useUser from '../../../../hooks/useUser';

const PER_PAGE = 50;

export const OrdersConsumer: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const { getDeliveries, filters } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const user = useUser();

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const deliveries = await getDeliveries({
        page,
        perPage: PER_PAGE,
        sortField,
        order,
        customerId: id
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [deliveryStore, getDeliveries, order, page, sortField, id]);

  useEffect(() => {
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (e: object, nextPage: number) => {
    deliveryStore.set('filters')({ ...filters, page: nextPage });
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Link to={`/dashboard/consumers/${id}`}>
            <SVGIcon name="backArrow" className={styles.backArrowIcon} />
          </Link>
          <Typography className={styles.title}>Log of Deliveries</Typography>
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
          <div className={classNames(styles.item, styles.date)}>Date</div>
          <div className={classNames(styles.item, styles.time)}>Time</div>
          <div className={classNames(styles.item, styles.id)}>ID</div>
          <div className={classNames(styles.item, styles.status)}>Status</div>
          <div className={classNames(styles.item, styles.details)}>Details</div>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    return (
      <div className={classNames(styles.orders, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {deliveryStore.get('deliveries').length ? (
              deliveryStore.get('deliveries').map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>
                    {row.updatedAt && moment(row.updatedAt).tz(user.timezone as string).format('D MMMM, YYYY')}
                  </div>
                  <div className={classNames(styles.item, styles.time)}>
                    {row.updatedAt && moment(row.updatedAt).tz(user.timezone as string).format('HH:mm A')}
                  </div>
                  <div className={classNames(styles.item, styles.id)}>{row.order_uuid && row.order_uuid}</div>
                  <div className={classNames(styles.item, styles.status)}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.active]: row.status === 'ACTIVE',
                        [styles.pending]: row.status === 'PENDING',
                        [styles.inprogress]: row.status === 'PROCESSED',
                        [styles.suspicious]: row.status === 'SUSPICIOUS',
                        [styles.canceled]: row.status === 'CANCELED',
                        [styles.completed]: row.status === 'COMPLETED',
                        [styles.failed]: row.status === 'FAILED'
                      })}
                    />
                    {DeliveryStatuses[row.status]}
                  </div>
                  <div className={classNames(styles.item, styles.details)}>
                    <Link to={`/dashboard/orders/${row.order_uuid}`}>
                      <SVGIcon name={'details'} style={{ minHeight: '15px', minWidth: '15px' }} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <Typography className={styles.noOrders}>There is no order history yet</Typography>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}
      {renderOrders()}
    </div>
  );
};
