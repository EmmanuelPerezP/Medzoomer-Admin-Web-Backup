import { Button, Grid } from '@material-ui/core';
import React, { FC } from 'react';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { IDeliveryInfoProps } from './types';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

export const DeliveryInfo: FC<IDeliveryInfoProps> = ({ id, onAddAll, onCancel }) => {
  return (
    <Wrapper
      title="Delivery ID"
      subTitle={`${id}`}
      iconName="delivery"
      HeaderRightComponent={
        <Grid container spacing={2}>
          <Grid item>
            <Button onClick={onAddAll} variant="contained" size="small" color="secondary" style={buttonStyles}>
              Add all to Invoice
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={onCancel} variant="outlined" size="small" color="primary" style={buttonStyles}>
              CANCEL ALL TASKS
            </Button>
          </Grid>
        </Grid>
      }
    />
  );
};
