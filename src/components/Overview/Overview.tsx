import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';
import Select from '../common/Select';
import Image from '../common/Image';
import useCourier from '../../hooks/useCourier';
import useCustomer from '../../hooks/useConsumer';
import useDelivery from '../../hooks/useDelivery';
import useTransaction from '../../hooks/useTransaction';
import { useStores } from '../../store';
import { filterOverview } from '../../constants';

import styles from './Overview.module.sass';
import { Consumer, User } from '../../interfaces';

const PER_PAGE = 5;
const tempDataForPresent = {
  data: {
    30: {
      OrdersPlaced: 831,
      Revenue: 5650,
      Customers: 367,
      Couriers: 625
    },
    7: {
      OrdersPlaced: 297,
      Revenue: 1782,
      Customers: 282,
      Couriers: 211
    },
    1: {
      OrdersPlaced: 76,
      Revenue: 455,
      Customers: 23,
      Couriers: 15
    }
  },
  newCouriers: [
    { name: 'Wigide Magidubi', email: 'wajdey@engineer.com' },
    { name: 'Ryan Amburgey', email: 'ryburgey@icloud.com' },
    { name: 'Tatiana Mitrov-Pere', email: 'tatianamarie.tmp@gmail.com' },
    { name: 'Dany Toro-munera', email: 'andrew_joseph@live.com' },
    { name: 'Fakhri Khazar', email: 'otsorlando@gmail.com' }
  ],
  newConsumers: [
    { name: 'James Thompson', phone: '+18635853173' },
    { name: 'MINABENRAMESHBHAI TAROPAWALA', phone: '+18302200145' },
    { name: 'EFRAIN GALARZA', phone: '+17277419813' },
    { name: 'Brenda Canady', phone: '+18636571840' },
    { name: 'Nunzia Mavaro', phone: '+18638166894' }
  ]
};

