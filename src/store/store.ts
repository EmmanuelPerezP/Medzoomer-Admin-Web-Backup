import { createConnectedStoreAs } from 'undux';
import effects from './effects';
import {
  initAuth,
  initUser,
  initCourier,
  StoreStates,
  initSettingsGP,
  initSetting,
  initPharmacy,
  initGroup,
  initConsumer,
  initDelivery,
  initTeams,
  initBillingAccountStore,
  initTransaction,
  initTransactions,
  initConsumerOrder,
  initOrder,
  initBatch
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
    settingStore: initSetting(),
    settingGPStore: initSettingsGP(),
    consumerOrderStore: initConsumerOrder(),
    orderStore: initOrder(),
    batchStore: initBatch()
  },
  effects
);

export { StoreContainer, useStores, withStores };
