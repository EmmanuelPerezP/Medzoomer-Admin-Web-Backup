import React, { FC } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import { InputBaseProps } from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import uuid from 'uuid/v4';
import SVGIcon from '../SVGIcon';
import Input from '../Input';

interface IStyles {
  classes: {
    root: string;
    input: string;
    inputRoot: string;
  };
}

export type AutoCompleteSearchProps = InputBaseProps & {
  id?: string;
  value?: string;
  placeholder: string;
};

const AutoCompleteSearchBase: FC<AutoCompleteSearchProps & IStyles> = (props) => {
  const { classes, id, inputProps, placeholder, onChange, value, onFocus, onBlur } = props;
  const inputId = id || `id-${uuid()}`;

  return (
    <FormControl className={classes.root}>
      <Input
        {...(inputProps as InputBaseProps)}
        id={inputId}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="end">
            <SVGIcon name={'search'} style={{ minWidth: '16px', height: '16px' }} />
          </InputAdornment>
        }
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        classes={{ root: classes.input, input: classes.inputRoot }}
      />
    </FormControl>
  );
};

const AutoCompleteSearch = withStyles((theme: Theme) =>
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
    inputRoot: {
      width: '100%'
    }
  })
)(AutoCompleteSearchBase);

export default AutoCompleteSearch;
