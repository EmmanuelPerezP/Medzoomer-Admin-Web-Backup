import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import usePharmacy from '../../../../hooks/usePharmacy';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import { useStores } from '../../../../store';
import Select from '../../../common/Select';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import styles from './PharmacyInputs.module.sass';

const SelectBillingAccounts = () => {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const { getSettingListGP } = useSettingsGP();
  const [listSettings, setListSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSettingList().catch();
    // eslint-disable-next-line
  }, []);

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: string | number }>) => {
    const { value } = e.target;
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: value });
  };

  const getSettingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSettingListGP({
        page: 0,
        perPage: 1000
      });
      const listForSelect = [];

      if (data.data) {
        // tslint:disable-next-line:forin
        for (const i in data.data) {
          listForSelect.push({ value: data.data[i]._id, label: data.data[i].name });
        }
      }
      // @ts-ignore
      setListSettings(listForSelect);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getSettingListGP, setListSettings]);

  return (
    <>
      {isLoading && <Loading />}

      {!isLoading && (
        <div className={styles.managerBlock}>
          <Typography className={styles.blockTitle}>General</Typography>
          {listSettings.length > 0 && (
            <Select
              label="Billing Account"
              value={newPharmacy.settingsGP || ''}
              onChange={handleChange('settingsGP')}
              items={listSettings}
              IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SelectBillingAccounts;
