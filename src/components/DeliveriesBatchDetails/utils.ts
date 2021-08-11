import { isObjectLike } from 'lodash';
import {
  Consumer,
  Delivery,
  ICompletionDetils,
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
