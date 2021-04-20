import React, { FC, useEffect, useState } from 'react';
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
import { Button, FormGroup, Grid, GridSize } from '@material-ui/core';
import moment from 'moment';
import { consoleTestResultsHandler } from 'tslint/lib/test';

const defItems = [
  {
    label: 'On',
    value: 'on'
  },
  {
    label: 'Off',
    value: 'off'
  }
]

interface IStyles {
  classes: {
    root: string;
    selectLabel: string;
    btnContainer: string;
    btnBox: string;
    btnActive: string;
  };
}

export type SelectFieldProps = SelectProps &
  InputBaseProps & {
    label?: string;
    value?: any;
    items?: any;
    onChange?: any;
  };

const SelectFieldBase: FC<SelectFieldProps & IStyles> = (props) => {
  const { classes, label, items = defItems } = props;
  const [selected, setSelected] = useState('on');
  const [size, setSize] = useState<GridSize>();

  useEffect(() => {
    const s: GridSize = Math.floor(12 / items.length) as any; 
    setSize(s);
  }, [size])

  const handleSelect = (e?: any) => {
    setSelected(e);
  }

  return (
    <FormControl className={classes.root}>
      {label && (
        <InputLabel shrink classes={{ formControl: classes.selectLabel }}>
          {label}
        </InputLabel>
      )}
      <FormGroup className={classes.btnContainer}>
        <Grid container>
          {items.map((item: any) => 
            <Grid item xs={size} className={classes.btnBox}>
              <Button 
                name={item.value}
                fullWidth 
                onClick={(i) => handleSelect(i.currentTarget.name)}
                className={item.value === selected ? classes.btnActive : ''}
              >
                {item.label}
              </Button>
            </Grid>
          )}
        </Grid>
      </FormGroup>
    </FormControl>
  );
};

const SelectButton = withStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1),
      width: '100%'
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
    btnContainer: {
      border: `1px solid ${colors.border}`,
      borderRadius: 3
    },
    btnBox: {
      padding: 5,
      borderRight: `1px solid ${colors.border}`,
      '&:last-child': {
        border: 'none'
      },
      '& button': {
        color: colors.label,
        fontSize: '1rem',
        height: 42,
      }
    },
    btnActive: {
      backgroundColor: theme.palette.primary.main,
      color: `${colors.white} !important`,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      }
    }
  })
)(SelectFieldBase);

export default SelectButton;
