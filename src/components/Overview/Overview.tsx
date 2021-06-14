import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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
import usePharmacy from '../../hooks/usePharmacy';
import { useStores } from '../../store';
import { filterOverview } from '../../constants';
import { Consumer, User } from '../../interfaces';
import { isDevServer } from '../../utils';

import styles from './Overview.module.sass';

interface AdditionalInfoCount {
  prescriptionsCount: number;
  pharmaciesCount: number;
}

const PER_PAGE = 5;
const withPharmacyReportTestButton = false;
const withCourierReminderTestButton = false;

const tempDataForPresent: {
  data: any;
  newCouriers: any[];
  newConsumers: any[];
} = {
  data: {
    0: {
      OrdersPlaced: 935,
      Revenue: 7650,
      Customers: 467,
      Couriers: 725,
      Prescriptions: 940,
      Pharmacies: 320
    },
    1: {
      OrdersPlaced: 76,
      Revenue: 455,
      Customers: 23,
      Couriers: 15,
      Prescriptions: 79,
      Pharmacies: 12
    },
    7: {
      OrdersPlaced: 297,
      Revenue: 1782,
      Customers: 282,
      Couriers: 211,
      Prescriptions: 300,
      Pharmacies: 45
    },
    30: {
      OrdersPlaced: 831,
      Revenue: 5650,
      Customers: 367,
      Couriers: 625,
      Prescriptions: 840,
      Pharmacies: 150
    },
    toDate: {
      OrdersPlaced: 855,
      Revenue: 5900,
      Customers: 401,
      Couriers: 671,
      Prescriptions: 905,
      Pharmacies: 274
    }
  },
  newCouriers: [
    { name: 'Wigide', family_name: 'Magidubi', email: 'wajdey@engineer.com' },
    { name: 'Ryan', family_name: 'Amburgey', email: 'ryburgey@icloud.com' },
    { name: 'Tatiana', family_name: 'Mitrov-Pere', email: 'tatianamarie.tmp@gmail.com' },
    { name: 'Dany', family_name: 'Toro-munera', email: 'andrew_joseph@live.com' },
    { name: 'Fakhri', family_name: 'Khazar', email: 'otsorlando@gmail.com' }
  ],
  newConsumers: [
    { name: 'James', family_name: 'Thompson', phone: '+18635853173' },
    { name: 'MINABENRAMESHBHAI', family_name: 'TAROPAWALA', phone: '+18302200145' },
    { name: 'EFRAIN', family_name: 'GALARZA', phone: '+17277419813' },
    { name: 'Brenda', family_name: 'Canady', phone: '+18636571840' },
    { name: 'Nunzia', family_name: 'Mavaro', phone: '+18638166894' }
  ]
};

