import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';

import useDelivery from '../../hooks/useDelivery';
import { useStores } from '../../store';
import { parseFilterToValidQuery } from './utils';

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
import CheckBox from '../common/Checkbox';
// import classNames from 'classnames';
// import moment from 'moment';
// import { Link } from 'react-router-dom';
// import { DeliveryStatuses } from '../../constants';
// import { IconButton, Tooltip } from '@material-ui/core';
// import EmptyList from '../common/EmptyList';

const PER_PAGE = 10;
let timerId: NodeJS.Timeout;

export const Deliveries: FC = () => {
  const { path } = useRouteMatch();
  const { getDeliveries, filters, exportDeliveries, setDeliveriesToDispatch } = useDelivery();
  const { deliveryStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [needNotShowBadStatus, setNeedNotShowBadStatus] = useState(1);
  const [showInBatches, setShowInBatches] = useState(1);
  const activeTab = deliveryStore.get('activeTab');
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [openDrawerGroup, setOpenDrawerGroup] = useState(false);
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);

  const isDispatchedBatched = useMemo(() => {
    return 'dispatched' === activeTab && !showInBatches;
  }, [activeTab, showInBatches]);

  const isDispatchedNotBatched = useMemo(() => {
    return 'dispatched' === activeTab && showInBatches;
  }, [activeTab, showInBatches]);

  const getDeliveriesList = useCallback(async () => {
    try {
      const deliveries = await getDeliveries(
        parseFilterToValidQuery({
          ...filters,
          needNotShowBadStatus: isDispatchedBatched ? 0 : needNotShowBadStatus,
          perPage: PER_PAGE,
          batches: showInBatches
        })
      );
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
    } catch (e) {
      console.error(e);
    }
  }, [deliveryStore, getDeliveries, filters, needNotShowBadStatus, showInBatches]);

  useEffect(() => {
    if (['first', 'notDispatched'].includes(activeTab)) {
      runAutoUpdate();
    }
    // eslint-disable-next-line
  }, [deliveryStore, filters]);

  const runAutoUpdate = () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      getDeliveriesList()
        .then()
        .catch();
    }, 15000);
  };

  const getDeliveriesListWithLoading = () => {
    setIsLoading(true);
    // tslint:disable-next-line:no-floating-promises
    getDeliveriesList()
      .catch()
      .finally(() => {
        runAutoUpdate();
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (['first', 'notDispatched'].includes(activeTab) || isDispatchedBatched) {
      clearTimeout(timerId);
      getDeliveriesListWithLoading();
    }
    // eslint-disable-next-line
  }, [page, search, order, sortField, activeTab, showInBatches]);

  useEffect(() => {
    if (['first', 'notDispatched'].includes(activeTab)) {
      clearTimeout(timerId);
      if (page > 0) {
        deliveryStore.set('filters')({ ...filters, page: 0 });
      } else {
        getDeliveriesListWithLoading();
      }
    }
    // eslint-disable-next-line
  }, [needNotShowBadStatus]);

  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const response = await exportDeliveries(
        parseFilterToValidQuery({
          ...filters,
          needNotShowBadStatus: isDispatchedBatched ? 0 : needNotShowBadStatus,
          batches: !('dispatched' === activeTab) ? 1 : 0
        })
      );
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
    if (isDispatchedNotBatched) return;

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

  const handleChangeTab = (tab: string) => {
    if (tab === deliveryStore.get('activeTab')) return;
    if (tab === 'dispatched') clearTimeout(timerId);
    deliveryStore.set('filters')({ ...filters, page: 0, status: 'ALL' });
    setShowInBatches(1);
    deliveryStore.set('activeTab')(tab);
  };

  useEffect(() => {
    if (isDispatchedBatched) {
      deliveryStore.set('filters')({
        ...filters,
        page: 0,
        sortField: 'createdAt',
        order: 'desc'
      });
    }
  }, [activeTab, showInBatches]);

  useEffect(() => {
    if (activeTab === 'dispatched') {
      setIsLoading(false);
    }
  }, [activeTab]);

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
              filteredCount={(meta && meta.filteredCount) || 0}
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
        {['first', 'notDispatched'].includes(activeTab) ? (
          <div className={styles.settingPanel}>
            <div className={styles.checkBox}>
              <CheckBox
                label={'Show Only Pending Deliveries'}
                disabled={isLoading}
                checked={!!needNotShowBadStatus}
                onChange={() => {
                  setNeedNotShowBadStatus(needNotShowBadStatus === 0 ? 1 : 0);
                }}
              />
            </div>
          </div>
        ) : null}
        {['dispatched'].includes(activeTab) ? (
          <div className={styles.settingPanel}>
            <div className={styles.checkBox}>
              <CheckBox
                label={'Show in batches'}
                disabled={isLoading}
                checked={!!showInBatches}
                onChange={() => {
                  setShowInBatches(showInBatches === 1 ? 0 : 1);
                }}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.tabHeader}>
          <div className={styles.tabL}>
            <div
              className={['first', 'notDispatched'].includes(activeTab) ? styles.tabActive : styles.tab}
              onClick={() => handleChangeTab('notDispatched')}
            >
              Non dispatched
            </div>
          </div>
          <div className={styles.tabL}>
            <div
              className={activeTab === 'dispatched' ? styles.tabActive : styles.tab}
              onClick={() => handleChangeTab('dispatched')}
            >
              Dispatched
            </div>
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
          <div className={styles.consumer}>Patient</div>
          <div className={styles.courier} onClick={handleChangeSort('user.name')}>
            Courier
            {sortField === 'user.name' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
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
    setSelectedDeliveries([]);
    await setDeliveriesToDispatch(selectedDeliveries);
    await getDeliveriesList();
    setIsLoading(false);
    // eslint-disable-next-line
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
          activeTab={activeTab}
          setOpenDrawerGroup={setOpenDrawerGroup}
          setSelectedDeliveries={setSelectedDeliveries}
        />
      ) : showInBatches ? (
        <DeliveriesDispatch />
      ) : (
        <DeliveriesTable
          isLoading={isLoading}
          data={deliveryStore}
          selected={selectedDeliveries}
          path={path}
          activeTab={activeTab}
          setOpenDrawerGroup={setOpenDrawerGroup}
          setSelectedDeliveries={setSelectedDeliveries}
        />
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

      <DeliveriesFilterModal
        isOpen={isFiltersOpen}
        activeTab={activeTab}
        onClose={handleToggleFilterModal}
        batches={showInBatches}
        isDispatchedBatched={isDispatchedBatched}
        needNotShowBadStatus={needNotShowBadStatus}
      />
    </div>
  );
};
