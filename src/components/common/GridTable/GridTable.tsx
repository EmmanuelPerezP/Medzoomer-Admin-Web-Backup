import { Grid, IconButton, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
// import { IconSortArrow } from '../../svg';
import styles from './GridTable.module.sass';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Loading from '../Loading';

interface GridTableProps {
  columns: any;
  rows: any;
  onSort?: any;
  role?: any;
  maxWidth?: any;
  isSmall?: boolean;
  isLoading?: boolean;
}

export const GridTable: FC<GridTableProps> = (props) => {
  const { maxWidth, columns, rows, onSort = () => true, role, isSmall, isLoading } = props;
  const [sort, setSort] = useState('asc');

  const handleSort = (id: any, isSort?: boolean) => {
    if (isSort) {
      onSort(sort, id);
      if (sort === 'asc') setSort('desc');
      else setSort('asc');
    }
  };

  return (
    <div className={styles.root}>
      <Grid container justify="center" className={clsx(styles.head, isSmall && styles.smallBox)}>
        <Grid container alignItems="center" style={{ maxWidth }}>
          {columns.map((col: any) => (
            <Grid
              key={col.id}
              container
              item
              xs={col.xs}
              className={clsx(styles.cell, {
                [styles.justifyCenter]: col.align === 'center',
                [styles.justifyLeft]: col.align === 'left',
                [styles.justifyRight]: col.align === 'right'
              })}
            >
              <div
                onClick={col.isSort ? () => handleSort(col.id, col.isSort || col.sortRole.includes(role)) : () => null}
                className={styles.titleBox}
                style={col.isSort && { cursor: 'pointer' }}
              >
                <Typography variant="subtitle2" align={col.align}>
                  {col.title}
                </Typography>
                {(col.isSort || col.sortRole) &&
                  (!col.sortRole || (col.sortRole && col.sortRole.includes(role)) ? (
                    <div className={styles.aroowWidth}>
                      <IconButton onClick={() => handleSort(col.id)} size="small">
                        <ArrowDropUpIcon />
                      </IconButton>
                      <IconButton onClick={() => handleSort(col.id)} size="small">
                        <ArrowDropDownIcon />
                      </IconButton>
                    </div>
                  ) : null)}
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <div className={clsx(styles.containerBg, isSmall && styles.smallBox)}>
        <div className={styles.container} style={{ maxWidth }}>
          {isLoading ? (
            <div className={styles.loadingBox}>
              <Loading />
            </div>
          ) : (
            rows.map((row: any, i: any) => (
              <Grid key={`row-${i}`} container alignItems="center" spacing={1}>
                {row.map((column: any, j: any) => (
                  <Grid
                    key={`col-${j}`}
                    item
                    wrap="nowrap"
                    xs={columns[j].xs}
                    // align={columns[index].align}
                    alignItems="center"
                    container
                    className={clsx(styles.cell, {
                      [styles.justifyCenter]: columns[j].align === 'center',
                      [styles.justifyLeft]: columns[j].align === 'left',
                      [styles.justifyRight]: columns[j].align === 'right'
                    })}
                  >
                    {column}
                  </Grid>
                ))}
              </Grid>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
