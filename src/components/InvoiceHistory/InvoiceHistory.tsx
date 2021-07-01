import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import styles from './InvoiceHistory.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';
import Search from '../common/Search';
import HistoryModal from './components/HistoryModal';
import HistoryDeliveyModal from './components/HistoryDeliveyModal';

const PER_PAGE = 10;

export const InvoiceHistory: FC = () => {
  const { getInvoiceHistory } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [historyData, setHistoryData] = useState('');
  const [effort, setEffort] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryDeliveryOpen, setIsHistoryDeliveryOpen] = useState(false);
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
          <Search
            classes={{
              input: styles.input,
              root: styles.search,
              inputRoot: styles.inputRoot
            }}
            value={search}
            onChange={handleChangeSearch}
          />
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
          <div className={styles.group}>Name</div>
          <div className={styles.group}>Start Date</div>
          <div className={styles.group}>End Date</div>
          <div className={styles.group}>Run Date</div>
          <div className={styles.group}>Deliveries</div>
          <div className={styles.group}>Attempts</div>
          <div className={styles.group}>Invoiced</div>
          <div className={styles.group}>Status</div>
          <div className={styles.group}>Amount</div>
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
                    <div className={styles.group}>
                      <div className={styles.avatar}>{`${row.detail.queue.settingGP[0].name &&
                        row.detail.queue.settingGP[0].name[0].toUpperCase()}`}</div>
                      {row.detail.queue.settingGP[0].name}
                    </div>
                    <div className={styles.date}> {row.detail.queue.deliveryStartDate}</div>
                    <div className={styles.date}> {row.detail.queue.deliveryEndDate}</div>
                    <div className={styles.date}> {row.detail.queue.runDate}</div>
                    <div className={styles.date}> {row.detail.deliveryIDCollection.length}</div>
                    <div className={styles.date}> {row.count}</div>
                    <div className={styles.date}> {row.detail.invoicedId}</div>
                    <div className={styles.date}> {row.detail.status}</div>
                    <div className={styles.date}> {row.detail.amount || '-'}</div>
                    <div className={styles.actions}>
                      <Button
                        className={styles.buttonResend}
                        variant="contained"
                        onClick={() => {
                          setHistoryData(row);
                          setIsHistoryOpen(true);
                        }}
                        color="secondary"
                      >
                        View
                      </Button>
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
      {historyData && isHistoryOpen ? (
        <HistoryModal
          isOpen={isHistoryOpen}
          historyData={historyData}
          setEfforthandler={setEffort}
          onClose={() => {
            setIsHistoryOpen(false);
          }}
          openHistoryDelivery={setIsHistoryDeliveryOpen}
        />
      ) : null}
      {historyData && isHistoryDeliveryOpen ? (
        <HistoryDeliveyModal
          isOpen={isHistoryDeliveryOpen}
          historyData={historyData}
          effort={effort}
          onClose={() => {
            setIsHistoryDeliveryOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
