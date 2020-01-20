import React, { FC } from 'react';
import MuiCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { createStyles, Theme, withStyles } from '@material-ui/core';

const icon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <rect width="21" height="21" x=".5" y=".5" fill="#FFF" fill-rule="evenodd" stroke="#CFCFE1" rx="3" />
  </svg>
);

const checkedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <g fill="none" fill-rule="evenodd">
      <rect width="22" height="22" fill="#00ADC7" rx="3" />
      <path stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l-6.875 6L6 11.273" />
    </g>
  </svg>
);

const CheckboxBase: FC<CheckboxProps> = (props) => (
  <MuiCheckbox {...props} color="primary" icon={icon} checkedIcon={checkedIcon} indeterminateIcon={icon} />
);

const Checkbox = withStyles((theme: Theme) => createStyles({}))(CheckboxBase);

export default Checkbox;
