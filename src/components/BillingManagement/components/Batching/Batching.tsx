import React, { FC } from "react";
import { InputAdornment, Typography } from "@material-ui/core";
import styles from "./Batching.module.sass";
import classNames from "classnames";
import SelectButton from "../../../common/SelectButton";
import TextField from "../../../common/TextField";
import Loading from "../../../common/Loading";
import { SettingsGP } from "../../../../interfaces";

interface Props {
  settingGroup: SettingsGP;
  notDefaultBilling: any;
  isLoading: boolean;
  handleChange: Function;
}

export const Batching: FC<Props> = props => {
  const { notDefaultBilling, isLoading, settingGroup, handleChange } = props;
  return (
    <div
      className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper}
    >
      <Typography className={styles.blockTitle}>Batching</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.threeInput}>
          <div className={styles.toggle}>
            <SelectButton
              label="Manual Batch Deliveries"
              value={settingGroup.isManualBatchDeliveries}
              onChange={handleChange("isManualBatchDeliveries")}
            />
          </div>
          <div className={styles.textField}>
            <TextField
              label={"Auto-Dispatch Timeframe"}
              classes={{
                root: classNames(styles.input)
              }}
              inputProps={{
                type: "number",
                placeholder: "0.00",
                startAdornment: (
                  <InputAdornment position="start">min</InputAdornment>
                )
              }}
              value={settingGroup.autoDispatchTimeframe}
              onChange={handleChange("autoDispatchTimeframe")}
            />
          </div>
          <div className={styles.textField}>
            <TextField
              label={"Max Delivery Leg Distance"}
              classes={{
                root: classNames(styles.input)
              }}
              inputProps={{
                type: "number",
                placeholder: "0.00",
                startAdornment: (
                  <InputAdornment position="start">miles</InputAdornment>
                )
              }}
              value={settingGroup.maxDeliveryLegDistance}
              onChange={handleChange("maxDeliveryLegDistance")}
            />
          </div>
        </div>
      )}
    </div>
  );
};
