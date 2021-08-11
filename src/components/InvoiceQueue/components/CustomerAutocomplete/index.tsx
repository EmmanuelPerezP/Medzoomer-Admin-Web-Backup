import React, { useCallback } from 'react';
import AutoCompleteField from './AutoCompleteField';
import useSettingsGP from '../../../../hooks/useSettingsGP';

export default ({ onChange, ...other }: any) => {
  const { getBillingAccount } = useSettingsGP();

  const handleChangeCourier = useCallback(
    (res: any) => {
      onChange(res);
    },
    [onChange]
  );

  const handleGetList = useCallback(
    async (value: string) => {
      const data: any = await getBillingAccount(value);
      const result = [];
      if (data) {
        // tslint:disable-next-line:forin
        for (const i in data.data) {
          result.push({
            label: data.data[i].fullName,
            value: data.data[i].settingsGP
          });
        }
      }
      return {
        data: result
      };
    },
    [getBillingAccount]
  );

  return (
    <AutoCompleteField
      placeHolder={'Billing Account'}
      label={'Billing Account'}
      isClearable
      field={'fullName'}
      searchFun={handleGetList}
      onSelect={handleChangeCourier}
      {...other}
    />
  );
};
