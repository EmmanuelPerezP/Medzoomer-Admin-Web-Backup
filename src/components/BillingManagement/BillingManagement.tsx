import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import useBillingManagement from '../../hooks/useBillingManagement';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';

import styles from './BillingManagement.module.sass';
const PER_PAGE = 10;

export const BillingManagement: FC = () => {
  const { getBillings, filters, removeBilling } = useBillingManagement();
  const { billingAccountStore } = useStores();
  const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getBillingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const billing = await getBillings({
        page,
        perPage: PER_PAGE,
        search
      });
      billingAccountStore.set('billings')(billing.data);
      billingAccountStore.set('meta')(billing.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getBillings, page, billingAccountStore, search]);

  useEffect(() => {
    getBillingList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleChangePage = (e: object, nextPage: number) => {
    billingAccountStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    billingAccountStore.set('filters')({ ...filters, page: 0, search: e.target.value });
  };

  const handleRemoveBillingAccount = (id: string) => {
    removeBilling(id)
      .then(() => {
        getBillingList().catch();
      })
      .catch();
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
          <Typography className={styles.title}>Billing Account Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={billingAccountStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Button className={styles.button} variant="contained" color="secondary">
              <Link className={styles.link} to={'/dashboard/create-billing-account'}>
                Add New Billing Account
              </Link>
            </Button>
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.group}>Billing Account </div>
          <div>Title</div>
          <div>Company</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className={classNames(styles.billingAccounts, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {billingAccountStore.get('billings')
              ? billingAccountStore.get('billings').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={styles.group}>
                      <div className={styles.avatar}>{`${row.name[0].toUpperCase()}`}</div>
                      {row.name}
                    </div>
                    <div>{row.title}</div>
                    <div>{row.companyName}</div>
                    <div className={styles.actions}>
                      <Link to={`/dashboard/update-billing-account/${row._id}`}>
                        <SVGIcon name={'edit'} style={{ height: '15px', width: '15px', marginRight: '30px' }} />
                      </Link>
                      <SVGIcon
                        name={'remove'}
                        style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                        onClick={() => {
                          handleRemoveBillingAccount(row._id);
                        }}
                      />
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.BillingAccountWrapper}>
      {renderHeaderBlock()}
      {renderMain()}
    </div>
  );
};
