import React, { FC, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import useGroup from '../../hooks/useGroup';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';
import EmptyList from '../common/EmptyList';
import KeyModal from './components/KeyModal';

import styles from './Groups.module.sass';

const PER_PAGE = 10;

export const Groups: FC = () => {
  const { getGroups, filters, removeGroup /*, generateReport*/ } = useGroup();
  const { groupStore } = useStores();
  const { page, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isKeyOpen, setIsKeyOpen] = useState(false);
  const [keys, setKeys] = useState(null);
  // const [isReportGenerate, setIsReportGenerate] = useState(false);

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

  // useEffect(() => {
  //   return () => {
  //     groupStore.set('filters')({ ...filters, search: '' });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleChangePage = (e: object, nextPage: number) => {
    groupStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (text: string) => {
    groupStore.set('filters')({ ...filters, page: 0, search: text });
  };

  const handleRemoveGroup = (id: string) => {
    removeGroup(id)
      .then(() => {
        getGroupsList().catch();
      })
      .catch();
  };

  // tslint:disable-next-line:no-shadowed-variable
  const handleShowKey = (keys: any) => {
    if (keys && keys.hasOwnProperty('publicKey')) {
      setKeys(keys);
      setIsKeyOpen(true);
    }
  };

  // const handleGenerateReport = async () => {
  //   setIsReportGenerate(true);
  //   await generateReport().catch(console.error);
  //   setIsReportGenerate(false);
  // };

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
              filteredCount={groupStore.get('meta') && groupStore.get('meta').filteredCount}
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
            {groupStore.get('groups') && groupStore.get('groups').length ? (
              groupStore.get('groups').map((row: any) => (
                <div key={row._id} className={styles.tableItem}>
                  <div className={styles.group}>
                    <div className={styles.avatar}>{`${row.name[0].toUpperCase()}`}</div>
                    {row.name}
                  </div>
                  <div className={styles.fee}>{row.countPha}</div>
                  <div className={styles.actions}>
                    <Link to={`/dashboard/update-group/${row._id}`}>
                      <Tooltip title="Edit" placement="top" arrow>
                        <IconButton className={styles.action}>
                          <SVGIcon name={'edit'} className={styles.groupActionIcon} />
                        </IconButton>
                      </Tooltip>
                    </Link>
                    <Tooltip title="Delete" placement="top" arrow>
                      <IconButton className={styles.action} onClick={() => handleRemoveGroup(row._id)}>
                        <SVGIcon name={'remove'} className={styles.groupActionIcon} />
                      </IconButton>
                    </Tooltip>
                    {/*<Tooltip title='Show key' placement='top' arrow>
                      <IconButton className={styles.action} onClick={() => handleShowKey(row.keys)}>
                        <SVGIcon name={'key'} className={styles.groupActionIconKey} />
                      </IconButton>
                    </Tooltip>*/}
                  </div>
                </div>
              ))
            ) : (
              <EmptyList />
            )}
          </div>
        )}
        {keys && isKeyOpen ? (
          <KeyModal
            isOpen={isKeyOpen}
            keys={keys}
            onClose={() => {
              setIsKeyOpen(false);
            }}
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.groupsWrapper}>
      {renderHeaderBlock()}

      {/*<div style={{ textAlign: 'right', padding: 15 }}>*/}
      {/*  {isReportGenerate ? (*/}
      {/*    <Loading />*/}
      {/*  ) : (*/}
      {/*    <Button color="primary" variant={'contained'} onClick={handleGenerateReport} style={{ padding: '5px 10px' }}>*/}
      {/*      Generate report*/}
      {/*    </Button>*/}
      {/*  )}*/}
      {/*</div>*/}
      {renderGroups()}
    </div>
  );
};
