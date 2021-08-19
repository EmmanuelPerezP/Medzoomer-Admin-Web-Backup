import React, { FC } from 'react';
import { IMapProps } from './types';
import styles from './Map.module.sass';

export const Map: FC<IMapProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.map} />
    </div>
  );
};
