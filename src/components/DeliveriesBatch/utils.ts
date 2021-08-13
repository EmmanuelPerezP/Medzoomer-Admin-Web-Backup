import { isObjectLike } from 'lodash';
import { BatchFilter, BatchQueryParams } from '../../interfaces';
import { IDeliveriesBatchConfiguration } from './types';

const getValidObjectValue = (object: any) => (isObjectLike(object) ? object.value : object);

export const DeliveriesBatchConfiguration: IDeliveriesBatchConfiguration = {
  perPage: 10
};

export const parseBatchFilter = (filter: BatchFilter): BatchQueryParams => {
  const { search, pharmacy, courier, ...otherFilters } = filter;
  return {
    ...otherFilters,
    search: (search && search.trim()) || '',
    ...(pharmacy
      ? {
          pharmacy: getValidObjectValue(pharmacy)
        }
      : {}),
    ...(courier
      ? {
          courier: getValidObjectValue(courier)
        }
      : {})
  };
};
