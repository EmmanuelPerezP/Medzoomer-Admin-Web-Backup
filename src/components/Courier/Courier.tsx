import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Select from '../common/Select';
import SVGIcon from '../common/SVGIcon';
import { Statuses } from '../../utils';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import styles from './Courier.module.sass';

const PER_PAGE = 10;

const selectItems = [
  { value: 'ALL', label: 'All Couriers' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PENDING', label: 'Pending' }
];

export const Courier: FC = () => {
  const { path } = useRouteMatch();
  const { getCouriers } = useCourier();
  const { courierStore } = useStores();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>(selectItems[0].value);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
  };
  useEffect(() => {
    getCouriersList().catch();
  }, [page, search, status]);

  const getCouriersList = async () => {
    const couriers = await getCouriers({
      page,
      perPage: PER_PAGE,
      search,
      status
    });
    courierStore.set('couriers')(couriers.data);
    courierStore.set('meta')(couriers.meta);
  };

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    setSearch(e.target.value);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Search
            classes={{
              input: styles.input,
              root: styles.search,
              inputRoot: styles.inputRoot
            }}
            onChange={handleChangeSearch}
          />
          <Typography className={styles.title}>Courier Management</Typography>
          <Pagination
            rowsPerPage={PER_PAGE}
            page={page}
            filteredCount={courierStore.get('meta').filteredCount}
            onChangePage={handleChangePage}
          />
          <Select
            value={status}
            onChange={handleChange}
            items={selectItems}
            IconComponent={() => <SVGIcon name={'downArrow'} className={styles.selectIcon} />}
            classes={{ input: styles.input, inputRoot: styles.select, root: styles.select }}
          />
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.courier}>Courier</div>
          <div className={styles.registered}>Registered</div>
          <div className={styles.email}>Email</div>
          <div className={styles.phone}>Phone</div>
          <div className={styles.status}>Status</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderCouriers = () => {
    return (
      <div className={styles.couriers}>
        <Table>
          <TableBody>
            {courierStore.get('couriers')
              ? courierStore.get('couriers').map((row) => (
                  <TableRow key={row._id} className={styles.tableItem}>
                    <TableCell className={styles.courier}>
                      {row.picture ? (
                        <img className={classNames(styles.avatar, styles.img)} src={row.picture} alt="" />
                      ) : (
                        <div
                          className={styles.avatar}
                        >{`${row.name[0].toUpperCase()} ${row.family_name[0].toUpperCase()}`}</div>
                      )}
                      {`${row.name} ${row.family_name}`}
                    </TableCell>
                    <TableCell className={styles.registered}>{moment(row.createdAt).format('MMMM DD, YYYY')}</TableCell>
                    <TableCell className={styles.email}>{row.email}</TableCell>
                    <TableCell className={styles.phone}>{row.phone_number}</TableCell>
                    <TableCell className={styles.status}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: row.status === 'ACTIVE',
                          [styles.declined]: row.status === 'DECLINED'
                        })}
                      />
                      {Statuses[row.status]}
                    </TableCell>
                    <TableCell className={styles.actions} align="right">
                      <Link href={`${path}/${row._id}`}>
                        <SVGIcon name={'details'} style={{ height: '15px', width: '15px' }} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className={styles.courierWrapper}>
      {renderHeaderBlock()}
      {renderCouriers()}
    </div>
  );
};
