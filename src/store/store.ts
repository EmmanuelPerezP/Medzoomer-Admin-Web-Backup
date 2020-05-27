import { createConnectedStoreAs } from 'undux';
import effects from './effects';
import {
  initAuth,
  initUser,
  initCourier,
  StoreStates,
  initSetting,
  initPharmacy,
  initGroup,
  initConsumer,
  initDelivery,
  initTransaction
} from './states';

const { Container: StoreContainer, useStores, withStores } = createConnectedStoreAs<StoreStates>(
  {
    authStore: initAuth(),
    userStore: initUser(),
    courierStore: initCourier(),
    pharmacyStore: initPharmacy(),
    groupStore: initGroup(),
    consumerStore: initConsumer(),
    deliveryStore: initDelivery(),
    transactionStore: initTransaction(),
    settingStore: initSetting()
  },
  effects
);

export { StoreContainer, useStores, withStores };
