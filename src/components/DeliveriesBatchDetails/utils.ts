import { isObjectLike } from 'lodash';
import {
  Consumer,
  Delivery,
  IBatch,
  IOrder,
  Pharmacy,
  Task,
  TDeliveryStatuses,
  TOrderStatuses
} from '../../interfaces';

// expression char for empty number of phone
const exp = (value: string | undefined) => value || 'X';

export const isPopulatedObject = (v: any) => {
  return v && isObjectLike(v);
};

export const getMaskedPhone = (phone: string): string => {
  let clearPhone = phone.replace('+', '');
  if (clearPhone.length === 10) clearPhone = `1${clearPhone}`;
  const [n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11] = clearPhone.split('');

  return `${exp(n1)} (${exp(n2)}${exp(n3)}${exp(n4)}) ${exp(n5)}${exp(n6)}${exp(n7)}-${exp(n8)}${exp(n9)}${exp(
    n10
  )}${exp(n11)}`;
};

export const getFullAddress = (address: Consumer['address']): string => {
  const { number: streetNumber, street, apartment, city, state, postalCode } = address;

  const isExist = (value: any): boolean => !(value === undefined);

  return `${isExist(streetNumber) ? streetNumber + ' ' : ''}${isExist(street) ? street + ', ' : ''}${
    isExist(apartment) ? `Building ${apartment}, ` : ''
  }${isExist(city) ? city + ', ' : ''}${isExist(state) ? state + ', ' : ''}${isExist(postalCode) ? postalCode : ''}`;
};

export const getShortAddress = (address: Consumer['address']): string => {
  const { street, number: streetNumber } = address;
  return `${streetNumber ? streetNumber + ' ' : ''}${street}`;
};

export const emptyChar = '—';

export const checkIfOrderAlreadyInBatch = (order: IOrder | null): boolean => {
  return !!(order && isPopulatedObject(order.$batch));
};

export const parseError = (e: any): string =>
  typeof e === 'string' ? e : e.message || 'Unresolved error, please try again';

export const checkIfTaskStarted = (delivery: Delivery): boolean => {
  const { completionDetails = {} } = delivery;
  const { events = [] } = completionDetails;

  if (events.find((event) => event.name === 'start')) {
    return true;
  }
  return false;
};

export const getOnFleetDistance = (delivery: Delivery): string | null => {
  if (delivery.completionDetails && delivery.completionDetails.distance) {
    return String(delivery.completionDetails.distance);
  }
  return null;
};

export const getEntrypointStatus = (delivery: Delivery): TOrderStatuses => {
  const status = parseDeliveryStatusToOrderStatus(delivery.status as TDeliveryStatuses);

  type Statuses = TOrderStatuses[];

  // delivery has been started
  if ((['delivered', 'canceled', 'failed', 'route'] as Statuses).includes(status)) {
    return 'delivered';
  }

  // delivery has NOT been started
  if ((['new', 'ready', 'pending'] as Statuses).includes(status)) {
    return 'pending';
  }

  // rare case, return current status of first delivery
  return status;
};

export const parseDeliveryStatusToOrderStatus = (deliveryStatus: TDeliveryStatuses): TOrderStatuses => {
  switch (deliveryStatus) {
    case 'PENDING':
      return 'ready';

    case 'PROCESSED':
    case 'UNASSIGNED':
    case 'ASSIGNED':
      return 'pending';

    case 'ACTIVE':
      return 'route';

    case 'COMPLETED':
      return 'delivered';

    case 'CANCELED':
      return 'canceled';

    case 'FAILED':
      return 'failed';

    default:
      return 'new';
  }
};

