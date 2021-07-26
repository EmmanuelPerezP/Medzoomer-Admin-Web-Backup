import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import usePharmacy from '../../hooks/usePharmacy';
import { useStores } from '../../store';
import Pagination from '../common/Pagination';
import Search from '../common/Search';
import Loading from '../common/Loading';
import SVGIcon from '../common/SVGIcon';
import EmptyList from '../common/EmptyList';
import { PHARMACY_STATUS } from '../../constants';
import { getAddressString } from '../../utils';
import styles from './Pharmacies.module.sass';

const PER_PAGE = 10;

export const Pharmacies: FC = () => {
  const { path } = useRouteMatch();
  const { getPharmacies, filters, exportPharmacies } = usePharmacy();
  const { pharmacyStore } = useStores();
  const { page, search, order, sortField } = filters;
  const [isLoading, setIsLoading] = useState(true);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const getPharmaciesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const pharmacies = await getPharmacies({
        page,
        perPage: PER_PAGE,
        search,
        order,
        sortField,
        addGroupInfo: 1,
        addSettingsGPInfo: 1
      });
      const data = pharmacies.data;
      // console.log('data', data);
      pharmacyStore.set('pharmacies')(data);
      pharmacyStore.set('meta')(pharmacies.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getPharmacies, page, pharmacyStore, search, order, sortField]);

  useEffect(() => {
    getPharmaciesList().catch();
    // eslint-disable-next-line
  }, [page, search]);

  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const response = await exportPharmacies({
        ...filters
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pharmacies.csv`);
      document.body.appendChild(link);
      link.click();
      (link as any).parentNode.removeChild(link);
      setIsExportLoading(false);
    } catch (err) {
      console.error(err);
      setIsExportLoading(false);
    }
  };

  const handleChangePage = (e: object, nextPage: number) => {
    pharmacyStore.set('filters')({ ...filters, page: nextPage });
  };

  const handleChangeSearch = (text: string) => {
    pharmacyStore.set('filters')({ ...filters, page: 0, search: text });
  };

  const checkAffiliation = (row: any) => {
    const { hellosign, affiliation } = row;

    if (affiliation) return affiliation === 'group' ? 'Group' : 'Independent';
    if (hellosign && hellosign.isAgreementSigned) return 'Independent';
    if ((!hellosign && !affiliation) || (hellosign && !affiliation && !hellosign.isAgreementSigned)) {
      return 'Group';
    }

    return '';
  };

  const checkGroupOrBillingAccount = (row: any) => {
    const affiliation = checkAffiliation(row);

    if (affiliation && affiliation === 'Group' && row.groups.length > 0) {
      const group = row.groups[0];
      const groupName = group.name;
      const groupNameValue = groupName.length > 23 ? `${groupName.slice(0, 23)}...` : groupName;
      // console.log('group ---->', group);

      return (
        <Link
          // target="_blank" rel="noopener noreferrer"
          className={styles.linkTo}
          to={`/dashboard/update-group/${group._id}`}
        >{`${groupNameValue}`}</Link>
      );
    }

    if (affiliation && affiliation === 'Independent') {
      if (row.settingsGP) {
        const settingsGpName = row.settingsGP.name;
        const settingsGpNameValue = settingsGpName.length > 23 ? `${settingsGpName.slice(0, 23)}...` : settingsGpName;
        // console.log('row.settingsGP ---->', row.settingsGP);

        return (
          <Link
            // target="_blank" rel="noopener noreferrer"
            className={styles.linkTo}
            to={`/dashboard/update-billing-account/${row.settingsGP._id}`}
          >{`${settingsGpNameValue}`}</Link>
        );
      }
    }

    return <span className={styles.notAssigned}>Not Assigned</span>;
  };

  const renderNavigation = () => (
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
      <Button variant="outlined" color="secondary" disabled={isExportLoading} onClick={handleExport}>
        <Typography>Export</Typography>
      </Button>
      <Typography className={styles.title}>Pharmacy Management</Typography>
      <div className={styles.pagination}>
        <Pagination
          rowsPerPage={PER_PAGE}
          page={page}
          classes={{ toolbar: styles.paginationButton }}
          filteredCount={pharmacyStore.get('meta') && pharmacyStore.get('meta').filteredCount}
          onChangePage={handleChangePage}
        />
        <Button className={styles.button} variant="contained" color="secondary">
          <Link className={styles.link} to={'/dashboard/create-pharmacy'}>
            Add New Pharmacy
          </Link>
        </Button>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className={styles.header}>
      {renderNavigation()}
      <div className={styles.tableHeader}>
        <div className={styles.pharmacy}>Pharmacy</div>
        <div className={styles.affiliation}>Affiliation</div>
        <div className={styles.groupAndBillingAccount}>Group / Billing Account</div>
        <div className={styles.address}>Address</div>
        <div className={styles.status}>Status</div>
        <div className={styles.action} />
      </div>
    </div>
  );

  const renderTableBody = () => {
    const pharmacies = pharmacyStore.get('pharmacies');
    return (
      <div className={classNames(styles.tableBody, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {pharmacies && pharmacies.length ? (
              pharmacies.map((row: any) => {
                const { _id, name, status, address } = row;
                const affiliation = checkAffiliation(row);
                const groupOrBillingAccount = checkGroupOrBillingAccount(row);
                const addressValue = getAddressString(address, true, 38);
                const statusValue = status ? `${status.charAt(0).toUpperCase()}${status.slice(1)}` : 'Pending';

                return (
                  <div key={_id} className={styles.tableItem}>
                    <div className={styles.pharmacy}>
                      <Link className={styles.nameLink} to={`${path}/${_id}`}>{`${name}`}</Link>
                    </div>
                    <div className={styles.affiliation}>{affiliation}</div>
                    <div className={styles.groupAndBillingAccount}>{groupOrBillingAccount}</div>
                    <div className={styles.address}>{addressValue}</div>
                    <div className={styles.status}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.verified]: status === PHARMACY_STATUS.VERIFIED,
                          [styles.declined]: status === PHARMACY_STATUS.DECLINED,
                          [styles.pending]: status === PHARMACY_STATUS.PENDING
                        })}
                      />
                      {statusValue}
                    </div>

                    <div>
                      <Link to={`${path}/${_id}`}>
                        <Tooltip title="Details" placement="top" arrow>
                          <IconButton className={styles.action}>
                            <SVGIcon name={'details'} className={styles.pharmacyActionIcon} />
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
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pharmaciesWrapper}>
      {renderHeader()}
      {renderTableBody()}
    </div>
  );
};
