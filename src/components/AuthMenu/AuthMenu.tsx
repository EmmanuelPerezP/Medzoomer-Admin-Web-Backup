import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../common/SVGIcon';
import Avatar from '../common/Avatar';
import Logo from '../common/Logo';
import Menu from '../common/Menu';
import { useStores } from '../../store';
import logo from '../../assets/img/dashboard-logo@3x.png';

import styles from './AuthMenu.module.sass';

export const AuthMenu: FC = () => {
  const { userStore } = useStores();

  return (
    <div className={styles.authMenuWrapper}>
      <div className={styles.AuthMenu}>
        <Logo className={styles.logo} logo={logo} />
        <Avatar
          src={userStore.get('picture') || logo}
          fullName={`${userStore.get('family_name')} ${userStore.get('name')}`}
          email={userStore.get('email')}
        />
        <Menu />
      </div>
      <div className={styles.hide}>
        <SVGIcon className={styles.sectionIcon} name={'hide'} />
        <Typography className={styles.titleSection}>Hide</Typography>
      </div>
    </div>
  );
};
