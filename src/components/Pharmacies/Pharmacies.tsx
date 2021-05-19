import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import usePharmacy from '../../hooks/usePharmacy';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';
import Image from '../common/Image';
import EmptyList from '../common/EmptyList';
import { PHARMACY_STATUS } from '../../constants';
import { getAddressString } from '../../utils';

import styles from './Pharmacies.module.sass';

const PER_PAGE = 10;

export const Pharmacies: FC = () => {
  const { path } = useRouteMatch();
  const { getPharmacies, filters, exportPharmacies } = usePharmacy();
  const { pharmacyStore, userStore } = useStores();
  const { page, search, order, sortField } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const getPharmaciesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const pharmacies = await getPharmacies({
        page,
        perPage: PER_PAGE,
        search,
        order,
        sortField
      });
      pharmacyStore.set('pharmacies')(pharmacies.data);
      pharmacyStore.set('meta')(pharmacies.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getPharmacies, page, pharmacyStore, search, order, sortField]);

  useEffect(() => {
    getPharmaciesList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  // useEffect(() => {
  //   return () => {
  //     pharmacyStore.set('filters')({ ...filters, search: '' });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const response = await exportPharmacies({
        ...filters
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pharmacies.csv`);
      document.body.appendChild(link);
      link.click();
      (link as any).parentNode.removeChild(link);
      setIsExportLoading(false);
    } catch (err) {
      console.error(err);
      setIsExportLoading(false);
    }
  };

  const handleChangePage = (e: object, nextPage: number) => {
    pharmacyStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (text: string) => {
    pharmacyStore.set('filters')({ ...filters, page: 0, search: text });
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
            value={search}
            onChange={handleChangeSearch}
          />
          <Button variant="outlined" color="secondary" disabled={isExportLoading} onClick={handleExport}>
            <Typography>Export</Typography>
          </Button>
          <Typography className={styles.title}>Pharmacy Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={pharmacyStore.get('meta') && pharmacyStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Button className={styles.button} variant="contained" color="secondary">
              <Link className={styles.link} to={'/dashboard/create-pharmacy'}>
                Add New Pharmacy
              </Link>
            </Button>
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.pharmacy}>Pharmacy</div>
          <div className={styles.address}>Address</div>
          <div className={styles.status}>Status</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderPharmacies = () => {
    return (
      <div className={classNames(styles.pharmacies, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {pharmacyStore.get('pharmacies') && pharmacyStore.get('pharmacies').length ? (
              pharmacyStore.get('pharmacies').map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={styles.pharmacy}>
                    {row.preview ? (
                      <Image
                        className={styles.avatar}
                        alt={'No Preview'}
                        src={row.preview}
                        cognitoId={userStore.get('sub')}
                      />
                    ) : (
                      <div className={styles.avatar}>{`${row.name ? row.name[0].toUpperCase() : '-'}`}</div>
                    )}

                    <Link className={styles.nameLink} to={`${path}/${row._id}`}>{`${row.name}`}</Link>
                  </div>
                  <div className={styles.address}>{getAddressString(row.address)}</div>
                  <div className={styles.status}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.verified]: row.status === PHARMACY_STATUS.VERIFIED,
                        [styles.declined]: row.status === PHARMACY_STATUS.DECLINED,
                        [styles.pending]: row.status === PHARMACY_STATUS.PENDING
                      })}
                    />
                    {row.status ? `${row.status.charAt(0).toUpperCase()}${row.status.slice(1)}` : 'Pending'}
                  </div>
                  <div className={styles.actions}>
                    <Link to={`${path}/${row._id}`}>
                      <Tooltip title="Details" placement="top" arrow>
                        <IconButton className={styles.action}>
                          <SVGIcon name={'details'} className={styles.pharmacyActionIcon} />
                        </IconButton>
                      </Tooltip>
                    </Link>
                    <Link to={`${path}/${row._id}/?edit=true`}>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton className={styles.action}>
                          <SVGIcon name={'edit'} className={styles.pharmacyActionIcon} />
                        </IconButton>
                      </Tooltip>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <EmptyList />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pharmaciesWrapper}>
      {renderHeaderBlock()}
      {renderPharmacies()}
    </div>
  );
};
