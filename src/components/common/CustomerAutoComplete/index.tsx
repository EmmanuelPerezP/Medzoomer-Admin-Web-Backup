import React, { useCallback } from 'react';
import AutoCompleteField from './AutoCompleteField';
import useConsumer from '../../../hooks/useConsumer';

export default ({ onChange, ...other }: any) => {
  const { consumerSearchField } = useConsumer();
  const handleChangeCourier = useCallback(
    (value: any) => {
      onChange(value);
    },
    [onChange]
  );
  return (
    <AutoCompleteField
      placeHolder={'Patient'}
      label={'Patient'}
      isClearable
      field={'fullName'}
      searchFun={consumerSearchField}
      onSelect={handleChangeCourier}
      {...other}
    />
  );
};
