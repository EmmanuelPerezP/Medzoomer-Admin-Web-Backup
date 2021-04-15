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

const PER_PAGE = 10;

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

  const handleSelectAll = () => {
    const arr = deliveryStore.get('deliveries');
    let selected: any = arr.map((e) => e._id);
    setSelectedDeliveries(selected);
  }

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

  const handleSaveTitle = (title: string, id: string) => {
    console.log('C! group title', title);
    console.log('C! group id', id);
  }

  const handleCreate = () => {
    console.log('C! selectedDeliveries', selectedDeliveries);
  }

  return (
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}

      <DeliveriesTable
        isLoading={isLoading}
        data={deliveryStore}
        selected={selectedDeliveries}
        path={path}
        setOpenDrawerGroup={setOpenDrawerGroup}
        setSelectedDeliveries={setSelectedDeliveries}
      />

      {!isLoading &&
        [deliveryStore].map((data, index) => (
          <DeliveriesDispatch
            key={index}
            data={data}
            handleSaveTitle={handleSaveTitle}
            path={path}
          />
        ))
      }

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

      <DeliveriesFilterModal isOpen={isFiltersOpen} onClose={handleToggleFilterModal} />
    </div>
  );
};
