import { isObjectLike } from 'lodash';
import { Consumer, Delivery, IOrder } from '../../interfaces';

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

export const emptyChar = '—';

export const checkIfOrderAlreadyInBatch = (order: IOrder | null): boolean => {
  return !!(order && isPopulatedObject(order.$batch));
};

export const parseError = (e: any): string =>
  typeof e === 'string' ? e : e.message || 'Unresolved error, please try again';

export const canCreateDelivery = (order: IOrder): boolean => {
  const passStatusCondition = order.status !== 'delivered'
  const passTaskCondition = isPopulatedObject(order.delivery) && (!(order.delivery as Delivery).taskIds || !(order.delivery as Delivery).taskIds.length)

  return passStatusCondition && passTaskCondition
}

export const getOnfleetTaskLink = (taskId: string): string => `https://onfleet.com/dashboard#/manage?taskEdit=false&open=task&taskId=${taskId}`
