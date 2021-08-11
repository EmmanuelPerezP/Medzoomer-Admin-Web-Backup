import { Delivery, Pharmacy, Task } from '../../../../interfaces';

export interface IOnfleetTasksProps {
  deliveries: Array<Delivery | string>;
  pharmacy: Pharmacy | string | null;
}

export interface ITaskHeaderProps {
  props?: any;
}

export interface ITaskRowProps {
  task: Task;
}

export interface ITaskIconProps {
  task: Task;
  isFirst: boolean;
}
