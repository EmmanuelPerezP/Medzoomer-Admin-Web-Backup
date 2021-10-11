import { IconButton, Tooltip } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { IInvoicedHistories } from './types';
import { Link } from 'react-router-dom';
import Loading from '../common/Loading';
import Pagination from '../common/Pagination';
import SVGIcon from '../common/SVGIcon';
import Search from '../common/Search';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { getStringInvoicePeriod } from '../../utils';
import styles from './InvoiceHistory.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';

const PER_PAGE = 10;

export const InvoiceHistory: FC = () => {
  const { getInvoiceHistory } = useSettingsGP();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [listHistory, setListHistory] = useState<IInvoicedHistories>([]);
  const [contacts, setContacts] = useState([]);
  const [pharmaciesOrGroups, setPharmaciesOrGroups] = useState([]);
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
      setContacts(data.contactData);
      setPharmaciesOrGroups(data.pharmaciesOrGroupsWithNoDeliveries);

      setMeta(data.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getInvoiceHistory, page, search]);

  const getContact = useCallback(
    (settingsGP) => {
      for (const contact of contacts) {
        // @ts-ignore
        if (contact.settingsGP === settingsGP) {
          return contact;
        }
      }
      return null;
    },
    [contacts]
  );

  useEffect(() => {
    getQueueList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  const handleChangeSearch = (text: string) => {
    setPage(0);
    setSearch(text);
  };

  const checkPharmacyOrGroup = (row: any) => {
    if (row.pharmacy && row.pharmacy.affiliation === 'independent') {
      return (
        <a href={`/dashboard/pharmacies/${row.pharmacy._id}`} className={styles.tableLink}>
          {row.pharmacy.name}
        </a>
      );
    } else if ((row.pharmacy && row.pharmacy.affiliation === 'group') || row.group) {
      return (
        <a href={`/dashboard/update-group/${row.group._id}`} className={styles.tableLink}>
          {row.group.name}
        </a>
      );
    }
  };

  const checkPharmacyOrGroupWhenNoDeliveries = (pharmacyConfigurationID: string) => {
    const pharmacyOrGroup = pharmaciesOrGroups.find(
      item => item["settingsGP"] === pharmacyConfigurationID
    );

    if (pharmacyOrGroup) {
      return (
        <a
          href={
            pharmacyOrGroup["affiliation"] === "independent"
              ? `/dashboard/pharmacies/${pharmacyOrGroup["_id"]}`
              : `/dashboard/update-group/${pharmacyOrGroup["_id"]}`
          }
          className={styles.tableLink}
        >
          {pharmacyOrGroup["name"]}
        </a>
      );
    }
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
          <Typography className={styles.title}>Invoice History</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={meta && meta.filteredCount ? meta.filteredCount : 0}
              // filteredCount={3}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.single}>Invoice ID</div>
          <div className={styles.single}>Invoice Number</div>
          <div className={styles.pharmacyOrGroup}>Pharmacy/Group</div>
          <div className={styles.single}>Billing Contact</div>
          <div className={styles.single}>Billing Period</div>
          <div className={styles.single}>Deliveries</div>
          <div className={styles.status}>Amount</div>
          <div className={styles.status}>Status</div>
          <div className={styles.actions} />
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
              listHistory.map((item: any) => {
                const amount = item.amount ? `$${Number(item.amount).toFixed(2)}` : '—';
                const deliveries = (item.deliveryIDCollection || []).length;
                const contact: any = getContact(item.queue.settingsGP);
                const pharmacyOrGroup = item.deliveryIDCollection[0]
                  ? checkPharmacyOrGroup(item.deliveryIDCollection[0])
                  : pharmaciesOrGroups.length !== 0
                    ? checkPharmacyOrGroupWhenNoDeliveries(item.queue.settingsGP)
                    : '';

                return (
                  <div key={item._id} className={styles.tableItem}>
                    <div className={styles.single}>{item.history_id}</div>
                    <div className={styles.single}>
                      {item.invoicedNumber ? (
                        <a
                          href={item.invoicedLink}
                          className={styles.tableLink}
                          target="_blank" // eslint-disable-line
                        >
                          {item.invoicedNumber}
                        </a>
                      ) : (
                        '—'
                      )}
                    </div>
                    <div className={styles.pharmacyOrGroup}>{pharmacyOrGroup ? pharmacyOrGroup : '—'}</div>
                    <div className={styles.single}>{contact ? contact.fullName : '—'}</div>
                    <div className={styles.single}>{getStringInvoicePeriod(item.queue)}</div>
                    <div className={styles.single}>{deliveries}</div>
                    <div className={styles.status}>{amount}</div>
                    <div className={classNames(styles.status, styles.rowCentered)}>
                      <div
                        className={classNames(styles.itemStatus, {
                          [styles.statusSent]: item.status === 'SENT',
                          [styles.statusError]: item.status === 'ERROR'
                        })}
                      />
                      {item.status}
                    </div>
                    <div className={styles.actions}>
                      <Link to={item._id ? `/dashboard/invoice_history/${item._id}` : '—'}>
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
    </div>
  );
};
