import React, { useCallback, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';

const customStyles = {
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    width: '100%'
  }),
  container: (provided: any) => ({
    ...provided,
    width: '100%'
  })
};

interface IProps {
  items?: any[];
  value?: any;
  styles?: object;
  placeHolder?: string;
  SingleValue?: any;
  Option?: any;
  DropdownIndicator?: any;
  onChange?: any;
  onFocus?: any;
  onGetData?: any;
  className?: any;
  onInputChange?: any;
  defaultValue?: any;
  isClearable?: boolean;
  key?: string;
}

export default (props: IProps) => {
  const asyncRef: any = useRef();

  const {
    value = null,
    styles,
    Option,
    placeHolder,
    SingleValue,
    DropdownIndicator,
    items,
    onChange,
    defaultValue,
    onGetData,
    onInputChange,
    isClearable,
    key
  } = props;
  const [controlShouldRenderValue, setControlShouldRenderValue] = useState(true);

  const handleFocus = useCallback(() => {
    setControlShouldRenderValue(false);
  }, [setControlShouldRenderValue]);

  const handleBlur = useCallback(() => {
    setControlShouldRenderValue(true);
  }, [setControlShouldRenderValue]);

  const handleChange = useCallback(
    (d) => {
      onChange(d);
      asyncRef && asyncRef.current && asyncRef.current.blur && asyncRef.current.blur();
    },
    [asyncRef, onChange]
  );

  const components: any = {};
  if (Option) {
    components.Option = Option;
  }
  if (DropdownIndicator) {
    components.DropdownIndicator = DropdownIndicator;
  }
  if (SingleValue) {
    components.SingleValue = SingleValue;
  }
  return (
    <AsyncSelect
      ref={asyncRef}
      components={components}
      styles={{ ...customStyles, ...styles }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      cacheOptions
      controlShouldRenderValue={controlShouldRenderValue}
      placeholder={placeHolder}
      loadOptions={onGetData}
      defaultOptions
      onInputChange={onInputChange}
      value={value}
      defaultValue={defaultValue}
      isClearable={isClearable}
      onChange={handleChange}
      options={items}
      key={key}
    />
  );
};
