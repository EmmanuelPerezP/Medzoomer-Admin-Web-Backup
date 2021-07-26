import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '../../../../common/TextField';
import Error from '../../../../common/Error';
import styles from '../PharmacyInputs.module.sass';
import styles2 from './styles.module.sass';
import { InputAdornment } from '@material-ui/core';
import SelectButton from '../../../../common/SelectButton';
import { defItems } from '../../../../../constants';

interface IHighVolumeDeliveriesBlock {
  turnHv: any;
  handleChangeTabSelect: any;
  newPharmacy: any;
  handleChange: any;
  err: any;
}

const HighVolumeDeliveriesBlock: FC<IHighVolumeDeliveriesBlock> = ({
  turnHv,
  handleChangeTabSelect,
  newPharmacy,
  err,
  handleChange
}) => (
  <div className={styles2.highVolumeDeliveries}>
    <Typography className={styles.blockTitle}>High Volume Deliveries</Typography>
    <div className={styles.twoInput}>
      <div className={styles.textField}>
        <SelectButton defItems={defItems} label="" value={turnHv} onChange={handleChangeTabSelect('hvDeliveries')} />
      </div>
    </div>
    {turnHv === 'Yes' && (
      <>
        <div className={styles.twoInputInRowBlock}>
          <div className={styles.inputWrapper}>
            <TextField
              label={'Price for Delivery (Pharmacy)'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                startAdornment: <InputAdornment position="end">$</InputAdornment>
              }}
              value={newPharmacy.hvPriceFirstDelivery}
              onChange={handleChange('hvPriceFirstDelivery')}
            />
            {err.hvPriceFirstDelivery && <Error className={styles.error} value={err.hvPriceFirstDelivery} />}
          </div>

          <div className={styles.inputWrapper}>
            <TextField
              label={'Price for Delivery (Courier)'}
              classes={{
                root: styles.textField
              }}
              inputProps={{
                type: 'number',
                placeholder: '0.00',
                startAdornment: <InputAdornment position="end">$</InputAdornment>
              }}
              value={newPharmacy.hvPriceHighVolumeDelivery}
              onChange={handleChange('hvPriceHighVolumeDelivery')}
            />
            {err.hvPriceHighVolumeDelivery && <Error className={styles.error} value={err.hvPriceHighVolumeDelivery} />}
          </div>
          {/*<div className={styles.textField}>*/}
          {/*  <TextField*/}
          {/*    label={'Following Deliveries (invoice)'}*/}
          {/*    classes={{*/}
          {/*      root: styles.textField*/}
          {/*    }}*/}
          {/*    inputProps={{*/}
          {/*      type: 'number'*/}
          {/*    }}*/}
          {/*    value={newPharmacy.hvPriceFollowingDeliveries}*/}
          {/*    onChange={handleChange('hvPriceFollowingDeliveries')}*/}
          {/*  />*/}
          {/*  {err.hvPriceFollowingDeliveries ? (*/}
          {/*    <Error className={styles.error} value={err.hvPriceFollowingDeliveries} />*/}
          {/*  ) : null}*/}
          {/*</div>*/}
        </div>
      </>
    )}
  </div>
);

export default HighVolumeDeliveriesBlock;
