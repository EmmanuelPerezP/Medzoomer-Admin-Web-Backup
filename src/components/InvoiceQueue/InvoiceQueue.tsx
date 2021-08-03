import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';

import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import styles from './InvoiceQueue.module.sass';
import useSettingsGP from '../../hooks/useSettingsGP';
import Search from '../common/Search';
import { IInvoicedQueues } from '../InvoiceHistory/types';
import { Link } from 'react-router-dom';
import { getDateInvoicePeriod } from '../../utils';
import { IconButton, Tooltip } from '@material-ui/core';
import SVGIcon from '../common/SVGIcon';
import FilterModal from './components/FilterModal';

const PER_PAGE = 10;

export const InvoiceQueue: FC = () => {
  const { getInvoiceQueue } = useSettingsGP();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const [listSettings, setListSettings] = useState<IInvoicedQueues>([]);
  const [listPharmacy, setListPharmacy] = useState([]);
  const [listGroup, setListGroup] = useState([]);
  const [listContact, setListContact] = useState([]);
  const [filters, setFilters] = useState({
    endDate: '',
    startDate: '',
    runDate: '',
    settingsGP: ''
  });
  const [listAttempts, setListAttempts] = useState([]);
  const [meta, setMeta] = useState({
    filteredCount: 0
  });
  const [page, setPage] = useState(0);

  const getOwnerNameBySettingsGPId = useCallback(
    (settingsGPId: string) => {
      for (const group of listGroup) {
        // @ts-ignore
        if (group && group.settingsGP === settingsGPId) {
          // @ts-ignore
          return { link: `/dashboard/update-group/${group._id}`, name: group.name };
        }
      }
      for (const pharmacy of listPharmacy) {
        // @ts-ignore
        if (pharmacy && pharmacy.settingsGP === settingsGPId) {
          // @ts-ignore
          return { link: `/dashboard/pharmacies/${pharmacy._id}`, name: pharmacy.name };
        }
      }
    },
    [getInvoiceQueue, listGroup, listPharmacy]
  );

  const getBillingDataBySettingsGPId = useCallback(
    (settingsGPId: string) => {
      for (const contact of listContact) {
        // @ts-ignore
        if (contact && contact.settingsGP === settingsGPId) {
          return {
            link: `/dashboard/update-billing-account/${settingsGPId}`,
            // @ts-ignore
            name: contact.fullName,
            // @ts-ignore
            invoicedCustomerNumber: contact.invoicedCustomerNumber || '-'
          };
        }
      }
      return null;
    },
    [getInvoiceQueue, listContact]
  );

  const getAttempts = useCallback(
    (queueId: string) => {
      for (const attempt of listAttempts) {
        // @ts-ignore
        if (attempt && attempt._id === queueId) {
          // @ts-ignore
          return attempt.count;
        }
      }
      return 0;
    },
    [getInvoiceQueue, listAttempts]
  );

  const getQueueList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getInvoiceQueue({
        page,
        perPage: PER_PAGE,
        filters,
        search
      });

      // TODO - display real data instead of fake data
      // setListSettings(InvoicedQueueData);
      setListSettings(data.data);
      setListPharmacy(data.pharmacyData);
      setListGroup(data.groupData);
      setListAttempts(data.attempts);
      setListContact(data.contactData);

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
  }, [page, search, filters]);

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  const handleChangeSearch = (text: string) => {
    setPage(0);
    setSearch(text);
  };

  const handleToggleFilterModal = () => {
    setPage(0);
    setIsFiltersOpen(!isFiltersOpen);
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
          <SVGIcon name="filters" onClick={handleToggleFilterModal} className={styles.filterIcon} />
          <Typography className={styles.title}>Invoice Queue</Typography>

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
          <div className={styles.group}>Attempts</div>
          <div className={styles.group} />
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
              listSettings.map((item) => {
                const groupOrPharmacy = getOwnerNameBySettingsGPId(item.settingsGP._id);
                const BillingAccount = getBillingDataBySettingsGPId(item.settingsGP._id);
                return (
                  <div key={item._id} className={styles.tableItem}>
                    <div className={styles.single}>{item.queue_id}</div>
                    <div className={styles.group}>
                      <a
                        href={groupOrPharmacy ? groupOrPharmacy.link : '-'}
                        className={styles.tableLink}
                        // target="_blank"
                      >
                        {groupOrPharmacy ? groupOrPharmacy.name : '-'}
                      </a>
                    </div>
                    <div className={styles.group}>
                      {BillingAccount ? `${BillingAccount.name} (${BillingAccount.invoicedCustomerNumber})` : '-'}
                    </div>
                    <div className={styles.group}>{getDateInvoicePeriod(item.deliveryStartDateAt)}</div>
                    <div className={styles.group}>{getDateInvoicePeriod(item.deliveryEndDateAt)}</div>
                    <div className={styles.group}>{getDateInvoicePeriod(item.runDateAt)}</div>
                    <div className={styles.group}>{getAttempts(item._id)}</div>
                    <div className={styles.group}>
                      <Link to={item._id ? `/dashboard/invoice_queue/${item._id}` : '—'}>
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
      <FilterModal
        isOpen={isFiltersOpen}
        activeFilter={filters}
        handlerSearch={setFilters}
        onClose={handleToggleFilterModal}
      />
    </div>
  );
};
