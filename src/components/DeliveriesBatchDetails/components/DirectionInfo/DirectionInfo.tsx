import styles from './DirectionInfo.module.sass';
import React, { FC, useMemo } from 'react';

import { IDirectionInfoProps } from './types';
import MapDirection from '../../../common/MapDirection';
import { convertTasksToWaypoints } from '../../../common/MapDirection/utils';
import { convertDeliveriesToTasks, isPopulatedObject } from '../../utils';
import { Delivery, Pharmacy } from '../../../../interfaces';

export const DirectionInfo: FC<IDirectionInfoProps> = ({ batch }) => {
  const waypoints = useMemo(() => {
    const taks = convertDeliveriesToTasks(batch.deliveries, batch.pharmacy);
    return convertTasksToWaypoints(taks);
  }, [batch.deliveries]);

  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <MapDirection waypoints={waypoints} />
      </div>
    </div>
  );
};
