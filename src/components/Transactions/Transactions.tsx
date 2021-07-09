import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import useTransactions from '../../hooks/useTransactions';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import EmptyList from '../common/EmptyList';

import styles from './Transactions.module.sass';
import DeliveriesFilterModal from './components/TransactionsFilterModal';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { capitalize } from '../../utils';
import { get } from 'lodash';
import { Transaction } from '../../interfaces';
import { IconButton, Tooltip } from '@material-ui/core';
import useUser from '../../hooks/useUser';
const PER_PAGE = 20;
const getTransactionStatus = (row: any) => {
  if (!(row.dwollaStatus && row.dwollaStatus.length > 0)) {
    return 'Success';
  }
  return capitalize(row.dwollaStatus).replace(/_/gi, ' ');
};
const getTransactionType = (row: any) => {
  if (row.type === 'PAYOUT' && row.service === 'INTERNAL' && row.delivery) {
    if (row.delivery && row.delivery.order && row.delivery.order_uuid) {
      return `Delivery (${row.delivery && row.delivery.order_uuid})`;
    } else if (row.delivery && row.delivery.type === 'RETURN_CASH') return `Delivery (return cash)`;
  }
  if (row.type === 'PAYOUT' && row.service === 'INTERNAL' && row.note === 'add funds') {
    return 'Bonus';
  }
  if (row.type === 'PAYOUT' && row.service === 'STRIPE') {
    return 'Tip';
  }
  if (row.type === 'WITHDRAW' && row.service === 'INTERNAL') {
    return 'Background check repayment';
  }
  if (row.type === 'WITHDRAW' && row.service === 'DWOLLA') {
    return 'Withdraw';
  }

  return capitalize(row.type);
};

export const Transactions: FC = () => {
  const { getTransactions, filters } = useTransactions();
  const { transactionsStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const user = useUser();

  const getTransactionsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const f = { ...filters };

      const transactions = await getTransactions(f);
      transactionsStore.set('transactions')(transactions.data);
      transactionsStore.set('meta')(transactions.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [transactionsStore, getTransactions, filters]);

  useEffect(() => {
    // handleChangeSort('createdAt')
    getTransactionsList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  // useEffect(() => {
  //   return () => {
  //     transactionsStore.set('filters')({ ...filters, search: '' });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleChangePage = (e: object, nextPage: number) => {
    transactionsStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleToggleFilterModal = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleChangeSort = (nextSortField: string) => () => {
    transactionsStore.set('filters')({
      ...filters,
      page: 0,
      sortField: nextSortField,
      order: order === 'asc' ? 'desc' : 'asc'
    });
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <SVGIcon name="filters" onClick={handleToggleFilterModal} className={styles.filterIcon} />
          <Typography className={styles.title}>Courier Transactions</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={filters.perPage || PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={transactionsStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
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
          <div className={styles.courier}>Courier</div>
          <div className={styles.type}>Transaction Type</div>
          <div className={styles.status} onClick={handleChangeSort('type')}>
            Status
          </div>
          <div className={styles.amount} onClick={handleChangeSort('amount')}>
            Amount
            {sortField === 'amount' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
          <div className={styles.amount} onClick={handleChangeSort('balanceAfterTransaction')}>
            Remaining Balance
            {sortField === 'balanceAfterTransaction' ? (
              order === 'desc' ? (
                <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
              ) : (
                <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
              )
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const renderWarningForcedPrice = (tx: Transaction) => {
    if (get(tx, 'delivery.forcedPriceForCourier', null)) {
      return (
        <div className={styles.warningForcedPriceContainer}>
          <Tooltip title="Price for delivery was set manually" placement="top" arrow>
            <IconButton className={styles.warningForcedPrice}>
              <SVGIcon name="details" className={styles.userActionIcon} />
            </IconButton>
          </Tooltip>
        </div>
      );
    } else return null;
  };

  const renderConsumers = () => {
    return (
      <div className={classNames(styles.transactions, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {transactionsStore.get('transactions') && transactionsStore.get('transactions').length ? (
              transactionsStore.get('transactions').map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>{moment(row.createdAt).tz(user.timezone as string).format('lll')}</div>
                  <Link
                    to={`/dashboard/couriers/${row.user && row.user._id}`}
                    className={classNames(styles.item, styles.courier)}
                  >
                    {(row.user && row.user.name) || ''} {(row.user && row.user.family_name) || ''}
                  </Link>
                  {/*<div className={classNames(styles.item, styles.type)}>*/}
                  {/*  <span*/}
                  {/*    className={classNames(styles.typeColor, {*/}
                  {/*      [styles.completed]: ['PAYOUT', 'INCOME', 'TIPS', 'BILLING'].includes(row.type),*/}
                  {/*      [styles.failed]: ['WITHDRAW', 'CHARGE'].includes(row.type)*/}
                  {/*    })}*/}
                  {/*  />*/}
                  {/*  {TransactionTypes[row.type]}*/}
                  {/*</div>*/}
                  <div className={classNames(styles.item, styles.type)}>{getTransactionType(row)}</div>
                  <div className={classNames(styles.item, styles.status)}>{getTransactionStatus(row)}</div>
                  <div
                    className={classNames(
                      styles.item,
                      styles.amount,
                      row.type === 'WITHDRAW' ? styles['amount-minus'] : styles['amount-plus']
                    )}
                  >
                    {renderWarningForcedPrice(row)}${row.amount ? Number(row.amount).toFixed(2) : '0.00'}
                  </div>
                  <div
                    className={classNames(
                      styles.item,
                      styles.amount,
                      row.balanceAfterTransaction >= 0 ? styles['amount-plus'] : styles['amount-minus']
                    )}
                  >
                    ${row.balanceAfterTransaction ? Number(row.balanceAfterTransaction).toFixed(2) : '0.00'}
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
