import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import usePharmacy from '../../hooks/usePharmacy';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import Image from '../common/Image';

import styles from './Billings.module.sass';

const PER_PAGE = 10;

export const Billings: FC = () => {
  const { getPharmacies, filters } = usePharmacy();
  const { pharmacyStore, userStore } = useStores();
  const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getGroupsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const pharmacies = await getPharmacies({
        page,
        perPage: PER_PAGE,
        search
      });
      pharmacyStore.set('pharmacies')(pharmacies.data);
      pharmacyStore.set('meta')(pharmacies.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getPharmacies, page, pharmacyStore, search]);

  useEffect(() => {
    getGroupsList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleChangePage = (e: object, nextPage: number) => {
    pharmacyStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    pharmacyStore.set('filters')({ ...filters, page: 0, search: e.target.value });
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
              filteredCount={pharmacyStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.metrics}>
          <div className={styles.moneyWrapper}>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Income</Typography>
              <Typography className={styles.money}>$0</Typography>
            </div>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Payout</Typography>
              <Typography className={classNames(styles.money, styles.payout)}>$0</Typography>
            </div>
            <div className={styles.moneyBlock}>
              <Typography className={styles.title}>Total Fees</Typography>
              <Typography className={classNames(styles.money, styles.earned)}>$0</Typography>
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
            {pharmacyStore.get('pharmacies')
              ? pharmacyStore.get('pharmacies').map((row: any) => (
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
                        <div className={styles.avatar}>{`${row.name[0].toUpperCase()}`}</div>
                      )}
                      {`${row.name}`}
                    </div>
                    <div className={styles.previous}>Mar 12, 2020</div>
                    <div className={styles.income}>$2,000</div>
                    <div className={styles.payout}>$2,000</div>
                    <div className={styles.fees}>$2,000</div>
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
