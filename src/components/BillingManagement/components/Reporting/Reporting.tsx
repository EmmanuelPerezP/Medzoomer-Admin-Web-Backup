import React, { FC } from "react";
import { SettingsGP } from "../../../../interfaces";
import { Typography } from "@material-ui/core";
import { typeOfSignatureLog } from "../../../../constants";
import styles from "./Reporting.module.sass";
import Loading from "../../../common/Loading";
import Select from "../../../common/Select";
import SVGIcon from "../../../common/SVGIcon";

interface Props {
  isLoading: boolean;
  handleSignatureLogChange: Function;
  newSettingGP: SettingsGP;
  notDefaultBilling?: boolean;
}

export const Reporting: FC<Props> = props => {
  const {
    isLoading,
    handleSignatureLogChange,
    newSettingGP,
    notDefaultBilling
  } = props;

  return (
    <div
      className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper}
    >
      <Typography className={styles.blockTitle}>Reporting</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.textField}>
          <Select
            label="Type of Signature Log"
            value={newSettingGP.reporting}
            onChange={handleSignatureLogChange("reporting")}
            items={typeOfSignatureLog}
            IconComponent={() => <SVGIcon name={"downArrow"} />}
          />
        </div>
      )}
    </div>
  );
};
