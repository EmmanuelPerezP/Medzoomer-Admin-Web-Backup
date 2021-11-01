import React, { FC, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '../../../common/TextField';
import useSystemSettings from '../../../../hooks/useSystemSettings';
import { SETTINGS } from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';
import styles from './TrainingVideo.module.sass';
import _ from 'lodash';

export const TrainingVideo: FC = () => {
  const { getSetting, updateListSettings } = useSystemSettings();
  const emptyLinkTemplate = {
    [SETTINGS.TRAINING_VIDEO_LINK]: ''
  };
  const [settings, setSettings] = useState(emptyLinkTemplate);
  const [err, setErr] = useState(emptyLinkTemplate);
  const [isLoading, setLoading] = useState(false);

  const isValid = () => {
    let isError = true;
    const link = _.get(settings, SETTINGS.TRAINING_VIDEO_LINK);
    if (!link) {
      isError = false;
      setErr({
        [SETTINGS.TRAINING_VIDEO_LINK]: 'Link is not allowed to be empty'
      });
    }
    return isError;
  };

  const handleUpdateSettings = useCallback(async () => {
    if (isValid()) {
      try {
        setLoading(true);
        await updateListSettings(settings);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }
    return;
  }, [settings]); // eslint-disable-line

  useEffect(() => {
    setLoading(true);
    getSetting([SETTINGS.TRAINING_VIDEO_LINK])
      .then((d: { data: any }) => {
        if (d && d.data) {
          setSettings(d.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []); // eslint-disable-line

  const handleChangeField = useCallback(
    () => (e: any) => {
      setSettings({
        [SETTINGS.TRAINING_VIDEO_LINK]: e.target.value
      });
      setErr({ [SETTINGS.TRAINING_VIDEO_LINK]: '' });
    },
    [settings, err]
  );

  return (
    <div className={styles.systemsWrapper}>
      <div className={styles.navigation}>
        <Typography className={styles.title}>Training Video Link</Typography>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.settingBlock}>
            <div className={styles.inputBlock}>
              <TextField
                label={'Link'}
                className={styles.field}
                inputProps={{
                  placeholder: 'Link'
                }}
                value={_.get(settings, SETTINGS.TRAINING_VIDEO_LINK)}
                onChange={handleChangeField()}
              />
              {err.training_video_link ? <Error className={styles.error} value={err.training_video_link} /> : null}
            </div>
          </div>
          <div className={styles.center}>
            <Button variant="contained" color="secondary" disabled={!!isLoading} onClick={handleUpdateSettings}>
              <Typography>Update</Typography>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
