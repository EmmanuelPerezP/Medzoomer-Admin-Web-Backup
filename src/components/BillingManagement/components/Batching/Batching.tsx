import { InputAdornment, Typography } from "@material-ui/core";
import classNames from "classnames";
import React, { FC } from "react";
import SelectButton from "../../../common/SelectButton";
import styles from "./Batching.module.sass";
import TextField from "../../../common/TextField";
import Loading from "../../../common/Loading";

interface Props {
  notDefaultBilling: any;
  isLoading: boolean;
}
const handleChange = () => {};
export const Batching: FC<Props> = props => {
  const { notDefaultBilling, isLoading } = props;
  return (
    <div className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper}>
      <Typography className={styles.blockTitle}>Batching</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.threeInput}>
          <div className={styles.toggle}>
            <SelectButton
              label="Manual Batch Deliveries"
              value={"Yes"}
              onChange={handleChange}
            />
          </div>
          <div className={styles.textField}>
            <TextField
              label={"Auto-Dispatch Timeframe "}
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
              value={10}
              onChange={handleChange}
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
              value={10}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
