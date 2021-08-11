import { Delivery, IOrder } from '../../../../interfaces';

export interface ITaskInfoProps {
  order: IOrder;
  delivery: Delivery;
  isLoading: boolean;
  onForceInvoiced: () => void;
}
