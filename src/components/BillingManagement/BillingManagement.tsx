import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useStores } from '../../store';

import useBillingManagement from '../../hooks/useBillingManagement';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';

import styles from './BillingManagement.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';
import Search from '../common/Search';
import EmptyList from '../common/EmptyList';

const PER_PAGE = 10;

export const BillingManagement: FC = () => {
  const { filters } = useBillingManagement();
  const { getSettingListGP, removeSettingsGP } = useSettingsGP();
  const { search } = filters;
  const { billingAccountStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [listSettings, setListSettings] = useState([]);
  const [meta, setMeta] = useState({
    filteredCount: 0
  });
  const [page, setPage] = useState(0);

  const getSettingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSettingListGP({
        page,
        perPage: PER_PAGE,
        search
      });
      setListSettings(data.data);
      setMeta(data.meta);
      // billingAccountStore.set('billings')(billing.data);
      // billingAccountStore.set('meta')(billing.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getSettingListGP, page, search]);

  useEffect(() => {
    getSettingList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  // useEffect(() => {
  //   return () => {
  //     billingAccountStore.set('filters')({ ...filters, search: '' });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
    // billingAccountStore.set('filters')({ ...filters, page: nextPage });
  };
  //
  const handleChangeSearch = (text: string) => {
    billingAccountStore.set('filters')({ ...filters, page: 0, search: text });
  };

  const handleRemoveBillingAccount = (id: string) => {
    removeSettingsGP(id)
      .then(() => {
        getSettingList().catch();
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
          <Typography className={styles.title}>Pharmacy Configuration</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={meta.filteredCount}
              // filteredCount={3}
              onChangePage={handleChangePage}
            />
            <Button className={styles.button} variant="contained" color="secondary">
              <Link className={styles.link} to={'/dashboard/create-billing-account'}>
                Add Account
              </Link>
            </Button>
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.group}>Billing Account</div>
          <div className={styles.contacts}>Contacts</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderMain = () => {
    return (
      <div className={classNames(styles.billingAccount, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {listSettings.length > 0 ? (
              listSettings.map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={styles.group}>{row.name}</div>
                  <div className={styles.status}>{row.countContacts}</div>
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
            ) : (
              <EmptyList />
            )}
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
