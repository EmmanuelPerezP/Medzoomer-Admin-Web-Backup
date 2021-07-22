import React, { FC, Fragment } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    height: 52
  },
  wrapperFlexColumn: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#4688F1',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""'
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3'
    }
  }
});

function StyledRadio(props: JSX.IntrinsicAttributes & RadioProps) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export type Items = Array<{
  value: number | string | boolean;
  label: number | string;
}>;

interface IRadioGroupCustom {
  items: Items;
  value: any;
  onChange: any;
  flexWrapper?: string;
}

const yesNoRadioItemsArr = [
  {
    label: 'Yes',
    value: 'Yes'
  },
  {
    label: 'No',
    value: 'No'
  }
];

const RadioGroupCustom: FC<IRadioGroupCustom> = ({ items, value, onChange, flexWrapper = 'row' }) => {
  const classes = useStyles();
  const elements = items.length > 0 ? items : yesNoRadioItemsArr;
  return (
    <FormControl component="fieldset">
      <RadioGroup
        value={value}
        aria-label="radioGroupCustom"
        name="customized-radios"
        className={clsx(flexWrapper === 'column' ? classes.wrapperFlexColumn : classes.wrapper)}
        onChange={onChange}
      >
        {elements.map((item: any) => (
          <Fragment key={item.value}>
            <FormControlLabel value={item.value} control={<StyledRadio />} label={item.label} />
          </Fragment>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupCustom;
