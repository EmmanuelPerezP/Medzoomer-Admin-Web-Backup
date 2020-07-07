import React, { FC, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { Statuses, tableHeaders, CheckRStatuses } from '../../constants';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Image from '../common/Image';
import CourierFilterModal from './components/CourierFilterModal';

import styles from './Couriers.module.sass';

const PER_PAGE = 10;

export const Couriers: FC = () => {
  const { path } = useRouteMatch();
  const { getCouriers, filters, exportCouriers } = useCourier();
  const { courierStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const getCouriersList = useCallback(async () => {
    setIsLoading(true);
    try {
      const couriers = await getCouriers({
        ...filters
      });
      courierStore.set('couriers')(couriers.data);
      courierStore.set('meta')(couriers.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [courierStore, getCouriers, filters]);

  useEffect(() => {
    getCouriersList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const response = await exportCouriers({
        ...filters
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `couriers.csv`);
      document.body.appendChild(link);
      link.click();
      (link as any).parentNode.removeChild(link);
      setIsExportLoading(false);
    } catch (err) {
      console.error(err);
      setIsExportLoading(false);
    }
  };
  const handleChangeSort = (nextSortField: string) => () => {
    courierStore.set('filters')({
      ...filters,
      page: 0,
      sortField: nextSortField,
      order: order === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleChangePage = (e: object, nextPage: number) => {
    courierStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    courierStore.set('filters')({ ...filters, page: 0, search: e.target.value });
  };

  const handleToggleFilterModal = () => {
    setIsFiltersOpen(!isFiltersOpen);
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
            value={filters.search}
            onChange={handleChangeSearch}
          />
          <SVGIcon name="filters" onClick={handleToggleFilterModal} className={styles.filterIcon} />
          <Typography className={styles.title}>Courier Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={courierStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Button variant="outlined" color="secondary" disabled={isExportLoading} onClick={handleExport}>
              <Typography>Export</Typography>
            </Button>
          </div>
        </div>
        <div className={styles.tableHeader}>
          {tableHeaders.map((headCell) => (
            <Typography
              onClick={headCell.value !== 'actions' ? handleChangeSort(headCell.value) : () => undefined}
              key={headCell.value}
              className={classNames(styles.headerItem, styles[headCell.className])}
            >
              {headCell.label}
              {sortField === headCell.value ? (
                order === 'asc' ? (
                  <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
                ) : (
                  <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
                )
              ) : null}
            </Typography>
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
          <div>
            {courierStore.get('couriers')
              ? courierStore.get('couriers').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={classNames(styles.item, styles.courier)}>
                      {row.picture ? (
                        <Image
                          className={styles.avatar}
                          alt={'No Avatar'}
                          src={row.picture}
                          width={200}
                          height={200}
                          cognitoId={row.cognitoId}
                        />
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
                    </div>
                    <div className={classNames(styles.item, styles.registered)}>
                      {moment(row.createdAt).format('MM/DD/YYYY')}
                    </div>
                    <div className={classNames(styles.item, styles.updated)}>
                      {moment(row.updatedAt).format('MM/DD/YYYY')}
                    </div>
                    {/* <div className={classNames(styles.item, styles.email)}>{row.email && row.email}</div>
                    <div className={classNames(styles.item, styles.phone)}>{row.phone_number && row.phone_number}</div> */}
                    <div className={classNames(styles.item, styles.city)}>{row.address && row.address.city}</div>
                    <div className={classNames(styles.item, styles.state)}>{row.address && row.address.state}</div>
                    <div className={classNames(styles.item, styles.zipCode)}>{row.address && row.address.zipCode}</div>
                    <div
                      className={classNames(styles.item, styles.checkrStatus, {
                        [styles.failed]:
                          row.checkrStatus === 'consider' ||
                          row.checkrStatus === 'suspended' ||
                          row.checkrStatus === 'dispute'
                      })}
                    >
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: CheckRStatuses[row.checkrStatus] === 'Passed',
                          [styles.declined]: CheckRStatuses[row.checkrStatus] === 'Failed'
                        })}
                      />
                      {row.checkrStatus && CheckRStatuses[row.checkrStatus]}
                    </div>
                    <div className={classNames(styles.item, styles.status)}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: row.status !== 'INCOMPLETE' // row.status === 'ACTIVE',
                        })}
                      />
                      {row.status === 'INCOMPLETE' ? Statuses[row.status] : 'Complete'}
                    </div>
                    <div className={classNames(styles.item, styles.status)}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: row.onboarded,
                          [styles.declined]: !row.onboarded && row.status === 'DECLINED',
                          [styles.approved]: !row.onboarded && row.status === 'ACTIVE'
                        })}
                      />
                      {row.onboarded ? 'Onboarded' : row.status && row.status !== 'INCOMPLETE' && Statuses[row.status]}
                    </div>
                    <div className={classNames(styles.item, styles.actions)}>
                      <Link to={`${path}/${row._id}`} hidden={!row.name}>
                        <SVGIcon name={'details'} style={{ height: '15px', width: '15px' }} />
                      </Link>
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.courierWrapper}>
      {renderHeaderBlock()}
      {renderCouriers()}
      <CourierFilterModal isOpen={isFiltersOpen} onClose={handleToggleFilterModal} />
    </div>
  );
};
