import styles from './DeliveriesBatch.module.sass';
import React, { FC, useEffect, useState } from 'react';
import useBatch from '../../hooks/useBatch';
import { useBooleanState } from '../../hooks/useBooleanState';
import { IBatches } from '../../interfaces';
import { useStores } from '../../store';
import { Grid, Header } from './components';
import { FilterModal } from './components/FilterModal';
import { GetDeliveriesBatchResponse } from './types';
import { DeliveriesBatchConfiguration, parseBatchFilter } from './utils';

export const DeliveriesBatch: FC = () => {
  const { batchStore } = useStores();
  const { getBatches, filters } = useBatch();
  const [batches, setBatches] = useState<IBatches>([]);
  const [isFilterOpen, showFilter, hideFilter] = useBooleanState();
  const [isLoading, showLoader, hideLoader] = useBooleanState();

  const getBatchesList = async () => {
    try {
      showLoader();
      const result: GetDeliveriesBatchResponse = await getBatches(parseBatchFilter(filters));
      if (!result.data) throw result;
      const { data, meta } = result;
      setBatches(data);
      batchStore.set('meta')(meta);
      hideLoader();
    } catch (e) {
      console.error('Error: DeliveriesBatch.getBatchesList()', { e });
      hideLoader();
    }
  };

  useEffect(() => {
    void getBatchesList();
  }, [filters]); // eslint-disable-line

  return (
    <div className={styles.container}>
      <Header configuration={DeliveriesBatchConfiguration} handleOpenFilter={showFilter} />
      <Grid items={batches} isLoading={isLoading} />
      <FilterModal isOpen={isFilterOpen} onClose={hideFilter} />
    </div>
  );
};
