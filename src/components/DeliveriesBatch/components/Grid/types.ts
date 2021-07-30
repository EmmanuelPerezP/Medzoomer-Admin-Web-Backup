import { User } from '../../../../interfaces';

export interface IGridProps {
  items: any[];
  // items: IDeliveries;
  isLoading: boolean;
}

export interface IGridRowProps {
  item: any;
  // item: IDeliverie
  user: User;
}
