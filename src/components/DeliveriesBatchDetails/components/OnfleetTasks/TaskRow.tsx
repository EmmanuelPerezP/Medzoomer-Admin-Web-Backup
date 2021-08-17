import styles from './OnfleetTasks.module.sass';
import React, { FC, useCallback, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import classNames from 'classnames';

import SVGIcon from '../../../common/SVGIcon';
import { ITaskRowProps } from './types';
import { emptyChar, getFullAddress, getShortAddress } from '../../utils';

export const TaskRow: FC<ITaskRowProps> = ({ task }) => {
  const history = useHistory();
  const orderId = task.orderId;
  const order_uuid = task.order_uuid;
  const deliveryLeg = task.deliveryDistance ? `${task.deliveryDistance} mi` : emptyChar;
  const price = task.price ? `$${task.price.toFixed(2)}` : emptyChar;

  const isRC = task.isRC;
  const rcPrice = task.rcPrice ? `Copay $${task.rcPrice.toFixed(2)}` : emptyChar;

  const status = useMemo(() => {
    switch (task.status) {
      case 'new':
        return 'New';
      case 'ready':
        return 'Ready';
      case 'canceled':
        return 'Canceled';
      case 'pending':
        return 'Pending Pickup';
      case 'route':
        return 'En Route';
      case 'delivered':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'New';
    }
  }, [task.status]);

  const address = useMemo(() => {
    if (task.destinationAddress) {
      return getShortAddress(task.destinationAddress);
    } else return emptyChar;
  }, [task.destinationAddress]);

  const canGoToDetails = useMemo(() => {
    if (task.isRC) return true;
    if (task.orderId && task.destinationType === 'customer') return true;
    return false;
  }, [task]);

  const handleDetails = useCallback(() => {
    if (canGoToDetails && !task.isRC) {
      history.push(`/dashboard/deliveries/task/${task.orderId}`);
    }
  }, [history, canGoToDetails, task]);

  const detailsRoute = useMemo(() => {
    if (task.destinationType === 'customer' && task.destinationId) {
      return `/dashboard/patients/${task.destinationId}`;
    } else if (task.destinationType === 'pharmacy' && task.destinationId) {
      return `/dashboard/pharmacies/${task.destinationId}`;
    } else return null;
  }, [task]);

  return (
    <div className={styles.itemContainer}>
      <div className={classNames(styles.columnOrderId, styles.value)}>
        {order_uuid ? (
          <Link to={`/dashboard/orders/${orderId}`} style={{ textDecoration: 'none' }}>
            <Typography color="secondary">{order_uuid}</Typography>
          </Link>
        ) : (
          emptyChar
        )}
      </div>
      <div className={classNames(styles.columnDeliveryLeg, styles.value)}>{deliveryLeg}</div>
      <div className={classNames(styles.columnDestination, styles.value)}>
        <div className={styles.multilineValue}>
          {detailsRoute && (
            <Link className={styles.link} to={detailsRoute}>
              {task.destinationName}
            </Link>
          )}
          <div className={styles.address}>{address}</div>
        </div>
      </div>
      <div className={classNames(styles.columnPrice, styles.value)}>{isRC ? rcPrice : price}</div>
      <div className={classNames(styles.columnStatus, styles.value)}>
        <div
          className={classNames(styles.itemStatus, {
            [styles.new]: task.status === 'new',
            [styles.ready]: task.status === 'ready',
            [styles.canceled]: task.status === 'canceled',
            [styles.pending]: task.status === 'pending',
            [styles.route]: task.status === 'route',
            [styles.delivered]: task.status === 'delivered',
            [styles.failed]: task.status === 'failed'
          })}
        />
        {status}
      </div>
      <div className={classNames(styles.columnAction, styles.value)}>
        {canGoToDetails && (
          <div className={styles.pressable} onClick={handleDetails}>
            <Tooltip title="Details" placement="top" arrow>
              <IconButton size="small">
                <SVGIcon name="details" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
