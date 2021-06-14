import { isObjectLike } from 'lodash';

const getValidObjectValue = (object: any) => (isObjectLike(object) ? object.value : object);

export const parseFilterToValidQuery = (filter: any) => ({
  ...filter,
  ...(filter.courier
    ? {
        courier: getValidObjectValue(filter.courier)
      }
    : {}),
  ...(filter.pharmacy
    ? {
        pharmacy: getValidObjectValue(filter.pharmacy)
      }
    : {}),
  ...(filter.customer 
    ? {
        customer: getValidObjectValue(filter.customer)
      } 
    : {})
});
