import { IconButton, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import { get } from 'lodash';
import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Delivery, IOrder, TDeliveryStatuses, User } from '../../../../interfaces';
import { getDateFromTimezone } from '../../../../utils';
import SVGIcon from '../../../common/SVGIcon';
import { getOnFleetDistance, isPopulatedObject } from '../../../DeliveriesBatchDetails/utils';
import styles from './Grid.module.sass';
import { IGridRowProps } from './types';

const emptyChar = '—';

const DetailsButton: FC<{ id: string }> = ({ id }) => (
  <Link to={`/dashboard/deliveries/${id}`}>
    <Tooltip title="Details" placement="top" arrow>
      <IconButton size="small">
        <SVGIcon name={'details'} />
      </IconButton>
    </Tooltip>
  </Link>
);

export const GridRow: FC<IGridRowProps> = ({ item, user }) => {
  const date: string = useMemo(() => getDateFromTimezone(item.createdAt, user, 'L, LT'), [item.createdAt]); // eslint-disable-line

  const status = useMemo(() => {
    if ('$status' in item) {
      switch (item.$status) {
        case 'finished':
          return 'Finished';
        case 'inprogress':
          return 'In Progress';
        case 'failed':
          return 'Failed';
        default:
          return 'In Progress';
      }
    } else if (item.deliveries.length && isPopulatedObject(item.deliveries[0])) {
      const isCompleted = (item.deliveries as Delivery[]).every((delivery) => {
        return (['CANCELED', 'COMPLETED', 'FAILED'] as TDeliveryStatuses[]).includes(
          delivery.status as TDeliveryStatuses
        );
      });
      return isCompleted ? 'Finished' : 'In Progress';
    } else return 'In Progress';
  }, [item.$status]); // eslint-disable-line

  const [courier, haveCourier]: [string, false] | [User, true] = useMemo(() => {
    if (item.mainUser && isPopulatedObject(item.mainUser)) {
      return [item.mainUser as User, true];
    } else return [emptyChar, false];
  }, [item.mainUser]);

  const totalDistance = useMemo(() => {
    if ('$totalDistance' in item) {
      return `${Number(item.$totalDistance || 0).toFixed(2)} mi`;
    } else if (item.deliveries.length && isPopulatedObject(item.deliveries[0])) {
      const distance = (item.deliveries as Delivery[]).reduce(
        (acc, curr) => acc + Number(getOnFleetDistance(curr) || 0),
        0
      );
      return `${Number(distance).toFixed(3)} mi`;
    } else return emptyChar;
  }, [item]);

  const totalPrice = useMemo(() => {
    if ('$totalPrice' in item) {
      return `$${Number(item.$totalPrice || 0).toFixed(2)}`;
    } else if (item.deliveries.length && isPopulatedObject(item.deliveries[0])) {
      let price: number = 0;
      // eslint-disable-next-line
      (item.deliveries as Delivery[]).map((delivery) => {
        let localPrice: number = 0;
        if ('forcedPriceForCourier' in delivery && Number(delivery.forcedPriceForCourier)) {
          localPrice = Number(delivery.forcedPriceForCourier);
        }
        if ((delivery as any).payout) {
          localPrice = Number((delivery as any).payout.amount);
        }
        price += localPrice;
      });

      if (Number(price)) return `$${Number(price).toFixed(2)}`;
      return emptyChar;
    } else return emptyChar;
  }, [item]);

  const totalCopay = useMemo(() => {
    if ('$totalCopay' in item) {
      return `$${Number(item.$totalCopay).toFixed(2)}`;
    } else if (item.deliveries.length && isPopulatedObject(item.deliveries[0])) {
      let copay: number = 0;
      // eslint-disable-next-line
      (item.deliveries as Delivery[]).map((delivery) => {
        const medications = ((delivery.order as IOrder) || {}).prescriptions;
        const localCopay = (medications || []).reduce((acc, curr) => acc + (curr.rxCopay || 0), 0);
        copay += localCopay;
      });
      if (Number(copay)) return `$${Number(copay).toFixed(2)}`;
      return emptyChar;
    }
    return emptyChar;
  }, [item]);

  return (
    <div className={styles.rowContainer}>
      <div className={styles.id}>
        <Link to={`/dashboard/deliveries/${item._id}`} className={styles.link}>
          {item.batch_uuid || emptyChar}
        </Link>
      </div>
      <div className={styles.date}>{date}</div>
      <div className={styles.courier}>
        {haveCourier ? (
          <Link to={`/dashboard/couriers/${get(courier, '_id')}`} className={styles.link}>
            {get(courier, 'name')} {get(courier, 'family_name')}
          </Link>
        ) : (
          emptyChar
        )}
      </div>
      <div className={styles.distance}>{totalDistance}</div>
      <div className={styles.totalPrice}>{totalPrice}</div>
      <div className={styles.totalCopay}>{totalCopay}</div>
      <div className={styles.status}>
        <div
          className={classNames(styles.itemStatus, {
            [styles.inprogress]: status === 'In Progress',
            [styles.finished]: status === 'Finished',
            [styles.failed]: status === 'Failed'
          })}
        />
        {status}
      </div>
      <div className={styles.actions}>
        <DetailsButton id={item._id} />
      </div>
    </div>
  );
};
