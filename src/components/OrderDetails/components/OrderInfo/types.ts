import { IOrder } from '../../../../interfaces';

export interface IOrderInfoProps {
  item: IOrder;
  onCreateDelivery: () => void;
  onCancelOrder: () => void;
  isAlreadyInBatch: boolean;
  isLoading: boolean;
}
