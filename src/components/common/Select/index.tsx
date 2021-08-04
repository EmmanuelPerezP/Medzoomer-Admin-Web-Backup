import React, { FC } from 'react';
import uuid from 'uuid/v4';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select, { SelectProps } from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBaseProps } from '@material-ui/core/InputBase';
import { colors, fontSizes } from '../../../theme';
import { SelectItem } from '../../../types';
import Input from '../Input';

interface IStyles {
  classes: {
    root: string;
    input: string;
    selectLabel: string;
    selectMenu: string;
    inputRoot: string;
  };
}

export type SelectFieldProps = SelectProps &
  InputBaseProps & {
    id?: string;
    label?: string;
    value: any;
    items: SelectItem;
    onChange: any;
    disabled?: boolean
  };

const SelectFieldBase: FC<SelectFieldProps & IStyles> = (props) => {
  const {
    classes,
    id,
    label,
    value,
    className,
    IconComponent,
    MenuProps,
    onChange,
    inputProps,
    items,
    multiple = false,
    style,
    disabled = false
  } = props;
  const selectId = id || `id-${uuid()}`;

  const getValueTitle = (selected: any) => {
    if (multiple) {
      return selected
        .map((s: string) => {
          const selectedOne = items.find((item) => item.value === s);
          return selectedOne ? selectedOne.label : '';
        })
        .join(', ');
    } else {
      const selectedOne = items.find((item) => item.value === selected);
      return selectedOne ? selectedOne.label : '';
    }
  };

  return (
    <FormControl className={classes.root}>
      {label && (
        <InputLabel shrink htmlFor={selectId} classes={{ formControl: classes.selectLabel }}>
          {label}
        </InputLabel>
      )}
      <Select
        disabled={disabled}
        style={style}
        id={selectId}
        classes={{ selectMenu: classes.selectMenu }}
        className={className}
        onChange={onChange}
        IconComponent={IconComponent}
        {...(MenuProps as SelectProps)}
        value={value}
        // @ts-ignore
        renderValue={(selected: any) => getValueTitle(selected)}
        input={
          <Input {...(inputProps as InputBaseProps)} classes={{ root: classes.input, input: classes.inputRoot }} />
        }
        multiple={multiple}
      >
        {items &&
          items.map((item) => {
            return (
              <MenuItem key={item.value} value={item.value}>
                {multiple && <Checkbox checked={value && value.includes(item.value)} />}
                <ListItemText primary={item.label} />
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};

const SelectField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      width: '100%'
    },
    selectMenu: {
      background: 'none'
    },
    input: {
      'label + &': {
        marginTop: '0 !important'
      },
      '&.Mui-focused': {
        outline: `2px solid ${theme.palette.secondary.main}`
      },
      paddingRight: 20
    },
    selectLabel: {
      position: 'relative',
      transform: 'none',
      color: colors.label,
      '&.Mui-focused': {
        color: colors.label
      },
      fontSize: fontSizes.table,
      fontWeight: theme.typography.fontWeightMedium,
      marginBottom: 9
    },
    inputRoot: {
      width: '100%',
      paddingLeft: 10
    }
  })
)(SelectFieldBase);

export default SelectField;
