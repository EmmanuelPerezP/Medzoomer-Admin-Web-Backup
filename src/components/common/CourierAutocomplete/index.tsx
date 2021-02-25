import React, { useCallback } from 'react';
import AutoCompleteField from './AutoCompleteField';
import useCourier from '../../../hooks/useCourier';

export default ({ onChange, ...other }: any) => {
  const { courierSearchField } = useCourier();
  const handleChangeCourier = useCallback(
    (value: any) => {
      onChange(value);
    },
    [onChange]
  );
  return (
    <AutoCompleteField
      placeHolder={'Courier'}
      label={'Courier'}
      isClearable
      field={'fullName'}
      searchFun={courierSearchField}
      onSelect={handleChangeCourier}
      {...other}
    />
  );
};
