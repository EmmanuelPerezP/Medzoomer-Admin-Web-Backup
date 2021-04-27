import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';

import useDelivery from '../../hooks/useDelivery';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './Deliveries.module.sass';
import DeliveriesFilterModal from './components/DeliveriesFilterModal';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';
import DeliveriesTable from './components/DeliveriesTable';
import DeliveriesDispatch from './components/DeliveriesDispatch';
import DrawerDispatch from './components/DrawerDispatch';
// import classNames from 'classnames';
// import moment from 'moment';
// import { Link } from 'react-router-dom';
// import { DeliveryStatuses } from '../../constants';
// import { IconButton, Tooltip } from '@material-ui/core';
// import EmptyList from '../common/EmptyList';

const PER_PAGE = 10;

export const Deliveries: FC = () => {
  const { path } = useRouteMatch();
  const { getDeliveries, filters, defaultFilters, exportDeliveries, setDeliveriesToDispatch } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('first');
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
    if (['first', 'notDispatched'].includes(activeTab)) {
      getDeliveriesList().catch();
    }
    // eslint-disable-next-line
  }, [page, search, order, sortField, activeTab]);

  useEffect(() => {
    if (activeTab !== 'first') {
      deliveryStore.set('filters')(defaultFilters);
    }
    // eslint-disable-next-line
  }, [activeTab]);

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

  const handleSelectAll = () => {
    const arr = deliveryStore.get('deliveries');
    const selected: any = arr.map((e) => e._id);
    setSelectedDeliveries(selected);
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
        <div className={styles.tabHeader}>
          <div
            className={['first', 'notDispatched'].includes(activeTab) ? styles.tabActive : styles.tab}
            onClick={() => {
              setActiveTab('notDispatched');
            }}
          >
            Non dispatched
          </div>
          <div
            className={activeTab === 'dispatched' ? styles.tabActive : styles.tab}
            onClick={() => {
              setActiveTab('dispatched');
            }}
          >
            Dispatched
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

  const handleCreate = useCallback(async () => {
    setIsLoading(true);
    await setDeliveriesToDispatch(selectedDeliveries);
    await getDeliveriesList();
    setIsLoading(false);
  }, [setDeliveriesToDispatch, selectedDeliveries]);

  return (
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}

      {['first', 'notDispatched'].includes(activeTab) ? (
        <DeliveriesTable
          isLoading={isLoading}
          data={deliveryStore}
          selected={selectedDeliveries}
          path={path}
          setOpenDrawerGroup={setOpenDrawerGroup}
          setSelectedDeliveries={setSelectedDeliveries}
        />
      ) : (
        <DeliveriesDispatch />
      )}
      <DrawerDispatch
        open={openDrawerGroup}
        sizeSelected={selectedDeliveries.length}
        onSelectAll={handleSelectAll}
        onUnselect={() => {
          setSelectedDeliveries([]);
          setOpenDrawerGroup(false);
        }}
        onCreate={handleCreate}
      />

      <DeliveriesFilterModal isOpen={isFiltersOpen} activeTab={activeTab} onClose={handleToggleFilterModal} />
    </div>
  );
};
