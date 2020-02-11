import React, { FC, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../SVGIcon';
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser';

import styles from './Menu.module.sass';

const menuItems = [
  { path: '/dashboard/overview', label: 'Dashboard', iconName: 'dashboard' },
  { path: '/dashboard/couriers', label: 'Courier Management', iconName: 'courierIcon' },
  { path: '/dashboard/pharmacy', label: 'Pharmacy Management', iconName: 'add' },
  { path: '/dashboard/consumers', label: 'Manage Consumers', iconName: 'consumers' },
  { path: '/dashboard/orders', label: 'Consumer Orders', iconName: 'orders' },
  { path: '/dashboard/settings', label: 'Change Password', iconName: 'settings' }
];

export const Menu: FC = () => {
  const { logOut, setToken } = useAuth();
  const { removeUser } = useUser();
  const history = useHistory();
  const d = useRouteMatch();
  const [path, setPath] = useState(history.location.pathname);
  const HandleChangeRoute = (currentPath: string) => async () => {
    setPath(currentPath);
    if (currentPath === '/logout') {
      await logOut();
      setToken('');
      removeUser();
    } else {
      history.push(currentPath);
    }
  };

  return (
    <>
      <div className={classNames(styles.menuWrapper)}>
        {menuItems.map((item) => {
          return (
            <div
              className={classNames(styles.menuItem, { [styles.active]: path === item.path })}
              key={item.path}
              onClick={HandleChangeRoute(item.path)}
            >
              <SVGIcon className={styles.sectionIcon} name={item.iconName} />
              <Typography className={styles.titleSection}>{item.label}</Typography>
            </div>
          );
        })}
      </div>
      <div
        className={classNames(styles.menuItem, styles.logout, { [styles.active]: path === '/logout' })}
        onClick={HandleChangeRoute('/logout')}
      >
        <SVGIcon className={styles.sectionIcon} name={'logout'} />
        <Typography className={styles.titleSection}>Logout</Typography>
      </div>
    </>
  );
};
