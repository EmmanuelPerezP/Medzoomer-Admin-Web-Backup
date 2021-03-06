import React, { FC, useEffect, useCallback } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import Overview from '../Overview';
import Couriers from '../Couriers';
import CourierInfo from '../Couriers/components/CourierInfo';
import CourierDeliveriesTable from '../Couriers/components/CourierInfo/components/CourierDeliveriesTable';
import CourierBonusesTable from '../Couriers/components/CourierInfo/components/CourierBonusesTable';
import Pharmacies from '../Pharmacies';
import PharmacyInfo from '../Pharmacies/components/PharmacyInfo';
import CreatePharmacy from '../Pharmacies/components/CreatePharmacy';
import ReportsTable from '../Pharmacies/components/ReportsTable';
import Groups from '../Groups';
import CreateGroup from '../Groups/components/CreateGroup';
import Billings from '../Billings';
import BillingManagement from '../BillingManagement';
import InvoiceQueue from '../InvoiceQueue';
import InvoiceHistory from '../InvoiceHistory';
// import InvoiceHistoryDetails from '../InvoiceHistoryDetails';
import InvoiceAttemptsDetails from '../InvoiceAttemptsDetails';
import InvoiceQueueDetails from '../InvoiceQueueDetails';
import CreateBillingAccount from '../BillingManagement/components/CreateBillingAccount';
import Consumers from '../Consumers';
import ConsumerInfo from '../Consumers/components/ConsumerInfo';
import OrdersConsumer from '../Consumers/components/OrdersConsumer';

import Deliveries from '../Deliveries';
import DeliveriesBatch from '../DeliveriesBatch';
import DeliveriesBatchDetails from '../DeliveriesBatchDetails';
import DeliveryTaskDetails from '../DeliveryTaskDetails';
import DeliveryInfo from '../Deliveries/components/DeliveryInfo';

import Settings from '../SystemSettings';
import Teams from '../Teams';
import Transactions from '../Transactions';

import Orders from '../Orders';
import OrderDetails from '../OrderDetails';

import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import { useStores } from '../../store';
import api from '../../api';

import styles from './Dashboard.module.sass';
import { AdminSettings } from '../AdminSettings/AdminSettings';

export const Dashboard: FC = () => {
  const { path } = useRouteMatch();
  const auth = useAuth();
  const user = useUser();
  const { authStore } = useStores();

  const checkToken = useCallback(async () => {
    if (!user.sub) {
      try {
        const userInfo = await user.getUser();
        if (userInfo) {
          user.setUser(userInfo);
        } else {
          authStore.set('token')('');
          // auth.logOut().catch(console.warn);
          return auth.logOut();
        }
      } catch (err) {
        console.error(err);
      }
    }
    // eslint-disable-next-line
  }, [auth, user]);

  useEffect(() => {
    const unauthorized = api.on('unauthorized').subscribe((value) => {
      console.warn('** unauthorized **', value);
      authStore.set('token')('');
      window.location.href = '/login';
    });

    checkToken().catch(console.warn);
    // eslint-disable-next-line
    return () => {
      unauthorized.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.root}>
      <Switch>
        <Route path={`${path}/overview`} component={Overview} />
        <Route path={`${path}/couriers/:id/deliveries`} component={CourierDeliveriesTable} />
        <Route path={`${path}/couriers/:id/bonuses`} component={CourierBonusesTable} />
        <Route path={`${path}/couriers/:id`} component={CourierInfo} />
        <Route path={`${path}/couriers`} component={Couriers} />

        <Route path={`${path}/pharmacies/:id/reports`} component={ReportsTable} />
        <Route path={`${path}/pharmacies/:id`} component={PharmacyInfo} />
        <Route path={`${path}/pharmacies`} component={Pharmacies} />
        <Route path={`${path}/create-pharmacy`} component={CreatePharmacy} />

        <Route path={`${path}/groups`} component={Groups} />
        <Route path={`${path}/create-group`} component={CreateGroup} />
        <Route path={`${path}/update-group/:id`} component={CreateGroup} />

        <Route path={`${path}/invoice_queue/:id`} component={InvoiceQueueDetails} />
        <Route path={`${path}/invoice_queue`} component={InvoiceQueue} />

        <Route path={`${path}/invoice_history/:id`} component={InvoiceAttemptsDetails} />
        <Route path={`${path}/invoice_history`} component={InvoiceHistory} />

        <Route path={`${path}/pharmacy_configuration`} component={BillingManagement} />
        <Route path={`${path}/create-billing-account`} component={CreateBillingAccount} />
        <Route path={`${path}/update-billing-account/:id`} component={CreateBillingAccount} />
        <Route path={`${path}/income`} component={Billings} />

        <Route path={`${path}/patients/:id/orders`} component={OrdersConsumer} />
        <Route path={`${path}/patients/:id`} component={ConsumerInfo} />
        <Route path={`${path}/patients`} component={Consumers} />

        <Route path={`${path}/orders/:id`} component={OrderDetails} />
        <Route path={`${path}/orders`} component={Orders} />

        <Route path={`${path}/deliveries/task/:id`} component={DeliveryTaskDetails} />
        <Route path={`${path}/deliveries/:id`} component={DeliveriesBatchDetails} />
        <Route path={`${path}/deliveries`} component={DeliveriesBatch} />

        <Route path={`${path}/transactions`} component={Transactions} />
        <Route path={`${path}/teams`} component={Teams} />

        {/*
          // OLD DELIVERIES ROUTES
        */}
        <Route path={`${path}/deliveries-old/:id`} component={DeliveryInfo} />
        <Route path={`${path}/deliveries-old`} component={Deliveries} />

        <Route path={`${path}/settings`} component={Settings} />
        <Route path={`${path}/settings-admin`} component={AdminSettings} />
        <Redirect path={`${path}/*`} to={`${path}`} />
        <Redirect exact from={path} to={`${path}/overview`} />
      </Switch>
    </div>
  );
};
