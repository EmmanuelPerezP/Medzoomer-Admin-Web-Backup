import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';

import useTransaction from '../../hooks/useTransaction';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import Image from '../common/Image';

import styles from './Billings.module.sass';
import Select from '../common/Select';
import { filterOverviewWithAll, periodDays } from '../../constants';
import SVGIcon from '../common/SVGIcon';

const PER_PAGE = 10;

export const Billings: FC = () => {
  const { getTransactions, getTransactionsByGroup, filters, overview } = useTransaction();
  const { transactionStore, userStore } = useStores();
  const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  const getPharmacyBillingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const transactions = await getTransactions({
        perPage: PER_PAGE,
        period
      });
      transactionStore.set('overview')(transactions.data);

      const pharmacyTransactions = await getTransactionsByGroup({
        perPage: PER_PAGE,
        period
      });
      transactionStore.set('pharmacyTransactions')(pharmacyTransactions.data);
      transactionStore.set('meta')(pharmacyTransactions.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [getTransactionsByGroup, getTransactions, page, transactionStore, search, period]);

  useEffect(() => {
    getPharmacyBillingList().catch();
    // eslint-disable-next-line
  }, [page, search, period]);

  const handleChangePage = (e: object, nextPage: number) => {
    transactionStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangePeriod =(e: React.ChangeEvent<{ value: number }>) => {
    setPeriod(e.target.value);
  }

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    transactionStore.set('filters')({ ...filters, page: 0, search: e.target.value });
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <div className={styles.navigation}>
          <Search
            classes={{
              input: styles.input,
              root: styles.search,
              inputRoot: styles.inputRoot
            }}
            value={search}
            onChange={handleChangeSearch}
          />
          <Typography className={styles.title}>Income</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={transactionStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.metrics}>
          <div className={styles.headerFilter}>
            <Select
              value={period}
              onChange={handleChangePeriod}
              items={filterOverviewWithAll}
              IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
              classes={{ input: styles.input, root: styles.select }}
            />
          </div>
          <div className={styles.moneyWrapper}>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Deliveries</Typography>
              <Typography className={styles.moneyGrey}>{overview.totalCount}</Typography>
            </div>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Invoiced</Typography>
              <Typography className={classNames(styles.moneyOrange, styles.earnedOrange)}>
                ${overview.totalIncome}
              </Typography>
            </div>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Paid</Typography>
              <Typography className={classNames(styles.money, styles.earned)}>${overview.totalIncome}</Typography>
            </div>
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.pharmacy}>Group</div>
          <div className={styles.previous}>Total Deliveries</div>
          <div className={styles.income}>Invoiced</div>
          <div className={styles.payout}>Paid</div>
        </div>
      </div>
    );
  };

  const renderGroups = () => {
    return (
      <div className={classNames(styles.pharmacies, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {transactionStore.get('pharmacyTransactions')
              ? transactionStore.get('pharmacyTransactions').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={styles.pharmacy}>
                      {row.preview ? (
                        <Image
                          className={styles.avatar}
                          alt={'No Preview'}
                          src={row.preview}
                          cognitoId={userStore.get('sub')}
                        />
                      ) : (
                        <div className={styles.avatar}>{`${row.group.name[0].toUpperCase()}`}</div>
                      )}
                      {`${row.group.name}`}
                    </div>
                    <div className={styles.previous}>{row.deliveryCount}</div>
                    <div className={styles.income}>${row.pharmacyIncome}</div>
                    <div className={styles.payout}>${row.pharmacyPayout}</div>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.billingsWrapper}>
      {renderHeaderBlock()}
      {renderGroups()}
    </div>
  );
};
