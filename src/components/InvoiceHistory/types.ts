export interface IDefaultEntity {
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface IInvoicedQueueEntity extends IDefaultEntity {
  settingsGP: any;
  runDate: string;
  queue_id: string;
  deliveryStartDate: string;
  note: string;
  status: string;
  deliveryEndDate: string;
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
