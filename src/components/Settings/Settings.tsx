import React, { FC, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import { settingsMenuItems } from '../../constants';

import styles from './Settings.module.sass';

export const Settings: FC = () => {
  const [path, setPath] = useState(settingsMenuItems[0].path);

  const handleChangePath = (nextPath: string) => () => {
    setPath(nextPath);
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

  return <div className={styles.root}>{renderSettigsMenu()}</div>;
};
