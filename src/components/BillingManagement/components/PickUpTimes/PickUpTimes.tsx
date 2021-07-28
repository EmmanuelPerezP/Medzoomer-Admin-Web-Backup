import React, { FC, useState } from 'react';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import Loading from '../../../common/Loading';
import styles from './PickUpTimes.module.sass';
import TextField from '../../../common/TextField';
import CheckBox from '../../../common/Checkbox';
import Select from '../../../common/Select';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { periodDays } from '../../../../constants';
import _ from 'lodash';

interface Props {
  notDefaultBilling?: boolean;
  isLoading: boolean;
}

interface IHoursRange {
  hour: string;
  minutes: string;
  period: string;
}

interface IPickUpRange {
  label: string;
  from: IHoursRange;
  to: IHoursRange;
  selected: boolean;
}

interface IPickUpOptions {
  firstRange: any;
  secondRange: any;
  customRange: any;
}

export const PickUpTimes: FC<Props> = (props) => {
  const { notDefaultBilling, isLoading } = props;
  const pickUpOptionsInitialValue: IPickUpOptions = {
    firstRange: {
      label: '10:00 am - 12:00 pm',
      from: { hour: '10', minutes: '00', period: 'AM' },
      to: { hour: '12', minutes: '00', period: 'AM' },
      selected: false
    },
    secondRange: {
      label: '01:00 pm - 3:00 pm',
      from: { hour: '1', minutes: '00', period: 'PM' },
      to: { hour: '2', minutes: '00', period: 'PM' },
      selected: false
    },
    customRange: {
      label: 'Custom Pick Up Time',
      from: { hour: '', minutes: '', period: '' },
      to: { hour: '', minutes: '', period: '' },
      selected: false
    }
  };
  const [pickUpOptions, setPickUpOptions] = useState(pickUpOptionsInitialValue);

  const handleChange = (param: string, key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    const options = { ...pickUpOptions.customRange };
    param = param.toLowerCase();

    if (key === 'hour' && (value.length > 2 || value > '12')) {
      return;
    } else if (key === 'minutes' && (value.length > 2 || value > '59')) {
      return;
    }

    options[param][key] = value;
    setPickUpOptions({
      ...pickUpOptions,
      customRange: { ...options }
    });
  };

  const handleCheckBoxChange = (key: string, value: IPickUpRange) => {
    console.log(key);
    console.log(value);
    setPickUpOptions({
      ...pickUpOptions,
      [key]: { ...value, selected: !value.selected }
    });
  };
  const renderDateInput = (order: string) => {
    const range = pickUpOptions.customRange[order.toLowerCase()];
    const isSelected = pickUpOptions.customRange.selected;
    console.log(range);

    return (
      <div className={styles.dateSelector}>
        <Typography className={styles.label}>{order}</Typography>
        <div className={styles.dateInput}>
          <TextField
            classes={{
              input: styles.leftInput,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{ type: 'number' }}
            disabled={!isSelected}
            value={range.hour}
            onChange={handleChange(order, 'hour')}
          />
          <TextField
            classes={{
              input: styles.leftInput,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{ type: 'number' }}
            disabled={!isSelected}
            value={range.minutes}
            onChange={handleChange(order, 'minutes')}
          />
          <Select
            classes={{
              input: styles.rightInput,
              selectLabel: styles.selectLabel,
              inputRoot: styles.inputRoot
            }}
            className={styles.periodSelect}
            disabled={!isSelected}
            value={range.period}
            items={periodDays}
            onChange={handleChange(order, 'period')}
            IconComponent={() => <ArrowDropDown />}
          />
        </div>
      </div>
    );
  };
  return (
    <div className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper}>
      <Typography className={styles.blockTitle}>Pick Up Times</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.pickUpTimesTwoColumns}>
          <div className={styles.pickUpOptions}>
            {Object.entries(pickUpOptions).map(([key, value]) => (
              <CheckBox
                className={styles.checkbox}
                label={value.label}
                // labelPlacement="start"
                name="schedule-type"
                checked={value.selected}
                onChange={() => handleCheckBoxChange(key, value)}
              />
            ))}
          </div>
          <div className={styles.customPickUp}>
            <Typography className={styles.blockSubtitle}>Custom Pick Up Time</Typography>
            {/* <div className={styles.threeInput}> */}
            <div className={styles.pickUpSelectors}>
              {renderDateInput('From')}
              {renderDateInput('To')}
            </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
};
