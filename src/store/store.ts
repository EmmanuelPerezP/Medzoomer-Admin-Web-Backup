import { createConnectedStoreAs, Store } from 'undux';
import effects from './effects';
import { AuthState, initAuth, initTest, initUser, StoreStates, Test, User } from './states';

export interface StoreProps {
  auth: Store<AuthState>;
  user: Store<User>;
  test: Store<Test>;
}

const { Container: StoreContainer, useStores, withStores } = createConnectedStoreAs<StoreStates>(
  {
    auth: initAuth(),
    user: initUser(),
    test: initTest()
  },
  effects
);

export { StoreContainer, useStores, withStores };
