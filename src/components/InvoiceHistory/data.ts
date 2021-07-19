// TODO - remove this file after implementation logic
import { IInvoicedHistories, IInvoicedQueues } from './types';

const nowDate = new Date();
const deliveryStartDate = new Date(nowDate.getDate() + 5, nowDate.getMonth(), nowDate.getFullYear());
const deliveryEndDate = new Date(nowDate.getDate() + 10, nowDate.getMonth() + 1, nowDate.getFullYear());

const getDefaultEntityData = (id: number) => ({
  createdAt: nowDate.toISOString(),
  updatedAt: nowDate.toISOString(),
  _id: `${id}dasdadasdadad`
});

export const InvoicedHistoryData: IInvoicedHistories = [
  {
    queue: 'QUEUE 1',
    invoicedId: 76545,
    invoicedLink: 'https://www.google.com/search?q=invoicedLink_1',
    status: 'Sent',
    amount: '60.6000001',
    deliveryIDCollection: [1],
    errorText: 'error text 1',

    ...getDefaultEntityData(1)
  },
  {
    queue: 'QUEUE 2',
    invoicedId: 12321,
    invoicedLink: 'https://www.google.com/search?q=invoicedLink_2',
    status: 'Error',
    amount: '34.10',
    deliveryIDCollection: [1, 2],
    errorText: 'error text 2',

    ...getDefaultEntityData(2)
  },
  {
    queue: 'QUEUE 3',
    invoicedId: 45645,
    invoicedLink: 'https://www.google.com/search?q=invoicedLink_3',
    status: 'Sent',
    amount: '4.20',
    deliveryIDCollection: [1, 2, 3],
    errorText: 'error text 3',

    ...getDefaultEntityData(3)
  },
  {
    queue: 'QUEUE 4',
    invoicedId: 89675,
    invoicedLink: 'https://www.google.com/search?q=invoicedLink_4',
    status: 'Error',
    amount: '90.122222',
    deliveryIDCollection: [1, 2, 3, 4],
    errorText: 'error text 4',

    ...getDefaultEntityData(4)
  }
];
