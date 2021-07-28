import React, { FC } from "react";
import { InputAdornment, Typography } from "@material-ui/core";
import classNames from "classnames";
import Loading from "../../../common/Loading";
import styles from "./CourierPricing.module.sass";
import TextField from "../../../common/TextField";

interface Props {
  notDefaultBilling: any;
  isLoading: boolean;
}

export const CourierPricing: FC<Props> = props => {
  const { notDefaultBilling, isLoading } = props;
  const handleChange = () => {
    console.log("cambiando...");
  };
  return (
    <div
      className={
        notDefaultBilling ? styles.groupBlock : styles.groupBlockSettings
      }
    >
      {notDefaultBilling && (
        <Typography className={styles.blockTitle}>Courier Pricing</Typography>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.pricingTwoColumns}>
          <div className={styles.tenMileRadius}>
            <Typography className={styles.blockSubtitle}>
              Courier payout inside 10 mile radius
            </Typography>
            <div className={styles.threeInput}>
              <div className={styles.textField}>
                <TextField
                  label={"1 Order in Delivery"}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  inputProps={{
                    type: "number",
                    placeholder: "0.00",
                    startAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    )
                  }}
                  value={10}
                  onChange={handleChange}
                />
                {/* {err.courier_cost_for_one_order ? (
                  <Error className={styles.error} value={err.courier_cost_for_one_order} />
                ) : null} */}
              </div>
              <div className={styles.textField}>
                <TextField
                  label={"2 Orders in Delivery"}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  inputProps={{
                    type: "number",
                    placeholder: "0.00",
                    startAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    )
                  }}
                  value={20}
                  onChange={handleChange}
                />
                {/* {err.courier_cost_for_two_order ? (
                  <Error className={styles.error} value={err.courier_cost_for_two_order} />
                ) : null} */}
              </div>
              <div className={styles.textField}>
                <TextField
                  label={"3 or More Orders in Delivery"}
                  classes={{
                    root: classNames(styles.textField, styles.input)
                  }}
                  inputProps={{
                    type: "number",
                    placeholder: "0.00",
                    startAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    )
                  }}
                  value={30}
                  onChange={handleChange}
                />
                {/* {err.courier_cost_for_more_two_order ? (
                  <Error className={styles.error} value={err.courier_cost_for_more_two_order} />
                ) : null} */}
              </div>
            </div>
          </div>
          <div className={styles.longDelivery}>
            <Typography className={styles.blockSubtitle}>
              10+ Mile Delivery
            </Typography>
            <div className={styles.threeInput}>
              <div className={styles.textField}>
                <TextField
                  label={"1 Order in Delivery"}
                  classes={{
                    root: classNames(styles.textField, styles.afterTextInput)
                  }}
                  inputProps={{
                    type: "number",
                    placeholder: "0.00",
                    startAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    )
                  }}
                  value={40}
                  onChange={handleChange}
                />
                {/* {err.courier_cost_for_ml_in_delivery ? (
                  <Error className={styles.error} value={err.courier_cost_for_ml_in_delivery} />
                ) : null} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
