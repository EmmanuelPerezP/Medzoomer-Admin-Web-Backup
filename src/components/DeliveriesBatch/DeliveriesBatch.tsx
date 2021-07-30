import React, { FC } from 'react';
import { useBooleanState } from '../../hooks/useBooleanState';
import { Grid, Header } from './components';
import { FilterModal } from './components/FilterModal';
import styles from './DeliveriesBatch.module.sass';
import { DeliveriesBatchConfiguration } from './utils';

export const DeliveriesBatch: FC = () => {
  const [isFilterOpen, showFilter, hideFilter] = useBooleanState();
  const [isLoading, showLoader, hideLoader] = useBooleanState();

  const deliveries = [
    {
      _id: '60d58e1101b59e03e290b82f',
      deliveryId: 4559,
      createdAt: '2021-01-27T14:23:23.683Z',
      courier: {
        _id: '60c95cbfde1ccb8958e17b50',
        fullName: 'Enyinnaya Chinedu'
      },
      totalDistance: '2.4 mi',
      totalPrice: 24.0,
      totalCopay: 88.5,
      status: 'progress'
    },
    {
      _id: 'id2',
      deliveryId: 4559,
      createdAt: '2021-01-27T14:23:23.683Z',
      courier: {
        _id: '60c95cbfde1ccb8958e17b50',
        fullName: 'Enyinnaya Chinedu'
      },
      totalDistance: '2.4 mi',
      totalPrice: 24.0,
      totalCopay: 88.5,
      status: 'finished'
    },
    {
      _id: 'id3',
      deliveryId: 4559,
      createdAt: '2021-01-27T14:23:23.683Z',
      courier: {
        _id: '60c95cbfde1ccb8958e17b50',
        fullName: 'Enyinnaya Chinedu'
      },
      totalDistance: '2.4 mi',
      totalPrice: 24.0,
      totalCopay: 88.5,
      status: 'finished'
    }
  ];

  return (
    <div className={styles.container}>
      <Header configuration={DeliveriesBatchConfiguration} handleOpenFilter={showFilter} />
      <Grid items={deliveries} isLoading={isLoading} />
      <FilterModal isOpen={isFilterOpen} onClose={hideFilter} />
    </div>
  );
};
