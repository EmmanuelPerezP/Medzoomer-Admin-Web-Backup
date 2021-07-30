import { Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import Pagination from '../../../common/Pagination';
import Search from '../../../common/Search';
import SVGIcon from '../../../common/SVGIcon';
import styles from './Header.module.sass';
import { IHeaderProps } from './types';

export const Header: FC<IHeaderProps> = ({ configuration, handleOpenFilter }) => {
  const [filterCounter, setFilterCounter] = useState<number>(0);

  return (
    <div className={styles.container}>
      <div className={styles.leftPart}>
        <Search
          classes={{
            input: styles.input,
            root: styles.search,
            inputRoot: styles.inputRoot
          }}
          // value={filters.search}
          // onChange={handleChangeSearch}
          onChange={() => ''}
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

      <Typography className={styles.title}>Delivery Management</Typography>

      <div className={styles.pagination}>
        <Pagination
          rowsPerPage={configuration.perPage}
          page={1}
          // page={filters.page}
          classes={{ toolbar: styles.paginationButton }}
          filteredCount={1}
          onChangePage={() => ''}
          // filteredCount={(meta && meta.filteredCount) || 0}
          // onChangePage={handleChangePage}
        />
      </div>
    </div>
  );
};
