import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import useTeams from '../../hooks/useTeams';
import { useStores } from '../../store';

// import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';

import styles from './Teams.module.sass';

// const PER_PAGE = 10;

export const Teams: FC = () => {
  const { getTeams, teams } = useTeams();
  const { teamsStore } = useStores();
  // const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const getTeamsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const groups = await getTeams();
      teamsStore.set('teams')(groups.data.teams);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getTeams, teamsStore]);

  useEffect(() => {
    getTeamsList().catch();
    // eslint-disable-next-line
  }, []);

  // const handleChangePage = (e: object, nextPage: number) => {
  //   groupStore.set('filters')({ ...filters, page: nextPage });
  // };
  //
  const handleChangeSearch = (e: React.ChangeEvent<{ value: string }>) => {
    setSearch(e.target.value);
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
            {teams
              ? teams.map((row: any) =>
                  row.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ? (
                    <div key={row.id} className={styles.tableItem}>
                      <div className={styles.group}>
                        <div className={styles.avatar}>{`${row.name[0].toUpperCase()}${row.name.slice(1)}`}</div>
                      </div>
                      <div className={styles.members}>{row.workers.length}</div>
                    </div>
                  ) : null
                )
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
