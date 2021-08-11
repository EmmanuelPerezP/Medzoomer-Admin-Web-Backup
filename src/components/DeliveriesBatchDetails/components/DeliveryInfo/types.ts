import { IBatch } from '../../../../interfaces';

export interface IDeliveryInfoProps {
  batch: IBatch;
  onAddAll: () => void;
  onCancel: () => void;
  isExtraLoading: boolean;
}
