import React, { FC } from 'react';
import { InputAdornment, Typography } from '@material-ui/core';
import classNames from 'classnames';
import Loading from '../../../common/Loading';
import styles from './CourierPricing.module.sass';
import TextField from '../../../common/TextField';
import { ICourierPricing } from '../../../../interfaces';
import { Error } from '../../../common/Error/Error';
import { SETTINGS, courierPricingLabels } from '../../../../constants';
import _ from "lodash";

interface Props {
  notDefaultBilling: any;
  isLoading: boolean;
  courierPricing: ICourierPricing;
  errors: ICourierPricing;
  handleCourierPricingChange: Function;
}

export const CourierPricing: FC<Props> = (props) => {
  const { 
    notDefaultBilling,
    isLoading,
    courierPricing,
    errors,
    handleCourierPricingChange
  } = props;

  const renderPricingInput = (type: string) => {
    return (
      <div className={styles.textField}>
        <TextField
          label={courierPricingLabels[type]}
          classes={{
            root: classNames(styles.textField, styles.input)
          }}
          inputProps={{
            type: 'number',
            placeholder: '0.00',
            startAdornment: <InputAdornment position="end">$</InputAdornment>
          }}
          value={_.get(courierPricing, type)}
          onChange={handleCourierPricingChange(type)}
        />
        {_.get(errors, type) ? (
          <Error className={styles.error} value={_.get(errors, type) } />
        ) : null}
      </div>
    )
  };

  return (
    <div className={notDefaultBilling ? styles.groupBlock : styles.groupBlockSettings}>
      {notDefaultBilling && <Typography className={styles.blockTitle}>Courier Pricing</Typography>}
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.pricingTwoColumns}>
          <div className={styles.tenMileRadius}>
            <Typography className={styles.blockSubtitle}>Courier payout inside 10 mile radius</Typography>
            <div className={styles.threeInput}>
              {Object.keys(courierPricingLabels).map((label) => {
                return label !== SETTINGS.COURIER_COST_FOR_ML_IN_DELIVERY 
                  ? renderPricingInput(label)
                  : null;
              })}
            </div>
          </div>
          <div className={styles.longDelivery}>
            <Typography className={styles.blockSubtitle}>10+ Mile Delivery</Typography>
            {renderPricingInput(SETTINGS.COURIER_COST_FOR_ML_IN_DELIVERY)}
          </div>
        </div>
      )}
    </div>
  );
};
