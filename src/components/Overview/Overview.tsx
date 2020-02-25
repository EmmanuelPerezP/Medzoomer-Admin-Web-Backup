import React, { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import Link from '@material-ui/core/Link';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Select from '../common/Select';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';
import { filterOverview } from '../../constants';

import styles from './Overview.module.sass';

const PER_PAGE = 5;

export const Overview: FC = () => {
  const { getCouriers, couriers, meta } = useCourier();
  const { courierStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<number>(filterOverview[0].value);

  useEffect(() => {
    getCouriersList().catch();
  }, [period]);

  const getCouriersList = async () => {
    setIsLoading(true);
    const newCouriers = await getCouriers({
      perPage: PER_PAGE,
      status: 'REGISTERED',
      period
    });
    courierStore.set('couriers')(newCouriers.data);
    courierStore.set('meta')(newCouriers.meta);
    setIsLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPeriod(event.target.value as number);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.metrics}>
        <div className={styles.header}>
          <span style={{ width: '100%' }} />
          <Typography className={styles.mainTitle}>Overview</Typography>
          <Select
            value={period}
            onChange={handleChange}
            items={filterOverview}
            IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
            classes={{ input: styles.input, root: styles.select, inputRoot: styles.inputRoot }}
          />
        </div>
        <div className={styles.moneyWrapper}>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Orders Placed</Typography>
            <Typography className={styles.money}>0</Typography>
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Revenue</Typography>
            <Typography className={classNames(styles.money, styles.earned)}>
              $0
              {/* <span className={styles.pennies}>.00</span> */}
            </Typography>
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>New Customers</Typography>
            <Typography className={styles.money}>0</Typography>
          </div>
        </div>
      </div>
    );
  };

  const renderCouriers = () => {
    return couriers.length ? (
      couriers.map((row) => (
        <TableRow key={row.id} className={styles.tableItem}>
          <TableCell className={styles.picture}>
            {row.picture ? (
              <img className={classNames(styles.avatar, styles.img)} src={row.picture} alt="" />
            ) : (
              <div className={styles.avatar}>
                {row.name ? (
                  `${row.name[0].toUpperCase()} ${row.family_name && row.family_name[0].toUpperCase()}`
                ) : (
                  <PersonOutlineIcon />
                )}
              </div>
            )}
          </TableCell>
          <TableCell className={styles.name}>{row.name ? `${row.name} ${row.family_name}` : '...'}</TableCell>
          <TableCell className={styles.email} align="right">
            {row.email}
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow className={styles.tableItem}>{`There are not any new couriers for the selected period`}</TableRow>
    );
  };

  const renderUsers = (type: string, path: string) => {
    return (
      <div className={styles.userBlock}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={classNames(styles.header, styles.userHeader)}>
              <Typography className={styles.title}>
                <span className={styles.count}>{type === 'couriers' ? meta.filteredCount : 0}</span>
                New {type === 'couriers' ? 'Couriers' : 'Consumers'}
              </Typography>
              <Link href={path} className={styles.link}>
                View All
              </Link>
            </div>
            <Table>
              <TableBody>
                {type === 'couriers' ? (
                  renderCouriers()
                ) : (
                  <TableRow className={styles.tableItem}>
                    {`There are not any new ${type} for the selected period`}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.overviewWrapper}>
      {renderHeaderBlock()}
      <div className={styles.usersWrapper}>
        {renderUsers('couriers', `/dashboard/couriers`)}
        {renderUsers('consumers', `/dashboard/consumers`)}
      </div>
    </div>
  );
};
