import { BatchQueryParams } from '../interfaces';
import { useStores } from '../store';
import { getBatch, getBatches } from '../store/actions/batch';

export default function useOrder() {
  const { batchStore } = useStores();

  return {
    batchStore,
    ...batchStore.getState(),
    getBatches: (params: BatchQueryParams) => getBatches(params),
    getBatch: (id: string) => getBatch(id)
  };
}
