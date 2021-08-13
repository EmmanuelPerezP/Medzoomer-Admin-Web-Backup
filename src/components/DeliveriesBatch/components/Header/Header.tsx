import { Typography } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useBatch from '../../../../hooks/useBatch';
import { useStores } from '../../../../store';
import Pagination from '../../../common/Pagination';
import Search from '../../../common/Search';
import SVGIcon from '../../../common/SVGIcon';
import styles from './Header.module.sass';
import { IHeaderProps } from './types';

export const Header: FC<IHeaderProps> = ({ configuration, handleOpenFilter }) => {
  const history = useHistory();
  const { batchStore } = useStores();
  const { filters, meta } = useBatch();
  const [filterCounter, setFilterCounter] = useState<number>(0);

  const { startDate, endDate, pharmacy, courier } = filters;

  const handleChangePage = useCallback(
    (_, nextPage: number) => {
      batchStore.set('filters')({ ...filters, page: nextPage });
    },
    [batchStore, filters]
  );

  const handleChangeSearch = useCallback(
    (search: string) => {
      batchStore.set('filters')({ ...filters, page: 0, search });
    },
    [batchStore, filters]
  );

  useEffect(() => {
    let counter: number = 0;
    const expressions: boolean[] = [!!pharmacy, !!courier, !!startDate, !!endDate];
    expressions.map((exp) => exp && counter++);
    setFilterCounter(counter);
  }, [startDate, endDate, pharmacy, courier]);

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

      {/*
        // TODO - REMOVE ONCLICK BEFORE DEPLOY TO PROD
      */}
      <Typography className={styles.title}>
        Deliverie<span onClick={() => history.push('/dashboard/deliveries-old')}>s</span>
      </Typography>

      <div className={styles.pagination}>
        <Pagination
          rowsPerPage={configuration.perPage}
          page={filters.page}
          classes={{ toolbar: styles.paginationButton }}
          filteredCount={(meta && meta.filteredCount) || 0}
          onChangePage={handleChangePage}
        />
      </div>
    </div>
  );
};
