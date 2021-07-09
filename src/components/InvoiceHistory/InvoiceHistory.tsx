import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import styles from './InvoiceHistory.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';
// import Search from '../common/Search';
import { IconButton, Tooltip } from '@material-ui/core';
import SVGIcon from '../common/SVGIcon';
import { Link } from 'react-router-dom';

const PER_PAGE = 10;

export const InvoiceHistory: FC = () => {
  const { getInvoiceHistory } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [listHistory, setListHistory] = useState([]);
  const [meta, setMeta] = useState({
    filteredCount: 0
  });
  const [page, setPage] = useState(0);

  const getQueueList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getInvoiceHistory({
        page,
        perPage: PER_PAGE,
        search
      });
      setListHistory(data.data);
      setMeta(data.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getInvoiceHistory, page, search]);

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
          {/*<Search*/}
          {/*  classes={{*/}
          {/*    input: styles.input,*/}
          {/*    root: styles.search,*/}
          {/*    inputRoot: styles.inputRoot*/}
          {/*  }}*/}
          {/*  value={search}*/}
          {/*  onChange={handleChangeSearch}*/}
          {/*/>*/}
          <Typography className={styles.title}>Invoice history</Typography>
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
          <div className={styles.group}>Queue</div>
          <div className={styles.group}>Effort</div>
          <div className={styles.status}>Deliveries</div>
          <div className={styles.status}>Invoiced</div>
          <div className={styles.status}>Status</div>
          <div className={styles.status}>Amount</div>
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
            {listHistory &&
              listHistory.map((row: any) => {
                return (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={styles.group}>{row.queue._id}</div>
                    <div className={styles.date}>
                      {' '}
                      {row.queue.deliveryStartDate}/{row.queue.deliveryEndDate}
                    </div>
                    <div className={styles.status}> {row.deliveryIDCollection.length}</div>
                    <div className={styles.status}>
                      <div className={styles.tr}>
                        <Link to={row.invoicedLink} target="_blank">
                          {row.invoicedId}
                        </Link>
                      </div>
                    </div>
                    <div className={styles.status}> {row.status}</div>
                    <div className={styles.status}> {row.amount || '-'}</div>
                    <div className={styles.actions}>
                      <Link to={row._id ? `/dashboard/invoice_history/${row._id}` : '-'}>
                        <Tooltip title="Details" placement="top" arrow>
                          <IconButton size="small">
                            <SVGIcon name={'details'} />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.BillingAccountWrapper}>
      {renderHeaderBlock()}
      {renderMain()}
      {/*{historyData && isHistoryOpen ? (*/}
      {/*  <HistoryModal*/}
      {/*    isOpen={isHistoryOpen}*/}
      {/*    historyData={historyData}*/}
      {/*    setEfforthandler={setEffort}*/}
      {/*    onClose={() => {*/}
      {/*      setIsHistoryOpen(false);*/}
      {/*    }}*/}
      {/*    openHistoryDelivery={setIsHistoryDeliveryOpen}*/}
      {/*  />*/}
      {/*) : null}*/}
      {/*{historyData && isHistoryDeliveryOpen ? (*/}
      {/*  <HistoryDeliveyModal*/}
      {/*    isOpen={isHistoryDeliveryOpen}*/}
      {/*    historyData={historyData}*/}
      {/*    effort={effort}*/}
      {/*    onClose={() => {*/}
      {/*      setIsHistoryDeliveryOpen(false);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*) : null}*/}
    </div>
  );
};
