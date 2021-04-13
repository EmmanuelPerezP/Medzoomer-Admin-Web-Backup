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
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Button from '@material-ui/core/Button';
import { Checkbox, Drawer, Grid } from '@material-ui/core';
import DeliveriesTable from './components/DeliveriesTable';

const PER_PAGE = 3; // C!

export const Deliveries: FC = () => {
  const { path } = useRouteMatch();
  const { getDeliveries, filters, exportDeliveries } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [openDrawerGroup, setOpenDrawerGroup] = useState(false);
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);

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

  const handleChangeTitle = (key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    console.log("C! VALUE", value);
  };

  const handleChangeCheckbox = (event: any) => {
    let arr: any = selectedDeliveries;
    if (event.target.checked) {
      arr.push(event.target.name);
      setSelectedDeliveries(arr);
    } else {
      arr.splice(arr.indexOf(event.target.name), 1)
      setSelectedDeliveries(arr);
    }

    if (arr.length) {
      setOpenDrawerGroup(true);
    } else {
      setOpenDrawerGroup(false);
    }
    console.log('C! selectedDeliveries', selectedDeliveries)
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
                <div className={styles.tableItem_Box}>
                  <Checkbox />
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
    );
  };

  return (
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}
      {/* {renderConsumers()} */}

      <DeliveriesTable
        isLoading={isLoading}
        isGroup={false}
        handleChangeCheckbox={handleChangeCheckbox}
        data={deliveryStore}
        DeliveryStatuses={DeliveryStatuses}
        path={path}
      />

      {/* {!isLoading &&
        [deliveryStore, deliveryStore].map((data) => (
          <>
            <DeliveriesTable
              isLoading={false}
              isGroup
              handleChangeTitle={handleChangeTitle('Title')}
              data={data}
              DeliveryStatuses={DeliveryStatuses}
              path={path}
            />
          </>
        ))
      } */}

      <Drawer
        anchor='bottom'
        variant="persistent"
        open={openDrawerGroup}
        onClose={() => { setOpenDrawerGroup(false) }}>
        <div className={styles.drawerGroup}>
          <div>
            <IconButton color="secondary" >
              <RemoveCircleOutlineIcon />
            </IconButton>
            <Typography variant="body2" style={{margin: '0 24px 0 12px'}}>
              {selectedDeliveries.length} order selected
            </Typography>
            <Button color="secondary" size="small">
              Select all
            </Button>
          </div>
          <Button color="secondary" variant="contained" size="small" style={{padding: '10px 20px 14px'}}>
            Create New Group
          </Button>
        </div>
      </Drawer>

      <DeliveriesFilterModal isOpen={isFiltersOpen} onClose={handleToggleFilterModal} />
    </div>
  );
};
