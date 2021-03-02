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
  initTeams,
  initBillingAccountStore,
  initTransaction,
  initTransactions
} from './states';

const { Container: StoreContainer, useStores, withStores } = createConnectedStoreAs<StoreStates>(
  {
    teamsStore: initTeams(),
    transactionStore: initTransaction(),
    authStore: initAuth(),
    userStore: initUser(),
    courierStore: initCourier(),
    pharmacyStore: initPharmacy(),
    groupStore: initGroup(),
    billingAccountStore: initBillingAccountStore(),
    consumerStore: initConsumer(),
    deliveryStore: initDelivery(),
    transactionsStore: initTransactions(),
    settingStore: initSetting()
  },
  effects
);

export { StoreContainer, useStores, withStores };
