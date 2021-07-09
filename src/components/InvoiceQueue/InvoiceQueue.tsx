import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';

import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import styles from './InvoiceQueue.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';
import Search from '../common/Search';

const PER_PAGE = 10;

export const InvoiceQueue: FC = () => {
  const { getInvoiceQueue } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [listSettings, setListSettings] = useState([]);
  const [meta, setMeta] = useState({
    filteredCount: 0
  });
  const [page, setPage] = useState(0);

  const getQueueList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getInvoiceQueue({
        page,
        perPage: PER_PAGE,
        search
      });
      setListSettings(data.data);
      setMeta(data.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getInvoiceQueue, page, search]);

  useEffect(() => {
    getQueueList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  const handleChangeSearch = (text: string) => {
    setSearch(text);
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
          <Typography className={styles.title}>Invoice queue</Typography>

          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={meta.filteredCount}
              // filteredCount={3}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.group}>Name</div>
          <div className={styles.group}>Start Date</div>
          <div className={styles.group}>End Date</div>
          <div className={styles.group}>Run Date</div>
          <div className={styles.group}>Status</div>
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
                    <div className={styles.avatar}>{`${row.settingsGP.name &&
                      row.settingsGP.name[0].toUpperCase()}`}</div>
                    {row.settingsGP.name}
                  </div>
                  <div className={styles.date}> {row.deliveryStartDate}</div>
                  <div className={styles.date}> {row.deliveryEndDate}</div>
                  <div className={styles.date}> {row.runDate}</div>
                  {/*<div className={styles.date}> {row.invoicedId}</div>*/}
                  <div className={styles.date}> {row.status}</div>
                  {/*<div className={styles.date}> {row.amount || '-'}</div>*/}
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
