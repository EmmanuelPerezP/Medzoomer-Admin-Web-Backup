import React, { FC } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { StoreContainer } from './store';
import { AppRouteProps } from './types';
import theme from './theme';
import LoginLayout from './layouts/LoginLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import ErrorBoundary from './components/common/ErrorBoundary';
import Terms from './components/Terms';
import useAuth from './hooks/useAuth';

function dummyLayout(props: any) {
  return props.children;
}

const AppRoute: FC<AppRouteProps> = (props: any) => {
  const { noAuth = false, redirect, children, component, layout, ...rest } = props;
  const { isAuth } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        const Layout = layout ? layout : dummyLayout;
        return isAuth === !noAuth ? (
          <Layout>{component ? React.createElement(component) : children}</Layout>
        ) : (
          <Redirect
            to={{
              pathname: redirect,
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
};

const App: FC = () => {
  const { isAuth } = useAuth();

  return (
    <Router>
      <Switch>
        <AppRoute path="/dashboard" component={Dashboard} layout={AuthLayout} redirect="/login" />
        <AppRoute path="/login" component={Login} layout={LoginLayout} noAuth redirect="/dashboard" />
        <AppRoute path="/reset-password" component={ResetPassword} layout={LoginLayout} noAuth redirect="/login" />
        <Route path="/terms" component={Terms} />
        <Redirect exact path="/*" to={isAuth ? '/dashboard' : '/login'} />
      </Switch>
    </Router>
  );
};

const AppProvider: FC = () => (
  <ThemeProvider theme={theme}>
    <StoreContainer>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StoreContainer>
  </ThemeProvider>
);

export default AppProvider;
