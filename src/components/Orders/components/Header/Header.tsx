import styles from './Header.module.sass';
import React, { FC, useCallback, useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';

import Search from '../../../common/Search';
import Pagination from '../../../common/Pagination';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';

import { IHeaderProps } from './types';
import { useStores } from '../../../../store';
import { useBooleanState } from '../../../../hooks/useBooleanState';
import useOrder from '../../../../hooks/useOrder';
import { downloadCSV, parseOrderFilter } from '../../utils';

export const Header: FC<IHeaderProps> = ({ configuration, handleOpenFilter }) => {
  const [isLoading, showLoader, hideLoader] = useBooleanState();
  const { orderStore } = useStores();
  const { filters, meta, exportOrders } = useOrder();
  const [filterCounter, setFilterCounter] = useState<number>(0);

  const { status, pharmacy, startDate, endDate } = filters;

  const handleExport = async () => {
    try {
      showLoader();
      filters.perPage = 0;
      const data = await exportOrders(parseOrderFilter(filters));
      if (data.error) throw data.error;
      downloadCSV('orders.csv', data.url);
      hideLoader();
    } catch (error) {
      hideLoader();
      console.error('Error while exporting orders ', { error });
      alert(`It's seems like something went wrong!\n\nTry creating the export again.`);
    }
  };

  const handleChangePage = useCallback(
    (_, nextPage: number) => {
      orderStore.set('filters')({ ...filters, page: nextPage });
    },
    [orderStore, filters]
  );

  const handleChangeSearch = useCallback(
    (search: string) => {
      orderStore.set('filters')({ ...filters, page: 0,perPage:10, search });
    },
    [orderStore, filters]
  );

  useEffect(() => {
    let counter: number = 0;
    const expressions: boolean[] = [!!(status && status !== 'all'), !!pharmacy, !!startDate, !!endDate];
    expressions.map((exp) => exp && counter++);
    setFilterCounter(counter);
  }, [status, pharmacy, startDate, endDate]);

  return (
    <div className={styles.container}>
      <div className={styles.leftPart}>
        <Search
          classes={{
            input: styles.input,
            root: styles.search,
            inputRoot: styles.inputRoot
          }}
          value={filters.search}
          onChange={handleChangeSearch}
        />

        <div className={styles.filterContainer}>
          <SVGIcon name="filters" onClick={handleOpenFilter} className={styles.filterIcon} />
          {!!filterCounter && (
            <div className={styles.counterContainer} onClick={handleOpenFilter}>
              <Typography className={styles.counter}>{filterCounter}</Typography>
            </div>
          )}
        </div>
      </div>

      <Typography className={styles.title}>Orders</Typography>

      <div className={styles.pagination}>
        <Pagination
          rowsPerPage={configuration.perPage}
          page={filters.page}
          classes={{ toolbar: styles.paginationButton }}
          filteredCount={(meta && meta.filteredCount) || 0}
          onChangePage={handleChangePage}
        />
        {isLoading ? (
          <Loading />
        ) : (
          <Button variant="outlined" color="secondary" disabled={isLoading} onClick={handleExport}>
            <Typography>Export</Typography>
          </Button>
        )}
      </div>
    </div>
  );
};
