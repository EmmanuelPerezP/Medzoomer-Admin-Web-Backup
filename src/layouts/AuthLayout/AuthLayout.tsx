import React, { FC } from 'react';
import AuthMenu from '../../components/AuthMenu';

import styles from './AuthLayout.module.sass';

export const AuthLayout: FC = (props) => {
  return (
    <div className={styles.root}>
      <AuthMenu />
      {props.children}
    </div>
  );
};
