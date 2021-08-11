import styles from './Grid.module.sass';
import React, { FC, useMemo, useCallback } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { IGridRowProps } from './types';
import { Checkbox } from '../Checkbox';
import SVGIcon from '../../../common/SVGIcon';
import { getDateFromTimezone } from '../../../../utils';
import { Consumer, Pharmacy } from '../../../../interfaces';
import { isPopulatedObject } from '../../../OrderDetails/utils';
import { IBatch } from '../../../../interfaces/batch';

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
  const date: string = useMemo(() => getDateFromTimezone(item.createdAt, user, 'L, LT'), [item.createdAt]);

  const dispatchDate: string = useMemo(() => getDateFromTimezone(item.dispatchAt, user, 'L'), [item.dispatchAt]);

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

  const batchUuid = useMemo(() => {
    if (isPopulatedObject(item.$batch)) {
      return (item.$batch as IBatch).batch_uuid || emptyChar;
    }
    return emptyChar;
  }, [item.$batch]);

  const handleSelectOrder = useCallback(() => {
    onSelect(item);
  }, [item, onSelect]);

  const canSelectOrder = useMemo(() => {
    const passStatusCondition = !['ready', 'failed'].includes(item.status);
    return passStatusCondition;
  }, [item.status, item.delivery]);

  return (
    <div className={styles.rowContainer}>
      <div className={styles.checkbox}>
        <Checkbox disabled={canSelectOrder} value={isSelected} onChange={handleSelectOrder} />
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

      <div className={styles.deliveryId}>{batchUuid}</div>

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
