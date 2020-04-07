import React, { FC, useEffect, useCallback } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import Overview from '../Overview';
import Couriers from '../Couriers';
import CourierInfo from '../CourierInfo';
import Pharmacies from '../Pharmacies';
import PharmacyInfo from '../PharmacyInfo';
import CreatePharmacy from '../CreatePharmacy';
import Settings from '../Settings';

import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';

import styles from './Dashboard.module.sass';

export const Dashboard: FC = () => {
  const { path } = useRouteMatch();
  const auth = useAuth();
  const user = useUser();

  const checkToken = useCallback(async () => {
    if (!user.sub) {
      try {
        const userInfo = await user.getUser();
        if (userInfo) {
          user.setUser(userInfo);
        } else {
          return auth.logOut();
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [auth, user]);

  useEffect(() => {
    checkToken().catch(console.warn);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.root}>
      <Switch>
        <Route path={`${path}/overview`} component={Overview} />
        <Route path={`${path}/couriers/:id`} component={CourierInfo} />
        <Route path={`${path}/couriers`} component={Couriers} />
        <Route path={`${path}/pharmacies/:id`} component={PharmacyInfo} />
        <Route path={`${path}/pharmacies`} component={Pharmacies} />
        <Route path={`${path}/create-pharmacy`} component={CreatePharmacy} />
        {/* <Route path={`${path}/consumers`} component={Profile} />
        <Route path={`${path}/orders`} component={ResetPasswordSetting} />*/}
        <Route path={`${path}/settings`} component={Settings} />
        <Redirect path={`${path}/*`} to={`${path}`} />
        <Redirect exact from={path} to={`${path}/overview`} />
      </Switch>
    </div>
  );
};
