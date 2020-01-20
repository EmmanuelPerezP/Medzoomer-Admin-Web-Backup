import React, { FC } from 'react';
import MuiRadio, { RadioProps } from '@material-ui/core/Radio';
import { createStyles, Theme, withStyles } from '@material-ui/core';

const icon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <circle cx="11" cy="11" r="10.5" fill="#FFF" fill-rule="evenodd" stroke="#CFCFE1" />
  </svg>
);

const checkedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <g fill="none" fill-rule="evenodd">
      <circle cx="11" cy="11" r="11" fill="#00ADC7" />
      <circle cx="11" cy="11" r="5" fill="#FFF" />
    </g>
  </svg>
);

const RadioBase: FC<RadioProps> = (props) => (
  <MuiRadio {...props} color="primary" icon={icon} checkedIcon={checkedIcon} />
);

const Radio = withStyles((theme: Theme) => createStyles({}))(RadioBase);

export default Radio;
