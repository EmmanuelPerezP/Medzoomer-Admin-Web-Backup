import React, { FC } from 'react';
// import { createStyles, Theme, withStyles } from '@material-ui/core';
import MuiCheckbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

const icon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <rect width="21" height="21" x=".5" y=".5" fill="#FFF" fillRule="evenodd" stroke="#CFCFE1" rx="3" />
  </svg>
);

const checkedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <g fill="none" fillRule="evenodd">
      <rect width="22" height="22" fill="#006cf0" rx="3" />
      <path stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8l-6.875 6L6 11.273" />
    </g>
  </svg>
);

const CheckboxBase: FC<CheckboxProps & {
  label?: string;
  className?: string;
  labelClassName?: string;
  labelPlacement?: 'bottom' | 'top' | 'end' | 'start' | undefined;
  inputProps?: any;
  indeterminate?: boolean;
  secondLabel?: string;
  secondLabelClassName?: string;
}> = (props) => {
  const {
    label,
    className,
    labelPlacement = 'end',
    inputProps,
    indeterminate,
    labelClassName,
    secondLabel,
    secondLabelClassName
  } = props;
  return (
    <FormControlLabel
      className={className}
      control={
        <MuiCheckbox
          {...props}
          color="primary"
          icon={icon}
          checkedIcon={checkedIcon}
          indeterminateIcon={icon}
          inputProps={inputProps}
          indeterminate={indeterminate}
        />
      }
      label={
        <Typography className={labelClassName}>
          {label}
          {secondLabel && <span className={secondLabelClassName}>{secondLabel}</span>}
        </Typography>
      }
      labelPlacement={labelPlacement}
    />
  );
};

// const Checkbox = withStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       padding: 5,
//       width: '32px',
//       height: '32px'
//     }
//   })
// );

export default CheckboxBase;
