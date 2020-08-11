import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import useGroup from '../../hooks/useGroup';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';

import styles from './Teams.module.sass';

const PER_PAGE = 10;

export const Teams: FC = () => {
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
          <Typography className={styles.title}>Teams</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={groupStore.get('meta') && groupStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.group}>Group Name</div>
          <div className={styles.members}>Members</div>
        </div>
      </div>
    );
  };

  const renderTeams = () => {
    return (
      <div className={classNames(styles.teams, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {groupStore.get('groups')
              ? groupStore.get('groups').map((row: any) => (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={styles.group}>
                      <div className={styles.avatar}>{`${row.name[0].toUpperCase()}`}</div>
                      {row.name}
                    </div>
                    <div className={styles.members}>{row.countPha}</div>
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.teamsWrapper}>
      {renderHeaderBlock()}
      {renderTeams()}
    </div>
  );
};
