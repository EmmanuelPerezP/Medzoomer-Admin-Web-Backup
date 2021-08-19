import api from '../../api';
import { BatchQueryParams } from '../../interfaces';

export const getBatches = (params: BatchQueryParams) => {
  return api.getBatches(params);
};

export const getBatch = (id: string) => {
  return api.getBatch(id);
};
