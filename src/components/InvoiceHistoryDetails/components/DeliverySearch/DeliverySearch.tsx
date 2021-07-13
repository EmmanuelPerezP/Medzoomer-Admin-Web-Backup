import React, { FC } from 'react';
import { IDeliverySearch } from './types';
import styles from './DeliverySearch.module.sass';
import { Typography } from '@material-ui/core';
import Search from '../../../common/Search';

export const DeliverySearch: FC<IDeliverySearch> = ({ onChangeSearchValue, searchValue, amount }) => {
  return (
    <div className={styles.container}>
      <div className={styles.descriptionContainer}>
        <Typography className={styles.title}>Total Amount</Typography>
        <Typography className={styles.value}>${Number(amount).toFixed(2)}</Typography>
      </div>
      <div className={styles.searchContainer}>
        <Search
          classes={{
            input: styles.input,
            root: styles.search,
            inputRoot: styles.inputRoot
          }}
          value={searchValue}
          onChange={onChangeSearchValue}
        />
      </div>
    </div>
  );
};
