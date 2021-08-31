import React, { FC } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { useStores } from '../../../../../../store';

import styles from './styles.module.sass';

const CourierStatistic: FC = () => {
  const { deliveryStore } = useStores();

  return (
    <div className={styles.statistic}>
      <div className={styles.moneyBlock}>
        <Typography className={styles.title}>Total Earned</Typography>
        <Typography className={classNames(styles.money, styles.earned)}>
          ${Math.round(deliveryStore.get('meta').totalFees * 100) / 100}
        </Typography>
      </div>
      <div className={styles.moneyBlock}>
        <Typography className={styles.title}>Total Bonus</Typography>
        <Typography className={classNames(styles.money, styles.earned)}>
          ${Math.round(deliveryStore.get('meta').bonus * 100) / 100}
        </Typography>
      </div>
      <div className={styles.moneyBlock}>
        <Typography className={styles.title}>Total Deliveries</Typography>
        <Typography className={styles.money}>{deliveryStore.get('meta').totalCount}</Typography>
      </div>
    </div>
  );
};

export default CourierStatistic;
