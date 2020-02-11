import { createConnectedStoreAs } from 'undux';
import effects from './effects';
import { initAuth, initUser, initCourier, StoreStates } from './states';

const { Container: StoreContainer, useStores, withStores } = createConnectedStoreAs<StoreStates>(
  {
    authStore: initAuth(),
    userStore: initUser(),
    courierStore: initCourier()
  },
  effects
);

export { StoreContainer, useStores, withStores };
