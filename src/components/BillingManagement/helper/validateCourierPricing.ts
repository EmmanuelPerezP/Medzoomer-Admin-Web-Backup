import { ICourierPricing } from '../../../interfaces';
import { courierPricingLabels } from '../../../constants';
import _ from 'lodash';

export const validateCourierPricing = (settings: ICourierPricing) => {
  const emptyCourierPricing: ICourierPricing = {
    courier_cost_for_one_order: '',
    courier_cost_for_two_order: '',
    courier_cost_for_more_two_order: '',
    courier_cost_for_ml_in_delivery: ''
  };
  let isError = false;
  const errors: ICourierPricing = {
    ...emptyCourierPricing,
    ...Object.keys(settings).reduce((res: object, e: any) => {
      const value = Number(_.get(settings, e));
      
      if (_.get(settings, e) === '') {
        isError = true;
        return { ...res, [e]: `${courierPricingLabels[e]} cannot be empty` };
      }
      
      if (value >= 100) {
        isError = true;
        return {
          ...res,
          [e]: `${courierPricingLabels[e]} must be lower than 100`
        };
      }

      if (value <= 0) {
        isError = true;
        return {
          ...res,
          [e]: `${courierPricingLabels[e]} must be greater than 0`
        };
      }

      return { ...res };
    }, {})
  }
  return {
    errors,
    isCourierError: isError,
  };
};
