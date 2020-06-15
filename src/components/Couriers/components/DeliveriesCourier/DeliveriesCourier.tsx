import React, { FC, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import useDelivery from '../../../../hooks/useDelivery';
import { useStores } from '../../../../store';

import Pagination from '../../../common/Pagination';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';

import styles from './DeliveriesCourier.module.sass';

const PER_PAGE = 50;

export const DeliveriesCourier: FC = () => {
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
        order
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [deliveryStore, getDeliveriesCourier, order, page, sortField]);

  useEffect(() => {
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, [page, order, sortField]);

  const handleChangePage = (e: object, nextPage: number) => {
    deliveryStore.set('filters')({ ...filters, page: nextPage });
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Link to={`/dashboard/couriers/${id}`}>
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
          <div className={classNames(styles.item, styles.trip)}>Trip number</div>
          <div className={classNames(styles.item, styles.earned)}>Earned</div>
        </div>
      </div>
    );
  };

  const renderDeliveries = () => {
    return (
      <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {deliveryStore.get('deliveries').length ? (
              deliveryStore.get('deliveries').map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>
                    {row.updatedAt && moment(row.updatedAt).format('D MMMM, YYYY')}
                  </div>
                  <div className={classNames(styles.item, styles.time)}>
                    {row.updatedAt && moment(row.updatedAt).format('HH:mm A')}
                  </div>
                  <div className={classNames(styles.item, styles.trip)}>{row.order_uuid && row.order_uuid}</div>
                  <div className={classNames(styles.item, styles.earned)}>
                    ${row.payout ? Number(row.payout.amount).toFixed(2) : '0.00'}
                  </div>
                </div>
              ))
            ) : (
              <Typography className={styles.noDelivery}>There is no delivery history yet</Typography>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}
      {renderDeliveries()}
    </div>
  );
};
