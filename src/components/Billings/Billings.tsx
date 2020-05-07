import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import useGroup from '../../hooks/useGroup';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';

import styles from './Billings.module.sass';

const PER_PAGE = 10;

export const Billings: FC = () => {
  const { path } = useRouteMatch();
  const { getGroups, filters } = useGroup();
  const { groupStore } = useStores();
  const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);

  const getGroupsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const groups = await getGroups({
        page,
        perPage: PER_PAGE,
        search
      });
      groupStore.set('groups')(groups.data);
      groupStore.set('meta')(groups.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getGroups, page, groupStore, search]);

  useEffect(() => {
    getGroupsList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleChangePage = (e: object, nextPage: number) => {
    groupStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    groupStore.set('filters')({ ...filters, page: 0, search: e.target.value });
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
          <Typography className={styles.title}>Pharmacy Billing</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={groupStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.group}>Pharmacy</div>
          <div className={styles.fee}>Previous Payout</div>
          <div className={styles.actions}>Income</div>
        </div>
      </div>
    );
  };

  const renderGroups = () => {
    return (
      <div className={classNames(styles.groups, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {groupStore.get('groups')
              ? groupStore.get('groups').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={styles.group}>{`${row.name}`}</div>
                    <div className={styles.address}>{row.fee}</div>
                    <div className={styles.actions}>
                      <SVGIcon name={'billing'} style={{ height: '15px', width: '15px', marginRight: '30px' }} />
                      <Link to={`${path}/${row._id}`}>
                        <SVGIcon name={'edit'} style={{ height: '15px', width: '15px' }} />
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
    <div className={styles.groupsWrapper}>
      {renderHeaderBlock()}
      {renderGroups()}
    </div>
  );
};
