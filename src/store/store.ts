import { createConnectedStoreAs } from 'undux';
import effects from './effects';
import { initAuth, initUser, initCourier, StoreStates, initPharmacy, initGroup, initCustomer } from './states';

const { Container: StoreContainer, useStores, withStores } = createConnectedStoreAs<StoreStates>(
  {
    authStore: initAuth(),
    userStore: initUser(),
    courierStore: initCourier(),
    pharmacyStore: initPharmacy(),
    groupStore: initGroup(),
    customerStore: initCustomer()
  },
  effects
);

export { StoreContainer, useStores, withStores };
