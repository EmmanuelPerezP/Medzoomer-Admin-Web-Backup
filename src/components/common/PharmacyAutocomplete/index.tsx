import React, { useCallback } from 'react';
import AutoCompleteField from './AutoCompleteField';
import usePharmacy from '../../../hooks/usePharmacy';

export default ({ onChange, ...other }: any) => {
  const { pharmacySearchField } = usePharmacy();
  const handleChange = useCallback(
    (value: any) => {
      onChange(value);
    },
    [onChange]
  );
  return (
    <AutoCompleteField
      placeHolder={'Pharmacy'}
      label={'Pharmacy'}
      isClearable
      field={'name'}
      searchFun={pharmacySearchField}
      onSelect={handleChange}
      {...other}
    />
  );
};
