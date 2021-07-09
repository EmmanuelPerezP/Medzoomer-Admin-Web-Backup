import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DeliveryStatuses } from '../../../../../../constants';
import useDelivery from '../../../../../../hooks/useDelivery';
import { useStores } from '../../../../../../store';
import Loading from '../../../../../common/Loading';
import styles from '../../CourierInfo.module.sass';
import useUser from '../../../../../../hooks/useUser';

interface ICourierLastDeliveries {
  id: string;
  path: string;
}

const CourierLastDeliveries: FC<ICourierLastDeliveries> = ({ id, path }) => {
  const history = useHistory();
  const { deliveryStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);

  const { getDeliveriesCourier, filters } = useDelivery();
  const { page, sortField, order, search } = filters;

  const user = useUser();

  useEffect(() => {
    getDeliveries().catch();
    // eslint-disable-next-line
  }, []);

  const getDeliveries = useCallback(async () => {
    setIsLoading(true);
    try {
      const deliveries = await getDeliveriesCourier({
        page,
        perPage: 3,
        search,
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
  }, [id, deliveryStore, getDeliveriesCourier, order, page, search, sortField]);

  return (
    <div className={styles.deliveries}>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Loading />
        </div>
      )}

      {!isLoading && (
        <>
          <div className={styles.deliveryHeader}>
            <Typography className={styles.title}>Latest Delivery</Typography>
            <Button
              className={styles.headerButton}
              variant="outlined"
              color="secondary"
              onClick={() => history.push(path)}
            >
              <Typography className={styles.orderText}>View All</Typography>
            </Button>
          </div>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell className={classNames(styles.date, styles.headerCell)}>Date</TableCell>
                <TableCell className={classNames(styles.time, styles.headerCell)}>Time</TableCell>
                <TableCell className={classNames(styles.trip, styles.headerCell)}>Order ID</TableCell>
                <TableCell className={classNames(styles.status, styles.headerCell)}>Status</TableCell>
                <TableCell className={classNames(styles.tips, styles.headerCell)}>Tip</TableCell>
                <TableCell className={classNames(styles.earned, styles.headerCell)} align="right">
                  Earned
                </TableCell>
              </TableRow>
            </TableHead>
            {!deliveryStore.get('deliveries').length && (
              <Typography className={styles.noDelivery}>There is no delivery history yet</Typography>
            )}
            <TableBody>
              {deliveryStore.get('deliveries')
                ? deliveryStore.get('deliveries').map((row) => (
                    <TableRow key={row._id} className={styles.tableItem}>
                      <TableCell className={styles.date}>
                        {row.updatedAt && moment(row.updatedAt).tz(user.timezone as string).format('ll')}
                      </TableCell>
                      <TableCell className={styles.time}>
                        {row.updatedAt && moment(row.updatedAt).tz(user.timezone as string).format('HH:mm A')}
                      </TableCell>
                      <TableCell className={styles.trip}>{row.order_uuid && row.order_uuid}</TableCell>
                      <TableCell className={styles.status}>
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
                      </TableCell>
                      <TableCell className={styles.tips}>
                        {row.tips ? `$${Number(row.tips.amount).toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell className={styles.earned} align="right">
                        ${row.payout ? Number(row.payout.amount).toFixed(2) : '0.00'}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default CourierLastDeliveries;
