import { isObjectLike } from 'lodash';
import { OrderFilter, OrderQueryParams } from '../../interfaces';
import { IOrdersConfiguration } from './types';

export const OrdersConfiguration: IOrdersConfiguration = {
  perPage: 10
};

const getValidObjectValue = (object: any) => (isObjectLike(object) ? object.value : object);

export const parseOrderFilter = (filter: OrderFilter): OrderQueryParams => {
  const { search, pharmacy, ...otherFilters } = filter;
  return {
    ...otherFilters,
    search: (search && search.trim()) || '',
    ...(pharmacy
      ? {
          pharmacy: getValidObjectValue(pharmacy)
        }
      : {})
  };
};

export const downloadCSV = (downloadAttr: string, url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', downloadAttr);
  document.body.appendChild(link);
  link.click();
  link.parentNode && link.parentNode.removeChild(link);
};
