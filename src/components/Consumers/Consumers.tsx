import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { ConsumerStatuses } from '../../constants';
import useConsumer from '../../hooks/useConsumer';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './Consumers.module.sass';

const PER_PAGE = 10;

export const Consumers: FC = () => {
  const { path } = useRouteMatch();
  const { getConsumers, filters } = useConsumer();
  const { consumerStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getConsumersList = useCallback(async () => {
    setIsLoading(true);
    try {
      const consumers = await getConsumers({
        page,
        perPage: PER_PAGE,
        search,
        sortField,
        order
      });
      consumerStore.set('consumers')(consumers.data);
      consumerStore.set('meta')(consumers.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [consumerStore, getConsumers, order, page, search, sortField]);

  useEffect(() => {
    getConsumersList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  const handleChangePage = (e: object, nextPage: number) => {
    consumerStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    consumerStore.set('filters')({ ...filters, page: 0, search: e.target.value });
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
            value={filters.search}
            onChange={handleChangeSearch}
          />
          <Typography className={styles.title}>Consumer Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={consumerStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.consumer}>Consumer</div>
          <div className={styles.phone}>Phone</div>
          <div className={styles.email}>Email</div>
          <div className={styles.orders}>Orders</div>
          <div className={styles.status}>Status</div>
          <div className={styles.actions}>Actions</div>
        </div>
      </div>
    );
  };

  const renderConsumers = () => {
    return (
      <div className={classNames(styles.consumers, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {consumerStore.get('consumers')
              ? consumerStore.get('consumers').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={classNames(styles.item, styles.consumer)}>
                      <div className={styles.avatar}>
                        {row.name ? (
                          `${row.name[0].toUpperCase()} ${row.family_name && row.family_name[0].toUpperCase()}`
                        ) : (
                          <PersonOutlineIcon />
                        )}
                      </div>
                      <span className={styles.name}>{row.name ? `${row.name} ${row.family_name}` : '...'}</span>
                    </div>
                    <div className={classNames(styles.item, styles.phone)}>{row.phone && row.phone}</div>
                    <div className={classNames(styles.item, styles.email)}>{row.email ? row.email : '-'}</div>
                    <div className={classNames(styles.item, styles.orders)} />
                    <div className={classNames(styles.item, styles.status)}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: row.status !== 'ACTIVE',
                          [styles.declined]: row.status === 'DECLINED'
                        })}
                      />
                      {!row.status && ConsumerStatuses.ACTIVE}
                    </div>
                    <div className={classNames(styles.item, styles.actions)}>
                      <SVGIcon name={'edit'} style={{ height: '15px', width: '15px', marginRight: '30px' }} />
                      <Link to={`${path}/${row._id}`} hidden={!row.name}>
                        <SVGIcon name={'details'} style={{ height: '15px', width: '15px' }} />
                      </Link>
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
    <div className={styles.consumerWrapper}>
      {renderHeaderBlock()}
      {renderConsumers()}
    </div>
  );
};