export const convertDeliveriesToTasks = (
  deliveries: Array<Delivery | string>,
  pharmacy?: Pharmacy | string | null
): Task[] => {
  const items: Task[] = [];

  if (!deliveries.length || !isPopulatedObject(deliveries[0])) return [];

  const $deliveries = deliveries as Delivery[];
  const firstDelivery = deliveries[0] as Delivery;

  // parsing start point of deliveries (pharmacy)
  if (isPopulatedObject(pharmacy)) {
    const originalPharmacy = pharmacy as Pharmacy;
    const isStarted = checkIfTaskStarted(firstDelivery);

    items.push({
      destinationType: 'pharmacy',
      isRC: false,
      status: isStarted ? getEntrypointStatus(firstDelivery) : 'new',
      destinationId: originalPharmacy._id,
      destinationAddress: originalPharmacy.address,
      destinationName: originalPharmacy.name,
      point: {
        lat: Number(originalPharmacy.latitude),
        lng: Number(originalPharmacy.longitude)
      }
    });
  }

  // parsing deliveries (orders)
  // eslint-disable-next-line
  $deliveries.map((delivery) => {
    if (isPopulatedObject(delivery.order)) {
      const originalOrder = delivery.order as IOrder;
      const originalCustomer = isPopulatedObject(delivery.customer) ? delivery.customer : null;
      const { _id, address, fullName, latitude, longitude } = originalCustomer || {};

      // calculation price
      let price: number = 0;
      if ('forcedPriceForCourier' in delivery && Number(delivery.forcedPriceForCourier)) {
        price = Number(delivery.forcedPriceForCourier);
      }
      if ((delivery as any).payout) {
        price = Number((delivery as any).payout.amount);
      }

      items.push({
        destinationType: 'customer',
        isRC: false,
        orderId: originalOrder._id,
        deliveryId: (delivery as any)._id,
        order_uuid: originalOrder.order_uuid,
        deliveryDistance: getOnFleetDistance(delivery) || undefined,
        status: originalOrder.status,
        ...(_id ? { destinationId: _id } : {}),
        ...(address ? { destinationAddress: address } : {}),
        ...(fullName ? { destinationName: fullName } : {}),
        price: price || undefined,
        point: {
          lat: Number(latitude),
          lng: Number(longitude)
        }
      });
    }
  });

  // parsing return cash delivery
  const rcDelivery = deliveries.find((delivery) => (delivery as Delivery).type === 'RETURN_CASH');
  if (isPopulatedObject(rcDelivery) && isPopulatedObject(pharmacy)) {
    const originalPharmacy = pharmacy as Pharmacy;
    const { status, notes } = rcDelivery as Delivery;
    const [, rcPrice] = (notes || '').split('TOTAL_COPAY='); // value might be such as 'TOTAL_COPAY=100'

    items.push({
      destinationType: 'pharmacy',
      isRC: true,
      rcPrice: Number(rcPrice),
      deliveryId: (rcDelivery as any)._id,
      status: parseDeliveryStatusToOrderStatus(status as TDeliveryStatuses),
      deliveryDistance: getOnFleetDistance(rcDelivery as Delivery) || undefined,
      destinationId: originalPharmacy._id,
      destinationAddress: originalPharmacy.address,
      destinationName: originalPharmacy.name,
      point: {
        lat: Number(originalPharmacy.latitude),
        lng: Number(originalPharmacy.longitude)
      }
    });
  }

  return items;
};

export const getDeliveriesIDsFromBatch = (batch: IBatch): string[] => {
  const deliveriesIDs: string[] = [];

  if (batch.deliveries.length) {
    if (batch.deliveries.length && typeof batch.deliveries[0] === 'string') {
      deliveriesIDs.push(...(batch.deliveries as string[]));
    } else {
      // eslint-disable-next-line
      (batch.deliveries as Delivery[]).map((delivery) => {
        deliveriesIDs.push((delivery as any)._id);
      });
    }
  }

  const uniqueValues = Array.from(new Set(deliveriesIDs));

  return uniqueValues;
};

export const getNotInvoicedOrderIds = (batch: IBatch): [string[], boolean] => {
  const orderIDs: string[] = [];
  // eslint-disable-next-line
  (batch.deliveries as Delivery[]).map((delivery) => {
    if (isPopulatedObject(delivery.order) && !(delivery.income || delivery.forcedIncome)) {
      orderIDs.push(delivery.order._id);
    }
  });

  const uniqueValues = Array.from(new Set(orderIDs));
  return [uniqueValues, !!uniqueValues.length];
};

export const getNotCanceledDeliveryIds = (batch: IBatch): [string[], boolean] => {
  const deliveriesIDs: string[] = [];
  // eslint-disable-next-line
  (batch.deliveries as Delivery[]).map((delivery) => {
    if (isPopulatedObject(delivery) && (delivery.status as TDeliveryStatuses) !== 'CANCELED') {
      deliveriesIDs.push((delivery as any)._id);
    }
  });

  const uniqueValues = Array.from(new Set(deliveriesIDs));
  return [uniqueValues, !!uniqueValues.length];
};
