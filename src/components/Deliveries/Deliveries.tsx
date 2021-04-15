import React, { FC, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { DeliveryStatuses } from '../../constants';
import useDelivery from '../../hooks/useDelivery';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
// import Select from '../common/Select';
import Loading from '../common/Loading';
import EmptyList from '../common/EmptyList';

import styles from './Deliveries.module.sass';
import DeliveriesFilterModal from './components/DeliveriesFilterModal';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';

const PER_PAGE = 10;

export const Deliveries: FC = () => {
  const { path } = useRouteMatch();
  const { getDeliveries, filters, exportDeliveries } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const deliveries = await getDeliveries({
        ...filters,
        perPage: PER_PAGE
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [deliveryStore, getDeliveries, filters]);

  useEffect(() => {
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  // useEffect(() => {
  //   return () => {
  //     deliveryStore.set('filters')({ ...filters, search: '' });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const response = await exportDeliveries({
        ...filters
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `deliveries.csv`);
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
    deliveryStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (text: string) => {
    deliveryStore.set('filters')({ ...filters, page: 0, search: text });
  };

  const handleToggleFilterModal = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleChangeSort = (nextSortField: string) => () => {
    deliveryStore.set('filters')({
      ...filters,
      page: 0,
      sortField: nextSortField,
      order: order === 'asc' ? 'desc' : 'asc'
    });
  };

  const renderHeaderBlock = () => {
    const meta = deliveryStore.get('meta');
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
          <Typography className={styles.title}>Order Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={meta && meta.filteredCount}
              onChangePage={handleChangePage}
            />
            {isExportLoading ? (
              <Loading />
            ) : (
              <Button variant="outlined" color="secondary" disabled={isExportLoading} onClick={handleExport}>
                <Typography>Export</Typography>
              </Button>
            )}
            {/* <Select
              value={''}
              onChange={() => {}}
              items={filtersStatus}
              classes={{ input: styles.input, inputRoot: styles.select, root: styles.select }}
            /> */}
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.date} onClick={handleChangeSort('createdAt')}>
            Date
            {sortField === 'createdAt' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
          <div className={styles.uuid} onClick={handleChangeSort('order_uuid')}>
            ID
            {sortField === 'order_uuid' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
          <div className={styles.pharmacy} onClick={handleChangeSort('pharmacy.name')}>
            Pharmacy
            {sortField === 'pharmacy.name' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
          <div className={styles.consumer}>Consumer</div>
          <div className={styles.courier}>Courier</div>
          <div className={styles.status} onClick={handleChangeSort('status')}>
            Status
            {sortField === 'status' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderConsumers = () => {
    return (
      <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {deliveryStore.get('deliveries') && deliveryStore.get('deliveries').length ? (
              deliveryStore.get('deliveries').map((row: any) => (
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
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}
      {renderConsumers()}
      <DeliveriesFilterModal isOpen={isFiltersOpen} onClose={handleToggleFilterModal} />
    </div>
  );
};
