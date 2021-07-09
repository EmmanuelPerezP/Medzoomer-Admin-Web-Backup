import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import { User } from '../../interfaces';
import { tableHeaders, CheckRStatuses } from '../../constants';
import { getDateFromTimezone, parseCourierRegistrationStatus, parseOnboardingStatus } from '../../utils';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import Pagination from '../common/Pagination';
import Search from '../common/Search';
import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Image from '../common/Image';
import ConfirmationModal from '../common/ConfirmationModal';
import EmptyList from '../common/EmptyList';

import CourierFilterModal from './components/CourierFilterModal';

import styles from './Couriers.module.sass';
import useUser from '../../hooks/useUser';

const PER_PAGE = 10;

export const Couriers: FC = () => {
  const { path } = useRouteMatch();
  const { getCouriers, filters, exportCouriers, courierForgotPassword } = useCourier();
  const { courierStore } = useStores();
  const { page, sortField, order, search } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [checkedRelatedUser, setCheckedRelatedUser] = useState<undefined | User>(undefined);
  const [forgotPasswordUserModal, setForgotPasswordUserModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUser();

  const getCouriersList = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status, onboarded, ...otherFilters } = filters;
      const couriers = await getCouriers({
        ...otherFilters,
        status: status.join('_'),
        onboarded: (onboarded || []).join('_')
      });
      courierStore.set('couriers')(couriers.data);
      courierStore.set('meta')(couriers.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [courierStore, getCouriers, filters]);

  useEffect(() => {
    getCouriersList().catch();
    // eslint-disable-next-line
  }, [page, search, order, sortField]);

  // useEffect(() => {
  //   return () => {
  //     courierStore.set('filters')({ ...filters, search: '' });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const { status, onboarded, ...otherFilters } = filters;
      const response = await exportCouriers({
        ...otherFilters,
        status: status.join('_'),
        onboarded: (onboarded || []).join('_')
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `couriers.csv`);
      document.body.appendChild(link);
      link.click();
      (link as any).parentNode.removeChild(link);
      setIsExportLoading(false);
    } catch (err) {
      console.error(err);
      setIsExportLoading(false);
    }
  };

  const handleChangeSort = (nextSortField: string) => () => {
    courierStore.set('filters')({
      ...filters,
      page: 0,
      sortField: nextSortField,
      order: order === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleChangePage = (e: object, nextPage: number) => {
    courierStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (text: string) => {
    courierStore.set('filters')({ ...filters, page: 0, search: text });
  };

  const handleToggleFilterModal = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const onForgotUserPasswordModal = (user: User) => {
    setCheckedRelatedUser(user);
    setForgotPasswordUserModal(true);
  };

  const toggleForgotUserPasswordModal = () => {
    setForgotPasswordUserModal(!forgotPasswordUserModal);
  };

  const onSendForgotPasswordEmail = () => {
    setLoading(true);
    courierForgotPassword(checkedRelatedUser ? checkedRelatedUser.email : '')
      .then(() => {
        setLoading(false);
        toggleForgotUserPasswordModal();
      })
      .catch(() => {
        setLoading(false);
      });
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
          <SVGIcon name="filters" onClick={handleToggleFilterModal} className={styles.filterIcon} />
          <Typography className={styles.title}>Courier Management</Typography>
          <div className={styles.pagination}>
            <Pagination
              rowsPerPage={PER_PAGE}
              page={page}
              classes={{ toolbar: styles.paginationButton }}
              filteredCount={courierStore.get('meta').filteredCount}
              onChangePage={handleChangePage}
            />
            <Button variant="outlined" color="secondary" disabled={isExportLoading} onClick={handleExport}>
              <Typography>Export</Typography>
            </Button>
          </div>
        </div>
        <div className={styles.tableHeader}>
          {tableHeaders.map((headCell) => (
            <Typography
              onClick={headCell.value !== 'actions' ? handleChangeSort(headCell.value) : () => undefined}
              key={headCell.value}
              className={classNames(styles.headerItem, styles[headCell.className])}
            >
              {headCell.label}
              {sortField === headCell.value ? (
                order === 'asc' ? (
                  <ArrowUpwardIcon style={{ height: '16px', width: '16px' }} />
                ) : (
                  <ArrowDownwardIcon style={{ height: '16px', width: '16px' }} />
                )
              ) : null}
            </Typography>
          ))}
        </div>
      </div>
    );
  };

  const renderCouriers = () => {
    return (
      <div className={classNames(styles.couriers, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {courierStore.get('couriers') && courierStore.get('couriers').length ? (
              courierStore.get('couriers').map((row: any) => {
                const {
                  _id,
                  picture,
                  cognitoId,
                  name,
                  family_name,
                  updatedAt,
                  address,
                  checkrStatus,
                  checkrInvLink,
                  registrationEndDate,
                  createdAt
                } = row;

                const registrationStatus = parseCourierRegistrationStatus(row);
                const onboardingStatus = parseOnboardingStatus(row);
                return (
                  <div key={_id} className={styles.tableItem}>
                    <div className={classNames(styles.item, styles.courier)}>
                      {picture ? (
                        <Image
                          className={styles.avatar}
                          alt={'No Avatar'}
                          src={picture}
                          width={200}
                          height={200}
                          cognitoId={cognitoId}
                        />
                      ) : (
                        <div className={styles.avatar}>
                          {name ? (
                            `${name[0].toUpperCase()} ${family_name && family_name[0].toUpperCase()}`
                          ) : (
                            <PersonOutlineIcon />
                          )}
                        </div>
                      )}
                      <span className={styles.name}>{name ? `${name} ${family_name}` : '...'}</span>
                    </div>
                    <div className={classNames(styles.item, styles.registered)}>
                      {registrationEndDate
                        ? getDateFromTimezone(registrationEndDate, user, 'MM/DD/YYYY')
                        : getDateFromTimezone(createdAt, user, 'MM/DD/YYYY')}
                    </div>
                    <div className={classNames(styles.item, styles.updated)}>
                      {getDateFromTimezone(updatedAt, user, 'MM/DD/YYYY')}
                    </div>
                    {/* <div className={classNames(styles.item, styles.email)}>{row.email && row.email}</div>
                    <div className={classNames(styles.item, styles.phone)}>{row.phone_number && row.phone_number}</div> */}
                    <div className={classNames(styles.item, styles.city)}>{address && address.city}</div>
                    <div className={classNames(styles.item, styles.state)}>{address && address.state}</div>
                    <div className={classNames(styles.item, styles.zipCode)}>{address && address.zipCode}</div>
                    <div
                      className={classNames(styles.item, styles.checkrStatus, {
                        [styles.failed]:
                          checkrStatus === 'consider' || checkrStatus === 'suspended' || checkrStatus === 'dispute'
                      })}
                    >
                      {!!checkrInvLink && (
                        <span
                          className={classNames(styles.statusColor, {
                            [styles.active]: CheckRStatuses[checkrStatus] === 'Passed',
                            [styles.declined]: CheckRStatuses[checkrStatus] === 'Failed'
                          })}
                        />
                      )}
                      {!checkrInvLink ? 'ChechR link is not sent' : checkrStatus && CheckRStatuses[checkrStatus]}
                    </div>
                    <div className={classNames(styles.item, styles.status)}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.registered]: registrationStatus.value === 'REGISTERED',
                          [styles.unregistered]: registrationStatus.value === 'UNREGISTERED',
                          [styles.pending]: registrationStatus.value === 'PENDING'
                        })}
                      />
                      {registrationStatus.label}
                    </div>
                    <div className={classNames(styles.item, styles.status)}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.approved]: onboardingStatus.value === 'APPROVED',
                          [styles.denied]: onboardingStatus.value === 'DENIED',
                          [styles.onboardIncomplete]: onboardingStatus.value === 'INCOMPLETE',
                          [styles.pending]: onboardingStatus.value === 'PENDING'
                        })}
                      />
                      {onboardingStatus.label}
                    </div>
                    <div className={classNames(styles.item, styles.actions)}>
                      <Tooltip title="Reset password" placement="top" arrow>
                        <IconButton className={styles.action}>
                          <SVGIcon
                            onClick={() => onForgotUserPasswordModal(row)}
                            className={styles.userActionIcon}
                            name={'passwordActive'}
                          />
                        </IconButton>
                      </Tooltip>

                      <Link to={`${path}/${_id}`} hidden={!name}>
                        <Tooltip title="Details" placement="top" arrow>
                          <IconButton className={styles.action}>
                            <SVGIcon name={'details'} className={styles.userActionIcon} />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyList />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.courierWrapper}>
      {renderHeaderBlock()}
      {renderCouriers()}
      <CourierFilterModal isOpen={isFiltersOpen} onClose={handleToggleFilterModal} />

      <ConfirmationModal
        title={'Restore password'}
        subtitle={`Send restore email to ${checkedRelatedUser ? checkedRelatedUser.email : ''}`}
        isOpen={forgotPasswordUserModal}
        handleModal={toggleForgotUserPasswordModal}
        loading={loading}
        onConfirm={onSendForgotPasswordEmail}
      />
    </div>
  );
};
