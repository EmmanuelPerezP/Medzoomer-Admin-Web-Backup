import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MapOnFleet from '../../../common/MapOnFleet';
import useSystemSettings from '../../../../hooks/useSystemSettings';
import { SETTINGS } from '../../../../constants';
import Error from '../../../common/Error';
import Loading from '../../../common/Loading';

import styles from './MapSettings.module.sass';

export const MapSettings: FC = () => {
  const { getSetting, updateSetting } = useSystemSettings();
  const [geoJson, setGeoJson] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [err] = useState({
    delivery: '',
    tips: '',
    training_video_link: ''
  });

  useEffect(() => {
    setLoading(true);
    getSetting([SETTINGS.GROUP_MAP])
      .then((d) => {
        if (d && d.data && d.data.map) {
          setGeoJson(d.data.map);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []); // eslint-disable-line

  return (
    <div className={styles.systemsWrapper}>
      <div className={styles.navigation}>
        <Typography className={styles.title}>OnFleet Teams Map Settings</Typography>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.settingBlock}>
          <Typography className={styles.blockTitle}>JSON for map</Typography>
          <div className={styles.inputBlock}>
            <div className={styles.blockJSON}>
              <textarea
                className={styles.procentField}
                value={geoJson}
                onChange={(e) => {
                  setGeoJson(e.target.value ? e.target.value : '');
                }}
              />
              {err.delivery ? <Error className={styles.error} value={err.delivery} /> : null}
            </div>
            <div className={styles.blockMap}>
              <MapOnFleet geoJson={geoJson} style={{ position: 'relative', width: '100%', height: 450 }} />
            </div>
          </div>
          <div className={styles.navigation}>
            {/* tslint:disable-next-line:no-empty */}
            <Button
              variant="contained"
              color="secondary"
              disabled={!!isLoading}
              onClick={() => {
                updateSetting(SETTINGS.GROUP_MAP, geoJson).catch(console.error);
              }}
            >
              <Typography>Update Settings</Typography>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
