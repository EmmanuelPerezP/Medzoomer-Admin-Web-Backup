import React, { FC, ChangeEvent } from 'react';
import MuiCheckbox from '@material-ui/core/Checkbox';
import { ICheckboxProps } from './types';
import { icon, disabledIcon, checkedIcon, alternateCheckedIcon } from './svgs';

export const Checkbox: FC<ICheckboxProps> = ({
  value,
  onChange,
  showAlternativeCheckedIcon = false,
  disabled = false
}) => {
  const handleOnChange = (_: ChangeEvent<HTMLInputElement>, newValue: boolean) => {
    onChange(newValue);
  };

  return (
    <MuiCheckbox
      style={{
        padding: 0,
        width: '22px',
        height: '22px'
      }}
      checked={value}
      disabled={disabled}
      onChange={handleOnChange}
      color="primary"
      icon={disabled ? disabledIcon : icon}
      checkedIcon={showAlternativeCheckedIcon ? alternateCheckedIcon : checkedIcon}
      indeterminateIcon={icon}
    />
  );
};
