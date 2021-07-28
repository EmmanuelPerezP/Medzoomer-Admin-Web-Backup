import { InputAdornment, Typography, withStyles } from "@material-ui/core";
import React, { FC, useState } from "react";
import styles from "./APIKey.module.sass";
import TextField from "../../../common/TextField";
import CustomSwitch from "../../../common/CustomSwitch";
import Loading from "../../../common/Loading";
import SVGIcon from "../../../common/SVGIcon";
import { Tooltip } from "@material-ui/core";
import Button from "@material-ui/core/Button";
interface Props {
  notDefaultBilling: any;
  isLoading: boolean;
  key?: string;
}

export const APIKey: FC<Props> = props => {
  const { notDefaultBilling, isLoading } = props;
  const key = "JKAHSlkjdsfkajhsdlkajh1233";
  const [copyToClipboardText, setCopyToClipboardText] = useState(
    "Copy To Clipboard"
  );
  const [showKey, setShowKey] = React.useState(false);
  const handleGenerateKey = () => {};

  const handleSwitch = () => {
    setShowKey(!showKey);
  };

  return (
    <div className={styles.groupBlock}>
      <div className={styles.groupHeader}>
        <div>
          <Typography className={styles.blockTitle}>API Key</Typography>
        </div>
        <div className={styles.switch}>
          <CustomSwitch
            checked={showKey}
            onChange={handleSwitch}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {showKey && (
            <div className={styles.apiKeyGroup}>
              <TextField
                className={styles.apiKeyInput}
                value={key}
                inputProps={{
                  startAdornment: (
                    <div className={styles.tooltip}>
                      <InputAdornment
                        className={styles.copyKey}
                        position="start"
                        onClick={() => {
                          navigator.clipboard.writeText(key);
                          setCopyToClipboardText("Copied!");
                        }}
                      >
                        <Tooltip
                          title={copyToClipboardText}
                          placement="top"
                          arrow
                        >
                          <div>
                            <SVGIcon name={"clipboard"} />
                          </div>
                        </Tooltip>
                      </InputAdornment>
                    </div>
                  )
                }}
              />
              <Button
                className={styles.generateKeyButton}
                variant="contained"
                color="secondary"
                onClick={handleGenerateKey}
              >
                <Typography className={styles.generateKeyButtonText}>
                  Generate
                </Typography>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