export const Overview: FC = () => {
  const { getTransactions, getTransactionsByGroup, overview } = useTransaction();
  const { getCouriers, couriers, meta: courierMeta, courierSendReminder } = useCourier();
  const { getConsumers, consumers, meta: consumerMeta } = useCustomer();
  const { getDeliveries, getDeliveriesPrescriptionsCount } = useDelivery();
  const { generatePharmaciesReport, getPharmacies } = usePharmacy();
  const { courierStore, consumerStore, deliveryStore, transactionStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<number>(filterOverview[0].value);
  const [isReportGenerate, setIsReportGenerate] = useState(false);
  const [isCourierReminder, setIsCourierReminder] = useState(false);
  const [{ prescriptionsCount, pharmaciesCount }, setAdditionalInfoCount] = useState<AdditionalInfoCount>({
    prescriptionsCount: 0,
    pharmaciesCount: 0
  });

  const isDev = isDevServer();

  const periodSlug = useMemo(() => (!Boolean(tempDataForPresent.data[period]) ? 'toDate' : period), [period]);

  const getTotalRevenue = useCallback(() => {
    const total = overview.totalIncome - overview.totalPayout;
    return Math.round(total * 100) / 100;
  }, [overview]);

  const allData = useMemo(
    () => ({
      newCouriersData: isDev ? tempDataForPresent.newCouriers : couriers,
      newConsumersData: isDev ? tempDataForPresent.newConsumers : consumers,
      totalOrders: isDev ? tempDataForPresent.data[periodSlug].OrdersPlaced : overview.totalCount,
      revenue: isDev ? tempDataForPresent.data[periodSlug].Revenue : getTotalRevenue(),
      customers: isDev ? tempDataForPresent.data[periodSlug].Customers : consumerMeta.filteredCount,
      prescriptions: isDev ? tempDataForPresent.data[periodSlug].Prescriptions : prescriptionsCount,
      pharmacies: isDev ? tempDataForPresent.data[periodSlug].Pharmacies : pharmaciesCount,
      couriers: isDev ? tempDataForPresent.data[periodSlug].Couriers : courierMeta.filteredCount
    }),
    [couriers, consumers, overview, consumerMeta, prescriptionsCount, pharmaciesCount, courierMeta]
  );

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
        getDeliveriesPrescriptionsCount({
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

      promises.push(
        getPharmacies({
          perPage: PER_PAGE,
          sortField: 'createdAt',
          order: 'asc',
          affiliation: 'independent',
          period
        })
      );

      const [
        newCouriers,
        transactions,
        prescriptions,
        newConsumers,
        pharmacyTransactions,
        pharmacies
      ] = await Promise.all(promises);

      courierStore.set('couriers')(newCouriers.data);
      courierStore.set('meta')(newCouriers.meta);
      transactionStore.set('overview')(transactions.data);
      consumerStore.set('consumers')(newConsumers.data);
      consumerStore.set('meta')(newConsumers.meta);
      transactionStore.set('pharmacyTransactions')(pharmacyTransactions.data);

      setAdditionalInfoCount({
        pharmaciesCount: pharmacies.meta.filteredCount,
        prescriptionsCount: prescriptions.count || 0
      });

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

  const handleGenerateReport = async () => {
    setIsReportGenerate(true);
    await generatePharmaciesReport().catch(console.error);
    setIsReportGenerate(false);
  };

  const handleCourierReminder = async () => {
    setIsCourierReminder(true);
    await courierSendReminder().catch(console.error);
    setIsCourierReminder(false);
  };

  const renderHeaderBlock = () => (
    <div className={styles.metrics}>
      {withPharmacyReportTestButton && (
        <Button
          color="secondary"
          variant={'contained'}
          onClick={handleGenerateReport}
          className={styles.reportTestBtn}
          disabled={isReportGenerate}
        >
          Generate Report
        </Button>
      )}
      {withCourierReminderTestButton && (
        <Button
          color="secondary"
          variant={'contained'}
          onClick={handleCourierReminder}
          className={styles.reportTestBtn}
          disabled={isCourierReminder}
        >
          Couriers reminder
        </Button>
      )}
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
          <Typography className={styles.title}>Total Orders</Typography>
          <Typography className={styles.money}>{allData.totalOrders}</Typography>
        </div>
        <div className={styles.moneyBlock}>
          <Typography className={styles.title}>Total Prescriptions</Typography>
          <Typography className={styles.money}>{allData.prescriptions}</Typography>
        </div>
        <div className={styles.moneyBlock}>
          <Typography className={styles.title}>Total Revenue</Typography>
          <Typography className={classNames(styles.money, styles.earned)}>${allData.revenue}</Typography>
        </div>
        <div className={styles.moneyBlock}>
          <Typography className={styles.title}>New Patients</Typography>
          <Typography className={styles.money}>{allData.customers}</Typography>
        </div>
        <div className={styles.moneyBlock}>
          <Typography className={styles.title}>New Pharmacies</Typography>
          <Typography className={styles.money}>{allData.pharmacies}</Typography>
        </div>
      </div>
    </div>
  );

  const renderConsumers = () => {
    return allData.newConsumersData.length ? (
      allData.newConsumersData.map((row: Consumer, index: number) => {
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
    return allData.newCouriersData.length ? (
      allData.newCouriersData.map((row: User, index: number) => (
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
                <span className={styles.count}>
                  {type === 'couriers' ? allData.couriers : allData.customers}
                  &nbsp;
                </span>
                New {type === 'couriers' ? 'Couriers' : 'Patients'}
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
