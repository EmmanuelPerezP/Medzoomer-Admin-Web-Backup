import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import useBillingManagement from '../../hooks/useBillingManagement';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
// import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';

import styles from './BillingManagement.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';

const PER_PAGE = 10;

interface IInvoiceType {
  draft: string;
  not_sent: string;
  sent: string;
  viewed: string;
  past_due: string;
  pending: string;
  paid: string;
  voided: string;
}

const INVOICE_STATUS_MAPPING: IInvoiceType = {
  draft: 'Draft',
  not_sent: 'Not sent',
  sent: 'Sent',
  viewed: 'Viewed',
  past_due: 'Past due',
  pending: 'Pending',
  paid: 'Paid',
  voided: 'Voided'
};
const getInvoiceStatus = (status: string) => {
  return _.get(INVOICE_STATUS_MAPPING, status) || '';
};

export const BillingManagement: FC = () => {
  const { getBillings, filters, removeBilling } = useBillingManagement();
  const { getSettingListGP, removeSettingsGP } = useSettingsGP();
  const { billingAccountStore } = useStores();
  const { search } = filters;
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
  // const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
  //   billingAccountStore.set('filters')({ ...filters, page: 0, search: e.target.value });
  // };

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
          {/*<Search*/}
          {/*  classes={{*/}
          {/*    input: styles.input,*/}
          {/*    root: styles.search,*/}
          {/*    inputRoot: styles.inputRoot*/}
          {/*  }}*/}
          {/*  value={search}*/}
          {/*  onChange={handleChangeSearch}*/}
          {/*/>*/}
          <Typography className={styles.title}>Billing Management</Typography>
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
          <div className={styles.group}>Name</div>
          {/*<div className={styles.fee}>Assigned Pharmacies</div>*/}
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
            {listSettings &&
              listSettings.map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={styles.group}>
                    <div className={styles.avatar}>{`${row.name && row.name[0].toUpperCase()}`}</div>
                    {row.name}
                  </div>
                  {/*<div className={styles.status}>{"-"}</div>*/}
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
              ))}
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
