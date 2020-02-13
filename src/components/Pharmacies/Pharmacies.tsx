import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
import { Statuses } from '../../utils';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import styles from './Pharmacies.module.sass';

const PER_PAGE = 10;

const selectItems = [
  { value: 'ALL', label: 'All Couriers' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PENDING', label: 'Pending' }
];

export const Pharmacies: FC = () => {
  const { path } = useRouteMatch();
  const { getCouriers } = useCourier();
  const { courierStore } = useStores();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>(selectItems[0].value);

  useEffect(() => {
    getCouriersList().catch();
  }, [page, search, status]);

  const getCouriersList = async () => {
    const pharmacies = await getCouriers({
      page,
      perPage: PER_PAGE,
      search,
      status
    });
    courierStore.set('couriers')(pharmacies.data);
    courierStore.set('meta')(pharmacies.meta);
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
          <Typography className={styles.title}>Pharmacy Management</Typography>
          <Pagination
            rowsPerPage={PER_PAGE}
            page={page}
            filteredCount={courierStore.get('meta').filteredCount}
            onChangePage={handleChangePage}
          />
          <Button className={styles.button} variant="contained" color="secondary">
            <Link className={styles.link} href={'/dashboard/create-pharmacy'}>
              Add New Pharmacy
            </Link>
          </Button>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.pharmacy}>Pharmacy</div>
          <div className={styles.address}>Address</div>
          <div className={styles.user}>User</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderCouriers = () => {
    return (
      <div className={styles.pharmacies}>
        <Table>
          <TableBody>
            {courierStore.get('couriers')
              ? courierStore.get('couriers').map((row: any) => (
                  <TableRow key={row._id} className={styles.tableItem}>
                    <TableCell className={styles.pharmacy}>
                      {row.picture ? (
                        <img className={classNames(styles.avatar, styles.img)} src={row.picture} alt="" />
                      ) : (
                        <div
                          className={styles.avatar}
                        >{`${row.name[0].toUpperCase()} ${row.family_name[0].toUpperCase()}`}</div>
                      )}
                      {`${row.name} ${row.family_name}`}
                    </TableCell>
                    <TableCell className={styles.address}>{moment(row.createdAt).format('MMMM DD, YYYY')}</TableCell>
                    <TableCell className={styles.user}>{Statuses[row.status]}</TableCell>
                    <TableCell className={styles.actions} align="right">
                      <Link href={`${path}/${row._id}`}>
                        <SVGIcon name={'billing'} style={{ height: '15px', width: '15px', marginRight: '30px' }} />
                        <SVGIcon name={'edit'} style={{ height: '15px', width: '15px' }} />
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
    <div className={styles.pharmaciesWrapper}>
      {renderHeaderBlock()}
      {renderCouriers()}
    </div>
  );
};
