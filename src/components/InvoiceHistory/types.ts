export interface IDefaultEntity {
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  _id: string;
}

export interface IInvoicedQueueEntity extends IDefaultEntity {
  settingsGP: any;
  runDateAt: string;
  queue_id: string;
  deliveryStartDateAt: string;
  note: string;
  status: string;
  deliveryEndDateAt: string;
  completeDate: string;
}

export interface IInvoicedHistoryEntity extends IDefaultEntity {
  queue: string;
  invoicedId: number;
  invoicedLink: string;
  status: string;
  amount: string;
  deliveryIDCollection: any[];
  errorText: string;
}

export interface IInvoicedQueues extends Array<IInvoicedQueueEntity> {}

export interface IInvoicedHistories extends Array<IInvoicedHistoryEntity> {}

// tslint:disable-next-line:no-empty-interface
export interface IInvoicedQueue extends IInvoicedQueueEntity {}

// tslint:disable-next-line:no-empty-interface
export interface IInvoicedHistory extends IInvoicedHistoryEntity {}
