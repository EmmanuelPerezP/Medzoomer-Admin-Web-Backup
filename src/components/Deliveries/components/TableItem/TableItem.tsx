import { IconButton, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import moment from 'moment';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { DeliveryStatuses } from '../../../../constants';
import SVGIcon from '../../../common/SVGIcon';
import styles from './TableItem.module.sass';

interface Props {
  data: any;
  path: string;
}

export const TableItem: FC<Props> = (props) => {
  const { data, path } = props;

  return (
    <div className={styles.tableItem}>
      <div className={classNames(styles.item, styles.date)}>
        {moment(data.createdAt).format('ll')}
        <span>
          {moment(data.createdAt).format('LT')}
        </span>
      </div>
      <div className={classNames(styles.item, styles.uuid)}>{data.order_uuid}</div>
      {console.log('C! data.pharmacy', data.pharmacy)}
      <Link
        to={`/dashboard/pharmacies/`}
        // to={`/dashboard/pharmacies/${data.pharmacy._id}`} C!
        className={classNames(styles.item, styles.pharmacy)}
      >
        {data.pharmacy ? data.pharmacy.name : '-'}
      </Link>
      <Link
        to={`/dashboard/consumers/${data.customer._id}`}
        className={classNames(styles.item, styles.consumer)}
      >
        {data.customer ? `${data.customer.name} ${data.customer.family_name}` : '-'}
      </Link>
      {data.user ? (
        <Link
          to={`/dashboard/couriers/${data.user._id}`}
          className={classNames(styles.item, styles.courier)}
        >
          {data.user.name} {data.user.family_name}
        </Link>
      ) : (
        <div className={classNames(styles.item, styles.emptyCourier)}>{'Not Assigned'}</div>
      )}
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
        <Link to={`${path}/${data._id}`}>
          <Tooltip title="Details" placement="top" arrow>
            <IconButton size="small" >
              <SVGIcon name={'details'} />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  )
}