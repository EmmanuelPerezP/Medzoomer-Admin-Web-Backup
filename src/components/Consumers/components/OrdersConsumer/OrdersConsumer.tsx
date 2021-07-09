import React, { FC, useEffect, useState, useCallback } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { OrderStatuses } from '../../../../constants';
import { useStores } from '../../../../store';

import Pagination from '../../../common/Pagination';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';

import styles from './OrdersConsumer.module.sass';
import useUser from '../../../../hooks/useUser';
import useConsumer from '../../../../hooks/useConsumer';

const PER_PAGE = 50;

export const OrdersConsumer: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const { getConsumerOrders } = useConsumer();
  const { consumerOrderStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);

  const user = useUser();

  const getOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = consumerOrderStore.get('page');
      const orders = await getConsumerOrders(id, { perPage: PER_PAGE, page });
      consumerOrderStore.set('orders')(orders.data.orders);
      consumerOrderStore.set('total')(orders.data.totalSize);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [getConsumerOrders, id, consumerOrderStore]);

  useEffect(() => {
    getOrders().catch();
    // eslint-disable-next-line
  }, []);

  const handleChangePage = (e: object, nextPage: number) => {
    consumerOrderStore.set('page')(nextPage);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Link to={`/dashboard/consumers/${id}`}>
            <SVGIcon name="backArrow" className={styles.backArrowIcon} />
          </Link>
          <Typography className={styles.title}>Log of Orders</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={consumerOrderStore.get('page')}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={consumerOrderStore.get('total')}
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
            {consumerOrderStore.get('orders').length ? (
              consumerOrderStore.get('orders').map((order: any) => (
                <div key={order._id} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>
                    {order.updatedAt && moment(order.updatedAt).tz(user.timezone as string).format('D MMMM, YYYY')}
                  </div>
                  <div className={classNames(styles.item, styles.time)}>
                    {order.updatedAt && moment(order.updatedAt).tz(user.timezone as string).format('HH:mm A')}
                  </div>
                  <div className={classNames(styles.item, styles.id)}>{order.order_uuid && order.order_uuid}</div>
                  <div className={classNames(styles.item, styles.status)}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.ready]: order.status === 'ready',
                        [styles.pending]: order.status === 'pending',
                        [styles.route]: order.status === 'route',
                        [styles.new]: order.status === 'new',
                        [styles.canceled]: order.status === 'canceled',
                        [styles.delivered]: order.status === 'delivered',
                        [styles.failed]: order.status === 'failed'
                      })}
                    />
                    {OrderStatuses[order.status]}
                  </div>
                  <div className={classNames(styles.item, styles.details)}>
                    <Link to={`/dashboard/orders/${order.order_uuid}`}>
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
