import React, { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Select from '../common/Select';
import Image from '../common/Image';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';
import { filterOverview } from '../../constants';

import styles from './Overview.module.sass';
import { User } from '../../interfaces';

const PER_PAGE = 5;

export const Overview: FC = () => {
  const { getCouriers, couriers, meta } = useCourier();
  const { courierStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<number>(filterOverview[0].value);

  const getCouriersList = useCallback(async () => {
    setIsLoading(true);
    try {
      const newCouriers = await getCouriers({
        perPage: PER_PAGE,
        status: 'REGISTERED',
        period
      });
      courierStore.set('couriers')(newCouriers.data);
      courierStore.set('meta')(newCouriers.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [period, courierStore, getCouriers]);

  useEffect(() => {
    getCouriersList().catch();
    // eslint-disable-next-line
  }, [period]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPeriod(event.target.value as number);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.metrics}>
        <div className={styles.header}>
          <span className={styles.offsetBlock} />
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
      couriers.map((row: User, index: number) => (
        <div key={index} className={styles.tableItem}>
          <div className={styles.picture}>
            {row.picture ? (
              <Image
                className={styles.avatar}
                alt={'No Avatar'}
                src={row.picture}
                width={200}
                height={200}
                cognitoId={row.cognitoId}
              />
            ) : (
              <Typography className={styles.avatar}>
                {row.name ? (
                  `${row.name[0].toUpperCase()} ${row.family_name && row.family_name[0].toUpperCase()}`
                ) : (
                  <PersonOutlineIcon />
                )}
              </Typography>
            )}
          </div>
          <Typography className={styles.name}>{row.name ? `${row.name} ${row.family_name}` : '...'}</Typography>
          <Typography className={styles.email}>{row.email}</Typography>
        </div>
      ))
    ) : (
      <div className={styles.tableItem}>{`There are not any new couriers for the selected period`}</div>
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
              <Link to={path} className={styles.link}>
                View All
              </Link>
            </div>
            <div>
              {type === 'couriers' ? (
                renderCouriers()
              ) : (
                <div className={styles.tableItem}>{`There are not any new ${type} for the selected period`}</div>
              )}
            </div>
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
