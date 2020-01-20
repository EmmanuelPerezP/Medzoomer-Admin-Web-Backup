import React, { FC } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles/index';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '../Input';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { colors, fontSizes } from '../../../theme';
import uuid from 'uuid/v4';

interface IStyles {
  classes: {
    root: string;
    input: string;
    inputLabel: string;
  };
}

export type TextFieldProps = InputBaseProps & {
  id?: string;
  label?: string;
};

const TextFieldBase: FC<TextFieldProps & IStyles> = (props) => {
  const { classes, id, label, inputProps } = props;
  const inputId = id || `id-${uuid()}`;
  return (
    <FormControl className={classes.root}>
      <InputLabel shrink htmlFor={inputId} classes={{ formControl: classes.inputLabel }}>
        {label}
      </InputLabel>
      <Input {...(inputProps as InputBaseProps)} id={inputId} classes={{ root: classes.input }} />
    </FormControl>
  );
};

const TextField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      width: '100%'
    },
    input: {
      'label + &': {
        marginTop: '0 !important'
      }
    },
    inputLabel: {
      position: 'relative',
      transform: 'none',
      color: colors.label,
      '&.Mui-focused': {
        color: colors.label
      },
      fontSize: fontSizes.table,
      fontWeight: theme.typography.fontWeightMedium,
      marginBottom: 9
    }
  })
)(TextFieldBase);

export default TextField;
