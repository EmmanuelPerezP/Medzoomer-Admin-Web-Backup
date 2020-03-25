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

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { Statuses, filterCourier, tableHeaders, CheckRStatuses } from '../../constants';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Select from '../common/Select';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './Couriers.module.sass';

const PER_PAGE = 10;

export const Couriers: FC = () => {
  const { path } = useRouteMatch();
  const { getCouriers } = useCourier();
  const { courierStore } = useStores();
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState(tableHeaders[2].value);
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>(filterCourier[1].value);

  useEffect(() => {
    getCouriersList().catch();
  }, [page, search, status, order, sortField]);

  const getCouriersList = async () => {
    setIsLoading(true);
    try {
      const couriers = await getCouriers({
        page,
        perPage: PER_PAGE,
        search,
        status,
        sortField,
        order
      });
      courierStore.set('couriers')(couriers.data);
      courierStore.set('meta')(couriers.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
  };

  const handleChangeSort = (nextSortField: string) => () => {
    setSortField(nextSortField);
    if (nextSortField === sortField) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrder('asc');
    }
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
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              filteredCount={courierStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Select
              value={status}
              onChange={handleChange}
              items={filterCourier}
              IconComponent={() => <SVGIcon name={'downArrow'} className={styles.selectIcon} />}
              classes={{ input: styles.input, inputRoot: styles.select, root: styles.select }}
            />
          </div>
        </div>

        <div className={styles.tableHeader}>
          {tableHeaders.map((headCell) => (
            <div
              onClick={headCell.value !== 'actions' ? handleChangeSort(headCell.value) : () => undefined}
              key={headCell.value}
              className={classNames({ [styles.headerItem]: headCell.value !== 'actions' }, styles[headCell.className])}
            >
              {headCell.label}
              {sortField === headCell.value ? (
                order === 'asc' ? (
                  <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
                ) : (
                  <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
                )
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCouriers = () => {
    return (
      <div className={classNames(styles.couriers, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <Table>
            <TableBody>
              {courierStore.get('couriers')
                ? courierStore.get('couriers').map((row: any) => (
                    <TableRow key={row._id} className={styles.tableItem}>
                      <TableCell className={styles.courier}>
                        {row.picture ? (
                          <img className={classNames(styles.avatar, styles.img)} src={row.picture} alt="" />
                        ) : (
                          <div className={styles.avatar}>
                            {row.name ? (
                              `${row.name[0].toUpperCase()} ${row.family_name && row.family_name[0].toUpperCase()}`
                            ) : (
                              <PersonOutlineIcon />
                            )}
                          </div>
                        )}
                        <span className={styles.name}>{row.name ? `${row.name} ${row.family_name}` : '...'}</span>
                      </TableCell>
                      <TableCell className={styles.registered}>{moment(row.createdAt).format('MM/DD/YYYY')}</TableCell>
                      <TableCell className={styles.updated}>{moment(row.updatedAt).format('MM/DD/YYYY')}</TableCell>
                      <TableCell className={styles.email}>{row.email && row.email}</TableCell>
                      <TableCell className={styles.phone}>{row.phone_number && row.phone_number}</TableCell>
                      <TableCell className={styles.checkrStatus}>
                        <span
                          className={classNames(styles.statusColor, {
                            [styles.active]: CheckRStatuses[row.checkrStatus] === 'Passed',
                            [styles.declined]: CheckRStatuses[row.checkrStatus] === 'Failed'
                          })}
                        />
                        {row.status && Statuses[row.status]}
                      </TableCell>
                      <TableCell className={styles.status}>
                        <span
                          className={classNames(styles.statusColor, {
                            [styles.active]: row.status === 'ACTIVE',
                            [styles.declined]: row.status === 'DECLINED'
                          })}
                        />
                        {row.status && Statuses[row.status]}
                      </TableCell>
                      <TableCell className={styles.actions} align="right">
                        <Link href={`${path}/${row._id}`} hidden={!row.name}>
                          <SVGIcon name={'details'} style={{ height: '15px', width: '15px' }} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        )}
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
