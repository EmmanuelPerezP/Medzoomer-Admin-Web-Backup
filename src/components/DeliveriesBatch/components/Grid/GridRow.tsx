import { IconButton, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getDateFromTimezone } from '../../../../utils';
import SVGIcon from '../../../common/SVGIcon';
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
  const date: string = useMemo(() => getDateFromTimezone(item.createdAt, user, 'L, LT'), [item.createdAt]);

  const status = useMemo(() => {
    switch (item.status) {
      case 'finished':
        return 'Finished';
      case 'progress':
        return 'In Progress';
      default:
        return;
    }
  }, [item.status]);

  return (
    <div className={styles.rowContainer}>
      <div className={styles.id}>
        <Link to={`/dashboard/deliveries/${item._id}`} className={styles.link}>
          {item.deliveryId}
        </Link>
      </div>

      <div className={styles.date}>{date}</div>

      <div className={styles.courier}>
        {item.courier ? (
          <Link to={`/dashboard/couriers/${item.courier._id}`} className={styles.link}>
            {item.courier.fullName}
          </Link>
        ) : (
          emptyChar
        )}
      </div>

      <div className={styles.distance}>{item.totalDistance}</div>

      <div className={styles.totalPrice}>{item.totalPrice ? `$ ${item.totalPrice}` : emptyChar}</div>

      <div className={styles.totalCopay}>{item.totalCopay ? `$ ${item.totalCopay}` : emptyChar}</div>

      <div className={styles.status}>
        <div
          className={classNames(styles.itemStatus, {
            [styles.progress]: item.status === 'progress',
            [styles.finished]: item.status === 'finished'
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
