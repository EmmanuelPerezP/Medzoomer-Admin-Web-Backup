import { createConnectedStoreAs } from 'undux';
import effects from './effects';
import { initAuth, initUser, initCourier, StoreStates, initPharmacy } from './states';

const { Container: StoreContainer, useStores, withStores } = createConnectedStoreAs<StoreStates>(
  {
    authStore: initAuth(),
    userStore: initUser(),
    courierStore: initCourier(),
    pharmacyStore: initPharmacy()
  },
  effects
);

export { StoreContainer, useStores, withStores };
