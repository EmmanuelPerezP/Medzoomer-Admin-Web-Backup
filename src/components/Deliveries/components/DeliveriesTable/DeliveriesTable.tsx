import { Checkbox, IconButton, Tooltip } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import Loading from '../../../common/Loading';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './DeliveriesTable.module.sass';
import moment from 'moment';
import SVGIcon from '../../../common/SVGIcon';
import EmptyList from '../../../common/EmptyList';

import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

interface MenuProps {
  isLoading: boolean;
  isGroup: boolean;
  data: any;
  DeliveryStatuses: any;
  path: string;
  handleChangeTitle?: any;
  handleChangeCheckbox?: any;
}

export const DeliveriesTable: FC<MenuProps> = (props) => {
  const { isLoading, isGroup, data, DeliveryStatuses, handleChangeTitle, handleChangeCheckbox, path } = props;
  const [title, setTitle] = useState();

  useEffect(() => {
    if (data.get('deliveries').length && !title) {
      setTitle(moment(data.get('deliveries')[0].createdAt).format('lll'));
    }
  }, [data, title])

  return (
    <div>
      {isGroup &&
        <div className={styles.groupTitleBox}>
          <input className={styles.groupTitle} value={title} onChange={handleChangeTitle} />
          {true && <>
            <IconButton size="small">
              <ClearIcon fontSize="small" />
            </IconButton>
            <IconButton size="small">
              <DoneIcon color="action" fontSize="small" />
            </IconButton>
          </>
          }
        </div>
      }
      <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {data.get('deliveries') && data.get('deliveries').length ? (
              data.get('deliveries').map((row: any) => (
                <div className={styles.tableItem_Box}>
                  {!isGroup && <Checkbox name={row._id} onChange={handleChangeCheckbox} icon={<RadioButtonUncheckedIcon />} checkedIcon={<RadioButtonCheckedIcon />} />}

                  <div key={row._id} className={styles.tableItem}>
                    <div className={classNames(styles.item, styles.date)}>{moment(row.createdAt).format('lll')}</div>
                    <div className={classNames(styles.item, styles.uuid)}>{row.order_uuid}</div>
                    <Link
                      to={`/dashboard/pharmacies/${row.pharmacy._id}`}
                      className={classNames(styles.item, styles.pharmacy)}
                    >
                      {row.pharmacy ? row.pharmacy.name : '-'}
                    </Link>
                    <Link
                      to={`/dashboard/consumers/${row.customer._id}`}
                      className={classNames(styles.item, styles.consumer)}
                    >
                      {row.customer ? `${row.customer.name} ${row.customer.family_name}` : '-'}
                    </Link>
                    {row.user ? (
                      <Link
                        to={`/dashboard/couriers/${row.user._id}`}
                        className={classNames(styles.item, styles.courier)}
                      >
                        {row.user.name} {row.user.family_name}
                      </Link>
                    ) : (
                      <div className={classNames(styles.item, styles.emptyCourier)}>{'Not Assigned'}</div>
                    )}
                    <div className={classNames(styles.item, styles.status)}>
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
                    </div>
                    <div className={classNames(styles.item, styles.actions)}>
                      <Link to={`${path}/${row._id}`}>
                        <Tooltip title="Details" placement="top" arrow>
                          <IconButton className={styles.action}>
                            <SVGIcon name={'details'} className={styles.deliveryActionIcon} />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyList />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
