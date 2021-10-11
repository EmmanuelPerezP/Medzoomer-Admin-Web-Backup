import React, { FC, useEffect, useState } from 'react';
import styles from './PickUpTimes.module.sass';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import Loading from '../../../common/Loading';
import TextField from '../../../common/TextField';
import CheckBox from '../../../common/Checkbox';
import Select from '../../../common/Select';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { periodDays } from '../../../../constants';
import { SettingsGP, IPickUpOptions, IPickUpRange, IHoursRange } from '../../../../interfaces';
import { Error } from '../../../common/Error/Error';
import _ from 'lodash';
interface Props {
  sectionRef: any;
  settingGroup: SettingsGP;
  errors: any;
  handleChange: Function;
  notDefaultBilling?: boolean;
  isLoading: boolean;
}

export const PickUpTimes: FC<Props> = (props) => {
  const { sectionRef, notDefaultBilling, isLoading, settingGroup, handleChange, errors } = props;
  const initialPickUpOptions: IPickUpOptions = {
    firstRange: {
      label: '10:00 am - 12:00 pm',
      from: { hour: '10', minutes: '00', period: 'AM' },
      to: { hour: '12', minutes: '00', period: 'PM' },
      selected: false
    },
    secondRange: {
      label: '01:00 pm - 3:00 pm',
      from: { hour: '1', minutes: '00', period: 'PM' },
      to: { hour: '3', minutes: '00', period: 'PM' },
      selected: false
    },
    customRange: {
      label: 'Custom Pick Up Time',
      from: { hour: '', minutes: '', period: '' },
      to: { hour: '', minutes: '', period: '' },
      selected: false
    }
  };
  const [pickUpOptions, setPickUpOptions] = useState(initialPickUpOptions);

  const handleCustomRangeChange = (param: string, key: string) => (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    const options = { ...pickUpOptions };
    param = param.toLowerCase();

    if (key === 'hour' && (value.length > 2 || Number(value) > 12)) {
      return;
    } else if (key === 'minutes' && (value.length > 2 || Number(value) > 59)) {
      return;
    }
    _.set(options, `customRange.[${param}][${key}]`, value);
    setPickUpOptions(options);

    handleChange(options);
  };

  const handleCheckBoxChange = (key: string, value: IPickUpRange) => {
    const options = { ...pickUpOptions };
    _.set(options, `[${key}].selected`, !value.selected);
    setPickUpOptions(options);

    handleChange(options);
  };

  const fillCustomPickUpTime = (from: IHoursRange, to: IHoursRange) => {
    _.set(pickUpOptions, `customRange.from`, from);
    _.set(pickUpOptions, `customRange.to`, to);
  };

  useEffect(() => {
    if (settingGroup.pickUpTimes) {
      const pickUpTimes = Object.keys(settingGroup.pickUpTimes);

      if (pickUpTimes.length > 0) {
        pickUpTimes.forEach((key) => {
          // Sets the corresponding checkbox(es) to true if the the pick up times
          // of the pharmacy configuration are already defined.
          _.set(pickUpOptions, `[${key}].selected`, true);
          if (key === 'customRange') {
            const from = _.get(settingGroup.pickUpTimes, `[${key}].from`);
            const to = _.get(settingGroup.pickUpTimes, `[${key}].to`);
            fillCustomPickUpTime(from, to);
          }
        });
        setPickUpOptions(pickUpOptions);
      }
    }
    // eslint-disable-next-line
  }, [settingGroup]);

  const renderDateInput = (order: string) => {
    const range = _.get(pickUpOptions.customRange, order.toLowerCase());
    const isSelected = _.get(pickUpOptions.customRange, 'selected');
    const error = errors[order.toLowerCase()];

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
            onChange={handleCustomRangeChange(order, 'hour')}
          />
          <TextField
            classes={{
              input: styles.leftInput,
              inputRoot: classNames(styles.inputRoot, styles.textCenter)
            }}
            inputProps={{ type: 'number' }}
            disabled={!isSelected}
            value={range.minutes}
            onChange={handleCustomRangeChange(order, 'minutes')}
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
            onChange={handleCustomRangeChange(order, 'period')}
            IconComponent={() => <ArrowDropDown />}
          />
        </div>
        {error ? (
          <Error className={styles.error} value={error} />
        ) : null}
      </div>
    );
  };
  return (
    <div className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper} ref={sectionRef}>
      <Typography className={styles.blockTitle}>Pick Up Times</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.pickUpTimesTwoColumns}>
          <div className={styles.pickUpOptions}>
            {Object.entries(pickUpOptions).map(([key, value], id) => (
              <CheckBox
                className={styles.checkbox}
                key={id}
                label={value.label}
                name="pick-up-time"
                checked={value.selected}
                onChange={() => handleCheckBoxChange(key, value)}
              />
            ))}
            {errors.noCheckboxSelected ? (
              <Error className={styles.error} value={errors.noCheckboxSelected} />
            ) : null}
          </div>
          <div className={styles.customPickUp}>
            <Typography className={styles.blockSubtitle}>Custom Pick Up Time</Typography>
            <div className={styles.pickUpSelectors}>
              {renderDateInput('From')}
              {renderDateInput('To')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
