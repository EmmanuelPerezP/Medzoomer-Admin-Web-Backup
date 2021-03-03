import React, { useCallback } from 'react';
import _ from 'lodash';
import AutoComplete from '../AutoComplete';

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
  searchFun: any;
}

export default ({
  placeHolder,
  className,
  labelClassName,
  label,
  field,
  onSelect,
  isClearable = false,
  value,
  searchFun
}: IProps) => {
  const handleChange = useCallback(
    (v: any) => {
      if (typeof onSelect === 'function') {
        if (v === null) {
          onSelect(undefined);
        } else if (v) {
          onSelect(v);
        }
      }
    },
    [onSelect]
  );

  const handleGetData = useCallback(
    (search, cb) => {
      searchFun(field, search, 100)
        .then((payload: any) => {
          cb(_.get(payload, 'data', []));
        })
        .catch(console.error);
    },
    [searchFun, field]
  );

  return (
    <div className={className}>
      <div className={labelClassName}>{label}</div>
      <AutoComplete
        placeHolder={placeHolder}
        onChange={handleChange}
        onGetData={handleGetData}
        value={value}
        isClearable={isClearable}
      />
    </div>
  );
};
