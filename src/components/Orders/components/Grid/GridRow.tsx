import { Consumer, Pharmacy } from '../../../../interfaces';
import { IconButton, Tooltip } from '@material-ui/core';
import React, { FC, useCallback, useMemo } from 'react';

import { Checkbox } from '../Checkbox';
import { IGridRowProps } from './types';
import { Link } from 'react-router-dom';
import SVGIcon from '../../../common/SVGIcon';
import { canCreateDelivery } from '../../../OrderDetails/utils';
import classNames from 'classnames';
import { getDateFromTimezone } from '../../../../utils';
import styles from './Grid.module.sass';

const emptyChar = '—';

const parseAddress = (customer: Consumer): string => {
  if (!customer || !customer.address) return emptyChar;
  const { street, number: streetNumber } = customer.address;
  return `${streetNumber ? streetNumber + ' ' : ''}${street}`;
};

const DetailsButton: FC<{ id: string }> = ({ id }) => (
  <Link to={`/dashboard/orders/${id}`}>
    <Tooltip title="Details" placement="top" arrow>
      <IconButton size="small">
        <SVGIcon name={'details'} />
      </IconButton>
    </Tooltip>
  </Link>
);

export const GridRow: FC<IGridRowProps> = ({ item, user, isSelected, onSelect }) => {
  const date: string = useMemo(() => getDateFromTimezone(item.createdAt, user, 'L, LT'), [item.createdAt]); // eslint-disable-line

  const dispatchDate: string = useMemo(
    () => (item.dispatchAt ? getDateFromTimezone(item.dispatchAt, user, 'L') : emptyChar),
    [item.dispatchAt] // eslint-disable-line
  );

  const [havePharmacy, pharmacyName]: [boolean, string] = useMemo(() => {
    const isObject = typeof item.pharmacy === 'object';
    const isHave = !isObject ? !!item.pharmacy : Object.keys(item.pharmacy || {}).length > 1;
    const value = isObject ? (item.pharmacy as Pharmacy).name : (item.pharmacy as string);
    return [isHave, value];
  }, [item.pharmacy]);

  const [haveCustomer, customerAddress]: [boolean, string] = useMemo(() => {
    const isObject = typeof item.customer === 'object';
    const isHave = !isObject ? !!item.customer : Object.keys(item.customer || {}).length > 1;
    const value = isObject ? parseAddress(item.customer as Consumer) : (item.customer as string);
    return [isHave, value];
  }, [item.customer]);

  const status = useMemo(() => {
    switch (item.status) {
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
  }, [item.status]);

  const handleSelectOrder = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  const canSelectOrder = useMemo(() => {
    return canCreateDelivery(item);
  }, [item]);

  return (
    <div className={styles.rowContainer}>
      <div className={styles.checkbox}>
        <Checkbox disabled={!canSelectOrder} value={isSelected} onChange={handleSelectOrder} />
      </div>

      <div className={styles.uuid}>
        <Link to={`/dashboard/orders/${item._id}`} className={styles.link}>
          {item.order_uuid}
        </Link>
      </div>

      <div className={styles.date}>{date}</div>

      <div className={styles.pharmacy}>
        {havePharmacy ? (
          <Link to={`/dashboard/pharmacies/${(item.pharmacy as Pharmacy)._id}`} className={styles.link}>
            {pharmacyName}
          </Link>
        ) : (
          emptyChar
        )}
      </div>

      <div className={styles.destination}>{haveCustomer ? customerAddress : emptyChar}</div>

      <div className={styles.dispatchDate}>{dispatchDate}</div>

      <div className={styles.deliveryId}>{item.batch_uuid ? item.batch_uuid : '-'}</div>

      <div className={styles.status}>
        <div
          className={classNames(styles.itemStatus, {
            [styles.new]: item.status === 'new',
            [styles.ready]: item.status === 'ready',
            [styles.canceled]: item.status === 'canceled',
            [styles.pending]: item.status === 'pending',
            [styles.route]: item.status === 'route',
            [styles.delivered]: item.status === 'delivered',
            [styles.failed]: item.status === 'failed'
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
