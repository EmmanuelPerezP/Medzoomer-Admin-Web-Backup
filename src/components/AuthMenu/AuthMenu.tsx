import React, { FC, useState } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../common/SVGIcon';
import Avatar from '../common/Avatar';
import Logo from '../common/Logo';
import Menu from '../common/Menu';
import { useStores } from '../../store';
import logo from '../../assets/img/dashboard-logo@3x.png';
import logoHide from '../../assets/img/compact-logo@3x.png';

import styles from './AuthMenu.module.sass';

export const AuthMenu: FC = () => {
  const { userStore } = useStores();
  const [isHide, setIsHide] = useState(false);

  return (
    <div className={classNames(styles.authMenuWrapper, { [styles.isHide]: isHide })}>
      <div className={classNames(styles.AuthMenu, { [styles.isHide]: isHide })}>
        <Logo className={styles.logo} logo={isHide ? logoHide : logo} />
        <Avatar
          isHide={isHide}
          src={userStore.get('picture').preview || logo}
          fullName={`${userStore.get('family_name')} ${userStore.get('name')}`}
          email={userStore.get('email')}
        />
        <Menu isHide={isHide} />
      </div>
      <div
        className={styles.hide}
        onClick={() => {
          setIsHide(!isHide);
        }}
      >
        <SVGIcon className={styles.sectionIcon} name={isHide ? 'open' : 'hide'} />
        {!isHide ? <Typography className={styles.titleSection}>Hide</Typography> : null}
      </div>
    </div>
  );
};
