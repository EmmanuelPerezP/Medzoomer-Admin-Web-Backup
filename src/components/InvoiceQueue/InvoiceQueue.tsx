import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';

import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import styles from './InvoiceQueue.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';
import Search from '../common/Search';
import { InvoicedQueueData } from '../InvoiceHistory/data';
import { IInvoicedQueues } from '../InvoiceHistory/types';
import { Link } from 'react-router-dom';

const PER_PAGE = 10;

export const InvoiceQueue: FC = () => {
  const { getInvoiceQueue } = useSettingsGP();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [listSettings, setListSettings] = useState<IInvoicedQueues>([]);
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

      // TODO - display real data instead of fake data
      setListSettings(InvoicedQueueData);

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
          <div className={styles.single}>Queue ID</div>
          <div className={styles.group}>Pharamcy/Group</div>
          <div className={styles.group}>Billing Contact</div>
          <div className={styles.group}>Start Date</div>
          <div className={styles.group}>End Date</div>
          <div className={styles.group}>Run Date</div>
        </div>
      </div>
    );
  };

  const getDateInFormat = (date: string) => {
    if (!date) return '-';
    const d = new Date(date);
    const pad = (v: number) => String(v).padStart(2, '0');
    return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
  };

  const renderMain = () => {
    return (
      <div className={classNames(styles.billingAccount, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {listSettings &&
              listSettings.map((item) => (
                <div key={item._id} className={styles.tableItem}>
                  <div className={styles.single}>{item._id}</div>
                  <div className={styles.group}>
                    <Link to={'—'} className={styles.tableLink}>
                      CVS Pharmacy
                    </Link>
                  </div>
                  <div className={styles.group}>
                    <Link to={'—'} className={styles.tableLink}>
                      Jacqueline Herrera
                    </Link>
                  </div>
                  <div className={styles.group}>{getDateInFormat(item.deliveryStartDate)}</div>
                  <div className={styles.group}>{getDateInFormat(item.deliveryEndDate)}</div>
                  <div className={styles.group}>{getDateInFormat(item.runDate)}</div>
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
