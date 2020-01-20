import { EffectsAs, withLogger } from 'undux';

import { StoreStates } from './states';

export type StoreEffects = EffectsAs<StoreStates>;

const effects: StoreEffects = (stores) => {
  withLogger(stores.test);

  // stores.test.on('profile').
  //   pipe(filter((value, index) => {
  //     console.log('effects.profile', index d, value);
  //     return Boolean(value && value.age >= 18 && !value.adult);
  //   })).
  //   WRONG !!!!
  //   subscribe(value => {
  //     stores.test.set('profile')({ ...value!, adult: true });
  //   });

  stores.test
    .on('profile')
    .forEach((value) => {
      if (value) {
        value.adult = value.age >= 18;
        value.color = value.color || (value.age >= 80 ? 'white' : 'black');
      }
    })
    .catch(console.warn);

  return stores;
};

export default effects;
