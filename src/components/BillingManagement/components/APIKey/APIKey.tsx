import { InputAdornment, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import styles from './APIKey.module.sass';
import TextField from '../../../common/TextField';
import CustomSwitch from '../../../common/CustomSwitch';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';
import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { IAPIKeys } from '../../../../interfaces';
interface Props {
  isLoading: boolean;
  keys: IAPIKeys;
  handleGenerateKeys: Function;
}

export const APIKey: FC<Props> = (props) => {
  const { isLoading, keys, handleGenerateKeys } = props;
  const [key, setKey] = useState('');
  const [copyToClipboardText, setCopyToClipboardText] = useState('Copy To Clipboard');
  const [showKey, setShowKey] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const handleClick = async () => {
    setIsGeneratingKey(true);
    await handleGenerateKeys().catch();
    setIsGeneratingKey(false);
  };

  useEffect(() => {
    if (keys.publicKey && keys.secretKey) {
      setKey(Buffer.from(`${keys.publicKey}:${keys.secretKey}`).toString('base64'));
    }
  }, [keys]);

  return (
    <div className={styles.groupBlock}>
      <div className={styles.groupHeader}>
        <div>
          <Typography className={styles.blockTitle}>API Key</Typography>
        </div>
        <div className={styles.switch}>
          <CustomSwitch
            checked={showKey}
            onChange={() => setShowKey(!showKey)}
            name="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
                disabled={isGeneratingKey}
                inputProps={{
                  startAdornment: (
                    <div className={styles.tooltip}>
                      <InputAdornment
                        className={styles.copyKey}
                        position="start"
                        onClick={() => {
                          navigator.clipboard.writeText(key);
                          setCopyToClipboardText('Copied!');
                        }}
                      >
                        <Tooltip title={copyToClipboardText} placement="top" arrow>
                          <div>
                            <SVGIcon name={'clipboard'} />
                          </div>
                        </Tooltip>
                      </InputAdornment>
                    </div>
                  )
                }}
              />
              {!isGeneratingKey ? (
                <Button
                  className={styles.generateKeyButton}
                  variant="contained"
                  color="secondary"
                  onClick={handleClick}
                >
                  <Typography className={styles.generateKeyButtonText}>
                    Generate
                  </Typography>
                </Button>
              ) : (
                <Loading className={styles.generatingKey} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
