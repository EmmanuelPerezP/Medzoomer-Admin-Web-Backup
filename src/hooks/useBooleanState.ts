import { useMemo, useState } from 'react';

interface IUseBooleanStateActions {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  set: (state: boolean) => void;
  reset: () => void;
}

type IUseBooleanState = (
  defaultValue?: boolean
) => [
  boolean,
  IUseBooleanStateActions['show'],
  IUseBooleanStateActions['hide'],
  IUseBooleanStateActions['toggle'],
  IUseBooleanStateActions['set'],
  IUseBooleanStateActions['reset']
];

export const useBooleanState: IUseBooleanState = (defaultValue = false) => {
  const [state, setState] = useState<boolean>(defaultValue);

  const actions: IUseBooleanStateActions = useMemo(
    () => ({
      show: () => setState(true),
      hide: () => setState(false),
      toggle: () => setState((prev) => !prev),
      set: (newState) => setState(newState),
      reset: () => setState(defaultValue)
    }),
    [setState, defaultValue]
  );

  return [state, actions.show, actions.hide, actions.toggle, actions.set, actions.reset];
};
