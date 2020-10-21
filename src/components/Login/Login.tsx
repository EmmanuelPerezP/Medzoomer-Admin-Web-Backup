import React, { FC, useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Link } from 'react-router-dom';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import useAuth from '../../hooks/useAuth';
import { useStores } from '../../store';
import { decodeErrors } from '../../utils';

import TextField from '../common/TextField';
import Error from '../common/Error';

import styles from './Login.module.sass';

export const Login: FC = () => {
  const { logIn, setToken, changePassword } = useAuth();
  const [err, setErr] = useState({ email: '', password: '', global: '' });
  const { authStore } = useStores();
  const [loginData, setLoginData] = useState({ email: '', password: '', sessionToken: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [IsChangePassword, setIsChangePassword] = useState(false);

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
    setLoginData({ ...loginData, [key]: e.target.value });
    setErr({ ...err, [key]: '', global: '' });
  };

  useEffect(() => {
    // tslint:disable-next-line:only-arrow-functions
    document.onkeydown = function(e) {
      e = e || window.event;
      if (e.keyCode === 13) {
        handleLogin();
      }
    };
  }, [loginData]); // eslint-disable-line

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await logIn(loginData);
      if (response.SessionToken) {
        setLoginData({ ...loginData, sessionToken: response.SessionToken, password: '' });
        setIsChangePassword(true);
        setIsLoading(false);
      } else {
        const { AccessToken: token } = response;
        setToken(token);
        authStore.set('email')(loginData.email);
        authStore.set('password')(loginData.password);
        setIsLoading(false);
      }
    } catch (error) {
      const errors = error.response.data;
      if (errors.message !== 'validation error') {
        setErr({ ...err, global: errors.message });
      } else {
        setErr({ ...err, ...decodeErrors(errors.details) });
      }
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setIsLoading(true);
    try {
      const response = await changePassword(loginData);
      const { AccessToken: token } = response;
      setToken(token);
      authStore.set('email')(loginData.email);
      authStore.set('password')(loginData.password);
      setIsLoading(false);
    } catch (error) {
      const errors = error.response.data;
      if (errors.message !== 'validation error') {
        setErr({ ...err, global: errors.message });
      } else {
        setErr({ ...err, ...decodeErrors(errors.details) });
      }
      setIsLoading(false);
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
            type: showPassword ? 'text' : 'password',
            placeholder: 'Password',
            endAdornment: (
              <InputAdornment
                position="start"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.securePasswordBtn}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </InputAdornment>
            )
          }}
          onChange={handleChange('password')}
        />
        {err.password ? <Error value={err.password} /> : null}
      </div>
      {err.global ? <Error className={styles.error} value={err.global} /> : null}
      <Button
        className={styles.signInButton}
        disabled={isLoading}
        variant="contained"
        color="primary"
        onClick={handleLogin}
      >
        <Typography>Sign me in</Typography>
      </Button>
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.mainContent}>
        {IsChangePassword ? (
          <div className={styles.passwordForm}>
            <Typography className={styles.title}>Change Password</Typography>
            <Typography className={styles.subtitle}>Please enter new password</Typography>
            <div className={styles.passwordWrapper}>
              <TextField
                classes={{
                  root: styles.textField,
                  inputLabel: styles.inputLabel
                }}
                inputProps={{
                  type: showPassword ? 'text' : 'password',
                  placeholder: 'Password',
                  endAdornment: (
                    <InputAdornment
                      position="start"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.securePasswordBtn}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </InputAdornment>
                  )
                }}
                onChange={handleChange('password')}
                value={loginData.password}
              />
              {err.global || err.password ? <Error value={err.global || err.password} /> : null}
              <Button
                className={styles.sendRequest}
                variant="contained"
                color="primary"
                disabled={isLoading}
                onClick={handleChangePassword}
              >
                <Typography className={styles.requestText}>Change Password</Typography>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {renderForm()}
            <div className={styles.signInFooter}>
              <Typography>Forgot your password?</Typography>
              <Link to={'/reset-password'} className={styles.signUp}>
                Reset
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
