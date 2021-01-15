import React, { FC } from 'react';
import styles from './styles.module.sass';

const EmptyList: FC = () => {
  return <div className={styles.emptyList}>No data found</div>;
};

export default EmptyList;
