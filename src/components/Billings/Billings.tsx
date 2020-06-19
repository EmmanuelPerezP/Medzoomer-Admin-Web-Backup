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

const PER_PAGE = 10;

export const Billings: FC = () => {
  const { getTransactions, getTransactionsByPharmacy, filters, overview } = useTransaction();
  const { transactionStore, userStore } = useStores();
  const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getPharmacyBillingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const transactions = await getTransactions({
        perPage: PER_PAGE
      });
      transactionStore.set('overview')(transactions.data);

      const pharmacyTransactions = await getTransactionsByPharmacy({});
      transactionStore.set('pharmacyTransactions')(pharmacyTransactions.data);
      transactionStore.set('meta')(pharmacyTransactions.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [getTransactionsByPharmacy, getTransactions, page, transactionStore, search]);

  useEffect(() => {
    getPharmacyBillingList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleChangePage = (e: object, nextPage: number) => {
    transactionStore.set('filters')({ ...filters, page: nextPage });
  };

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
          <Typography className={styles.title}>Pharmacy Billing</Typography>
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
          <div className={styles.moneyWrapper}>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Income</Typography>
              <Typography className={styles.money}>${overview.totalIncome}</Typography>
            </div>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Payout</Typography>
              <Typography className={classNames(styles.money, styles.payout)}>${overview.totalPayout}</Typography>
            </div>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Fees</Typography>
              <Typography className={classNames(styles.money, styles.earned)}>
                ${overview.totalIncome - overview.totalPayout}
              </Typography>
            </div>
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.pharmacy}>Pharmacy</div>
          <div className={styles.previous}>Previous Payout</div>
          <div className={styles.income}>Income</div>
          <div className={styles.payout}>Payout</div>
          <div className={styles.fees}>Fees</div>
        </div>
      </div>
    );
  };

  const renderPharmacies = () => {
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
                        <div className={styles.avatar}>{`${row.pharmacy.name[0].toUpperCase()}`}</div>
                      )}
                      {`${row.pharmacy.name}`}
                    </div>
                    <div className={styles.previous}>{moment(row.lastPayout).format('lll')}</div>
                    <div className={styles.income}>${row.pharmacyIncome}</div>
                    <div className={styles.payout}>${row.pharmacyPayout}</div>
                    <div className={styles.fees}>${row.pharmacyIncome - row.pharmacyPayout}</div>
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
      {renderPharmacies()}
    </div>
  );
};
