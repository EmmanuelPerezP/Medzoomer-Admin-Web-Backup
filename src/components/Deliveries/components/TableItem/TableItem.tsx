import { IconButton, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import { get } from 'lodash';
import moment from 'moment';
import React, { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DeliveryStatuses } from '../../../../constants';
import { Delivery, Prescriptions } from '../../../../interfaces';
import SVGIcon from '../../../common/SVGIcon';
import styles from './TableItem.module.sass';

interface Props {
  data: any;
  path: string;
}

export const TableItem: FC<Props> = (props) => {
  const { data, path } = props;

  const isCopay = useMemo(() => data.type === 'RETURN_CASH', [data]);

  const totalCopay: string | null = useMemo(() => {
    if (data.notes && isCopay) {
      const [, value] = data.notes.split('=');
      return String(value);
    } else return null;
  }, [data]);

  return (
    <div className={styles.tableItem}>
      <div className={classNames(styles.item, styles.date)}>
        {moment(data.createdAt).format('ll')}
        <span>{moment(data.createdAt).format('LT')}</span>
      </div>
      <div className={classNames(styles.item, styles.uuid)}>{data.order_uuid}</div>
      <Link
        to={data.pharmacy ? `/dashboard/pharmacies/${data.pharmacy._id}` : path}
        className={classNames(styles.item, styles.pharmacy)}
      >
        {data.pharmacy ? data.pharmacy.name : '-'}
      </Link>
      <Link
        to={data.customer && data.customer._id ? `/dashboard/consumers/${data.customer._id}` : path}
        className={classNames(styles.item, styles.consumer)}
      >
        {data.customer && data.customer._id ? `${data.customer.name} ${data.customer.family_name}` : '-'}
      </Link>
      {data.user && Object.keys(data.user).length > 1 ? (
        <Link
          to={data.user ? `/dashboard/couriers/${data.user._id}` : path}
          className={classNames(styles.item, styles.courier)}
        >
          {data.user ? `${data.user.name} ${data.user.family_name}` : '-'}
        </Link>
      ) : (
        <div className={classNames(styles.item, styles.emptyCourier)}>{'Unassigned'}</div>
      )}
      <div className={classNames(styles.item, styles.uuid)}>{isCopay ? 'Yes' : 'No'}</div>
      <div className={classNames(styles.item, styles.status)}>
        <span
          className={classNames(styles.statusColor, {
            [styles.active]: data.status === 'ACTIVE',
            [styles.pending]: data.status === 'PENDING',
            [styles.inprogress]: data.status === 'PROCESSED',
            [styles.suspicious]: data.status === 'SUSPICIOUS',
            [styles.canceled]: data.status === 'CANCELED',
            [styles.completed]: data.status === 'COMPLETED',
            [styles.failed]: data.status === 'FAILED'
          })}
        />
        {DeliveryStatuses[data.status]}
      </div>
      <div className={classNames(styles.item, styles.actions)}>
        {isCopay && totalCopay ? (
          <Tooltip title={`Total Rx Copay - $${Number(totalCopay).toFixed(2)}`} placement="top" arrow>
            <IconButton size="small">
              <span style={{ color: '#006cf0', fontSize: 17 }}>$</span>
            </IconButton>
          </Tooltip>
        ) : null}
        {data.order && data.order.notes && (
          <Tooltip title="Special Delivery Requirements" placement="top" arrow>
            <IconButton size="small">
              <SVGIcon name={'notes'} />
            </IconButton>
          </Tooltip>
        )}
        <Link to={data._id ? `${path}/${data._id}` : '-'}>
          <Tooltip title="Details" placement="top" arrow>
            <IconButton size="small">
              <SVGIcon name={'details'} />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};
