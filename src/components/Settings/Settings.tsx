import React, { FC, useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import Terms from './components/TermsSettings';
import System from './components/SystemSettings';
import Map from './components/MapSettings';
import { settingsMenuItems } from '../../constants';

import styles from './Settings.module.sass';

export const Settings: FC = () => {
  const history = useHistory();
  const [path, setPath] = useState(history.location.pathname);

  useEffect(() => {
    setPath(history.location.pathname);
  }, [history.location.pathname]);

  const handleChangePath = (currentPath: string) => async () => {
    setPath(currentPath);
    history.push(currentPath);
  };

  const renderSettigsMenu = () => {
    return (
      <div className={styles.settingMenu}>
        <Typography className={styles.title}>Settings</Typography>
        {settingsMenuItems.map((item: { label: string; path: string }) => {
          return (
            <Typography
              key={item.path}
              onClick={handleChangePath(`${item.path}`)}
              className={classNames(styles.menuItem, { [styles.active]: path === item.path })}
            >
              {item.label}
            </Typography>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.root}>
      {renderSettigsMenu()}
      <Switch>
        <Route path={`/dashboard/settings/system`} component={System} />
        <Route path={`/dashboard/settings/terms`} component={Terms} />
        <Route path={`/dashboard/settings/map`} component={Map} />
        <Redirect path={`/dashboard/settings/*`} to={`/dashboard/settings`} />
        <Redirect exact from={'/dashboard/settings'} to={`/dashboard/settings/system`} />
      </Switch>
    </div>
  );
};
