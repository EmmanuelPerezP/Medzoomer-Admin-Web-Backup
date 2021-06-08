import { ChangeEvent } from 'react';

type Action<T> = (value: T) => void;

export type Event = ChangeEvent<HTMLInputElement>;

export interface IProps {
  rcEnable: boolean;
  id: string;
  rcFlatFeeForCourier: number | null;
  rcFlatFeeForPharmacy: number | null;
  onChangeRcEnable: Action<boolean>;
  onChangeRcFlatFeeForCourier: Action<number>;
  onChangeRcFlatFeeForPharmacy: Action<number>;
}
