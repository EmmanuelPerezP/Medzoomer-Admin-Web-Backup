import React, { FC, useEffect, useCallback } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import Overview from '../Overview';
import Couriers from '../Couriers';
import CourierInfo from '../CourierInfo';
import Pharmacies from '../Pharmacies';
import PharmacyInfo from '../PharmacyInfo';
import CreatePharmacy from '../CreatePharmacy';
import Groups from '../Groups';
import BillingManagement from '../BillingManagement';
import CreateBillingAccount from '../BillingManagement/components/CreateBillingAccount';
import CreateGroup from '../Groups/components/CreateGroup';
import Billings from '../Billings';
import Consumers from '../Consumers';
import Orders from '../Orders';
import DeliveriesCourier from '../DeliveriesCourier';
import Settings from '../Settings';

import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import { useStores } from '../../store';
import api from '../../api';

import styles from './Dashboard.module.sass';

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
        <Route exact path={`${path}/couriers/:id`} component={CourierInfo} />
        <Route path={`${path}/couriers/:id/deliveries`} component={DeliveriesCourier} />
        <Route path={`${path}/couriers`} component={Couriers} />

        <Route path={`${path}/pharmacies/:id`} component={PharmacyInfo} />
        <Route path={`${path}/pharmacies`} component={Pharmacies} />
        <Route path={`${path}/create-pharmacy`} component={CreatePharmacy} />

        <Route path={`${path}/groups`} component={Groups} />
        <Route path={`${path}/create-group`} component={CreateGroup} />
        <Route path={`${path}/update-group/:id`} component={CreateGroup} />

        <Route path={`${path}/billing_management`} component={BillingManagement} />
        <Route path={`${path}/create-billing-account`} component={CreateBillingAccount} />
        <Route path={`${path}/update-billing-account/:id`} component={CreateBillingAccount} />

        <Route path={`${path}/billings`} component={Billings} />
        <Route path={`${path}/consumers`} component={Consumers} />
        <Route path={`${path}/orders`} component={Orders} />

        <Route path={`${path}/settings`} component={Settings} />
        <Redirect path={`${path}/*`} to={`${path}`} />
        <Redirect exact from={path} to={`${path}/overview`} />
      </Switch>
    </div>
  );
};
