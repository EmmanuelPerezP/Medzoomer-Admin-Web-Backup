import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '../common/TextField';
import useAuth from '../../hooks/useAuth';
import { useStores } from '../../store';
import Error from '../common/Error';

import styles from './Login.module.sass';

export const Login: FC = () => {
  const { logIn, setToken } = useAuth();
  const [err, setErr] = useState({ email: '', password: '', global: '' });
  const { authStore } = useStores();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
    setLoginData({ ...loginData, [key]: e.target.value });
    setErr({ ...err, [key]: '' });
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      if (!loginData.email) {
        setErr({ ...err, email: 'Please enter your email' });
      }

      if (!loginData.password) {
        setErr({ ...err, password: 'Please enter your password' });
      }

      if (!loginData.email && !loginData.password) {
        setErr({ ...err, global: 'All fields are required!' });
      }

      return;
    }

    try {
      const response = await logIn(loginData);
      const { AccessToken: token } = response;
      setToken(token);
      authStore.set('email')(loginData.email);
      authStore.set('password')(loginData.password);
    } catch (error) {
      setErr({ ...err, global: 'Login failed. Invalid email or password' });
    }
  };

  const renderForm = () => (
    <div className={styles.signInForm}>
      <Typography className={styles.title}>Admin Panel</Typography>
      <Typography className={styles.subtitle}>Sign In</Typography>
      <div className={styles.inputWrapper}>
        <TextField
          classes={{
            root: styles.textField,
            inputLabel: styles.inputLabel
          }}
          inputProps={{
            placeholder: 'Login'
          }}
          onChange={handleChange('email')}
        />
        {err.email ? <Error value={err.email} /> : null}
        <TextField
          classes={{
            root: styles.textField,
            inputLabel: styles.inputLabel
          }}
          inputProps={{
            type: 'password',
            placeholder: 'Password',
            endAdornment: (
              <InputAdornment position="start">
                {loginData.email.length ? <Visibility /> : <VisibilityOff />}
              </InputAdornment>
            )
          }}
          onChange={handleChange('password')}
        />
        {err.password ? <Error value={err.password} /> : null}
      </div>
      {err.global ? <Error value={err.global} /> : null}
      <Button className={styles.signInButton} variant="contained" color="primary" onClick={handleLogin}>
        <Typography>Sign me in</Typography>
      </Button>
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.mainContent}>
        {renderForm()}
        <div className={styles.signInFooter}>
          <Typography>Forgot your password?</Typography>
          <Link href={'/reset-password'} className={styles.signUp}>
            Reset
          </Link>
        </div>
      </div>
    </div>
  );
};
