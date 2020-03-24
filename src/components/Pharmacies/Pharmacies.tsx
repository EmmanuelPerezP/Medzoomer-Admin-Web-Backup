import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';

import usePharmacy from '../../hooks/usePharmacy';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';

import styles from './Pharmacies.module.sass';

const PER_PAGE = 10;

export const Pharmacies: FC = () => {
  const { path } = useRouteMatch();
  const { getPharmacies } = usePharmacy();
  const { pharmacyStore } = useStores();
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPharmaciesList().catch();
  }, [page, search]);

  const getPharmaciesList = async () => {
    setIsLoading(true);
    try {
      const pharmacies = await getPharmacies({
        page,
        perPage: PER_PAGE,
        search
      });
      pharmacyStore.set('pharmacies')(pharmacies.data);
      pharmacyStore.set('meta')(pharmacies.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
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
          <Typography className={styles.title}>Pharmacy Management</Typography>

          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              filteredCount={pharmacyStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Button className={styles.button} variant="contained" color="secondary">
              <Link className={styles.link} href={'/dashboard/create-pharmacy'}>
                Add New Pharmacy
              </Link>
            </Button>
          </div>
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
        {isLoading ? (
          <Loading />
        ) : (
          <Table>
            <TableBody>
              {pharmacyStore.get('pharmacies')
                ? pharmacyStore.get('pharmacies').map((row: any) => (
                    <TableRow key={row._id} className={styles.tableItem}>
                      <TableCell className={styles.pharmacy}>
                        {row.preview ? (
                          <img className={classNames(styles.avatar, styles.img)} src={row.preview} alt="" />
                        ) : (
                          <div className={styles.avatar}>{`${row.name[0].toUpperCase()}`}</div>
                        )}
                        {`${row.name}`}
                      </TableCell>
                      <TableCell className={styles.address}>{row.address}</TableCell>
                      <TableCell className={styles.user}>{row.managerName}</TableCell>
                      <TableCell className={styles.actions} align="right">
                        <SVGIcon name={'billing'} style={{ height: '15px', width: '15px', marginRight: '30px' }} />
                        <Link href={`${path}/${row._id}`}>
                          <SVGIcon name={'edit'} style={{ height: '15px', width: '15px' }} />
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
    <div className={styles.pharmaciesWrapper}>
      {renderHeaderBlock()}
      {renderCouriers()}
    </div>
  );
};
