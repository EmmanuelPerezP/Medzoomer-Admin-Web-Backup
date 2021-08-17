import { Button, Grid } from '@material-ui/core';
import React, { FC, useMemo } from 'react';
import Loading from '../../../common/Loading';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { getNotCanceledDeliveryIds, getNotInvoicedOrderIds } from '../../utils';
import { IDeliveryInfoProps } from './types';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

export const DeliveryInfo: FC<IDeliveryInfoProps> = ({ batch, onAddAll, onCancel, isExtraLoading }) => {
  const canShowCancelAll: boolean = useMemo(() => {
    const [, haveNotCanceled] = getNotCanceledDeliveryIds(batch);
    return haveNotCanceled;
  }, [batch]);

  const canShowAddToInvoice: boolean = useMemo(() => {
    const [, haveNotInvoiced] = getNotInvoicedOrderIds(batch);
    return haveNotInvoiced;
  }, [batch]);

  return (
    <Wrapper
      title="Delivery ID"
      subTitle={`${batch.batch_uuid}`}
      iconName="delivery"
      HeaderRightComponent={
        <Grid container spacing={2}>
          {isExtraLoading ? (
            <Grid item>
              <Loading />
            </Grid>
          ) : (
            <>
              {canShowAddToInvoice && (
                <Grid item>
                  <Button onClick={onAddAll} variant="contained" size="small" color="secondary" style={buttonStyles}>
                    Add all to Invoice
                  </Button>
                </Grid>
              )}
              {canShowCancelAll && (
                <Grid item>
                  <Button onClick={onCancel} variant="outlined" size="small" color="primary" style={buttonStyles}>
                    CANCEL ALL TASKS
                  </Button>
                </Grid>
              )}
            </>
          )}
        </Grid>
      }
    />
  );
};
