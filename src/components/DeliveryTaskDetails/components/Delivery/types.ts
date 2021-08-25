import { Delivery } from '../../../../interfaces';
export interface IDeliveryProps {
  deliveryInfo: Delivery;
}

export interface IDeliveryPhotosBlock {
  deliveryInfo: Delivery;
}
export interface IDeliveryNotesBlock {
  notes: string;
}

export interface ITaskIconProps {
  deliveryStatus: string;
  isFirst: boolean;
}
export interface ITimelineTaskRowProps {
  task: any;
}
