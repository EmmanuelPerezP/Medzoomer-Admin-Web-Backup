import { IOrder, IOrders, User } from '../../../../interfaces';

export interface IGridProps {
  items: IOrders;
  isLoading: boolean;
  onSelectOne: (order: IOrder) => void;
  onUnselectAll: () => void;
  selectedOrders: string[];
}

export interface IGridRowProps {
  item: IOrder;
  user: User;
  isSelected: boolean;
  onSelect: (item: IOrder) => void;
}

export interface IGridHeaderProps {
  haveSelectedOrders: boolean;
  onUnselectAll: () => void;
}
