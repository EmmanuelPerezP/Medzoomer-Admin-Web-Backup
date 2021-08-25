import styles from './DeliveryInfo.module.sass';
import React, { FC, useCallback } from 'react';
import { Button } from '@material-ui/core';

import { IDeliveryInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { useHistory } from 'react-router-dom';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

export const DeliveryInfo: FC<IDeliveryInfoProps> = ({ batch }) => {
  const history = useHistory();

  const handleDeliveryDetailsRedirect = useCallback(() => {
    history.push(`/dashboard/deliveries/${batch._id}`);
  }, [history, batch]);

  return (
    <Wrapper
      title="Delivery ID"
      subTitle={`${batch.batch_uuid}`}
      iconName="delivery"
      HeaderCenterComponent={
        <div className={styles.centerContainer}>
          <div className={styles.title}>Total Orders</div>
          <div className={styles.subtitle}>{(batch.deliveries || []).length}</div>
        </div>
      }
      HeaderRightComponent={
        <div className={styles.buttonContainer}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            style={buttonStyles}
            onClick={handleDeliveryDetailsRedirect}
          >
            Delivery Details
          </Button>
        </div>
      }
    />
  );
};
