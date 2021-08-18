import { Delivery } from '../../../../interfaces';
export interface IDeliveryProps {
  delivery: any[];
  deliveryInfo: Delivery;
}

export interface IDeliveryPhotosBlock {
  deliveryInfo: Delivery;
}
export interface IDeliveryNotesBlock {
  notes: string;
}

export interface ITaskIconProps {
  task: any;
  isFirst: boolean;
}
export interface ITimelineTaskRowProps {
  task: any;
}
