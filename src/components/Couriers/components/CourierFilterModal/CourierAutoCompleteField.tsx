import React, { useCallback } from 'react';
import _ from 'lodash';
import AutoComplete from '../../../common/AutoComplete';
import useCourier from '../../../../hooks/useCourier';

interface IProps {
  field: string;
  placeHolder: string;
  onSelect?: any;
  label?: string;
  value?: string;
  labelClassName?: any;
  className?: any;
  defaultValue?: any;
  isClearable?: boolean;
}

export default ({
  placeHolder,
  className,
  labelClassName,
  label,
  field,
  onSelect,
  isClearable = false,
  value
}: IProps) => {
  const { courierSearchField, courierStore } = useCourier();
  const filters = courierStore.get('filters');
  const { status } = filters;

  const handleChange = useCallback(
    (v: any) => {
      if (typeof onSelect === 'function') {
        if (v === null) {
          onSelect(undefined);
        } else if (v && v.value) {
          onSelect(v.value);
        }
      }
    },
    [onSelect]
  );

  const handleGetData = useCallback(
    (search, cb) => {
      courierSearchField(field, search, 1000, status.join('_'))
        .then((payload) => {
          cb(_.get(payload, 'data', []));
        })
        .catch(console.error);
    },
    [courierSearchField, field, status]
  );

  return (
    <div className={className}>
      <div className={labelClassName}>{label}</div>
      <AutoComplete
        placeHolder={placeHolder}
        onChange={handleChange}
        onGetData={handleGetData}
        value={{
          value,
          label: value
        }}
        isClearable={isClearable}
        key={status.join('_')}
      />
    </div>
  );
};
