import { ErrorInterface, DestructByKey } from './interfaces';
export const decodeErrors = (errors: ErrorInterface[]) => {
  return Array.from(errors || []).reduce((res: object, e: ErrorInterface) => {
    return { ...res, [e.field[0]]: e.messages[0] };
  }, {});
};

export const Statuses: DestructByKey<string> = {
  ACTIVE: 'Active',
  DECLINED: 'Declined',
  PENDING: 'Pending'
};