export const Overview: FC = () => {
  const { getTransactions, getTransactionsByGroup, overview } = useTransaction();
  const { getCouriers, couriers, meta: courierMeta } = useCourier();
  const { getConsumers, consumers, meta: consumerMeta } = useCustomer();
  const { getDeliveries } = useDelivery();
  const { courierStore, consumerStore, deliveryStore, transactionStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<number>(filterOverview[0].value);
  const getOverviewList = useCallback(async () => {
    setIsLoading(true);
    try {
      const promises = [];

      promises.push(
        getCouriers({
          perPage: PER_PAGE,
          status: 'REGISTERED',
          period,
          sortField: 'createdAt',
          order: 'asc'
        })
      );

      promises.push(
        getTransactions({
          perPage: PER_PAGE,
          period
        })
      );

      promises.push(
        getDeliveries({
          perPage: PER_PAGE,
          period
        })
      );

      promises.push(
        getConsumers({
          perPage: PER_PAGE,
          period
        })
      );

      promises.push(
        getTransactionsByGroup({
          perPage: PER_PAGE,
          sortField: 'income',
          order: 'desc',
          period
        })
      );

      const [newCouriers, transactions, deliveries, newConsumers, pharmacyTransactions] = await Promise.all(promises);

      courierStore.set('couriers')(newCouriers.data);
      courierStore.set('meta')(newCouriers.meta);
      transactionStore.set('overview')(transactions.data);
      deliveryStore.set('meta')(deliveries.meta);
      consumerStore.set('consumers')(newConsumers.data);
      consumerStore.set('meta')(newConsumers.meta);
      transactionStore.set('pharmacyTransactions')(pharmacyTransactions.data);

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [period, courierStore, getCouriers, consumerStore, getConsumers, deliveryStore, getDeliveries]);

  useEffect(() => {
    getOverviewList().catch();
    // eslint-disable-next-line
  }, [period]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPeriod(event.target.value as number);
  };

  const renderHeaderBlock = () => {
    let total = overview.totalIncome - overview.totalPayout;
    total = Math.round(total * 100) / 100;

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
            <Typography className={styles.money}>
              {
                // @ts-ignore
                tempDataForPresent.data[period].OrdersPlaced
              }
            </Typography>
            {/*<Typography className={styles.money}>{overview.totalCount}</Typography>*/}
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Revenue</Typography>

            <Typography className={classNames(styles.money, styles.earned)}>
              $
              {
                // @ts-ignore
                tempDataForPresent.data[period].Revenue
              }
            </Typography>
            {/*<Typography className={classNames(styles.money, styles.earned)}>*/}
            {/*  ${total}            */}
            {/*</Typography>*/}
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>New Customers</Typography>
            <Typography className={styles.money}>
              {
                // @ts-ignore
                tempDataForPresent.data[period].Customers
              }
            </Typography>
            {/*<Typography className={styles.money}>{consumerMeta.filteredCount}</Typography>*/}
          </div>
        </div>
      </div>
    );
  };

  const renderConsumers = () => {
    return tempDataForPresent.newConsumers.length ? (
      // @ts-ignore
      tempDataForPresent.newConsumers.map((row: Consumer, index: number) => {
        return (
          <div key={`consumer-${index}`} className={styles.tableItem}>
            <div className={styles.picture}>
              <Typography className={styles.avatar}>
                <PersonOutlineIcon />
              </Typography>
            </div>
            <Typography className={styles.name}>{row.name ? `${row.name} ${row.family_name}` : '...'}</Typography>
            <Typography className={styles.phone}>{row.phone}</Typography>
          </div>
        );
      })
    ) : (
      <div className={styles.tableItem}>{`There are not any new couriers for the selected period`}</div>
    );
  };

  const renderCouriers = () => {
    // @ts-ignore
    return tempDataForPresent.newCouriers.length ? (
      // @ts-ignore
      tempDataForPresent.newCouriers.map((row: User, index: number) => (
        <div key={`courier-${index}`} className={styles.tableItem}>
          <div className={styles.picture}>
            {row.picture ? (
              <Image className={styles.avatar} alt={'No Avatar'} src={''} width={200} height={200} cognitoId={''} />
            ) : (
              <Typography className={styles.avatar}>
                <PersonOutlineIcon />
              </Typography>
            )}
          </div>
          <Typography className={styles.name}>{row.name ? `${row.name}` : '...'}</Typography>
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
                <span className={styles.count}>
                  {type === 'couriers'
                    ?
                      // @ts-ignore
                      tempDataForPresent.data[period].Couriers // courierMeta.filteredCount
                    :
                      // @ts-ignore
                      tempDataForPresent.data[period].Customers // consumerMeta.filteredCount
                  }
                </span>
                New {type === 'couriers' ? 'Couriers' : 'Consumers'}
              </Typography>
              <Link to={path} className={styles.link}>
                View All
              </Link>
            </div>
            <div>{type === 'couriers' ? renderCouriers() : renderConsumers()}</div>
          </>
        )}
      </div>
    );
  };

  const renderPharmacies = () => {
    return (
      <div className={classNames(styles.pharmacyBlock, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={classNames(styles.header, styles.userHeader)}>
              <Typography className={styles.title}>Biggest Producers</Typography>
            </div>
            <div className={styles.cardLayer}>
              {transactionStore.get('pharmacyTransactions') ? (
                transactionStore.get('pharmacyTransactions').map((row: any) => (
                  <div key={row._id} className={styles.cardItem}>
                    <div className={styles.pharmacy}>{`${row.group.name}`}</div>
                    <div className={styles.previous}>{row.lastPayout ? moment(row.lastPayout).format('lll') : '-'}</div>
                    <div className={styles.numbers}>
                      <div className={styles.income}>${Math.round(row.pharmacyIncome * 100) / 100}</div>
                      <div className={styles.payout}>${Math.round(row.pharmacyPayout * 100) / 100}</div>
                      <div className={styles.fees}>
                        ${Math.round((row.pharmacyIncome - row.pharmacyPayout) * 100) / 100}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.rowItem}>{`There are not any pharmacies as biggest producers`}</div>
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
      <div className={styles.pharmacyWrapper}>{renderPharmacies()}</div>
    </div>
  );
};
