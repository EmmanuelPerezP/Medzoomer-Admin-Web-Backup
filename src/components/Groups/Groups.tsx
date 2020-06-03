import React, { FC, useEffect, useState, useCallback } from 'react';
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

import styles from './Groups.module.sass';

const PER_PAGE = 10;

export const Groups: FC = () => {
  const { getGroups, filters, removeGroup } = useGroup();
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

  const handleRemoveGroup = (id: string) => {
    removeGroup(id).then(()=>{
      getGroupsList().catch()
    })
  }

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
          <Typography className={styles.title}>Group Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={groupStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Button className={styles.button} variant="contained" color="secondary">
              <Link className={styles.link} to={'/dashboard/create-group'}>
                Add New Group
              </Link>
            </Button>
          </div>
        </div>
        <div className={styles.tableHeader}>
          <div className={styles.group}>Group</div>
          <div className={styles.fee}>Assigned Pharmacies</div>
          <div className={styles.actions}>Actions</div>
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
                    <div className={styles.group}>
                      <div className={styles.avatar}>{`${row.name[0].toUpperCase()}`}</div>
                      {row.name}
                    </div>
                    <div className={styles.fee}>{0}</div>
                    <div className={styles.actions}>
                      <Link to={`/dashboard/update-group/${row._id}`} >
                        <SVGIcon name={'edit'} style={{ height: '15px', width: '15px', marginRight: '30px' }} />
                      </Link>
                      <SVGIcon
                        name={'remove'}
                        style={{ height: '15px', width: '15px', cursor: 'pointer'}}
                        onClick={()=>{
                          handleRemoveGroup(row._id)
                        }}
                      />
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
