import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';
import Button from '@material-ui/core/Button';

export const Login: FC = () => {
  const { user, login } = useLogin();
  if (user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <h1>Sign in</h1>
      <div>
        <Button variant="contained" color="secondary" onClick={login}>
          Sign in
        </Button>
      </div>
    </div>
  );
};
