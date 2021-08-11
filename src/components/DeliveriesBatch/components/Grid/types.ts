import { IBatch, IBatches, User } from '../../../../interfaces';

export interface IGridProps {
  isLoading: boolean;
  items: IBatches;
}

export interface IGridRowProps {
  item: IBatch;
  user: User;
}

export interface IGridHeaderProps {
  prop?: any;
}
