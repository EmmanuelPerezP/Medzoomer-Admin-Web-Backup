import { isObjectLike } from 'lodash';
import { Delivery } from '../../interfaces';

export const isPopulatedObject = (v: any) => {
  return v && isObjectLike(v);
};

export const emptyChar = '—';

export const getOnfleetTaskLink = (taskId: string): string =>
  `https://onfleet.com/dashboard#/manage?taskEdit=false&open=task&taskId=${taskId}`;

export const parseError = (e: any): string =>
  typeof e === 'string' ? e : e.message || 'Unresolved error, please try again';

export const getStartedEvent = (delivery: Delivery): Date | null => {
  const { completionDetails = {} } = delivery;
  const { events = [] } = completionDetails;
  const startEvent = events.find((event) => event.name === 'start')
  if (startEvent) {
    return new Date(startEvent.time)
  }
  return null;
};
