import React from 'react';
import { Typography } from '@material-ui/core';
import { days } from '../../../../../../constants';
import { User } from '../../../../../../interfaces';
import styles from '../../CourierInfo.module.sass';
import useUser from '../../../../../../hooks/useUser';
import { getDateFromTimezone } from '../../../../../../utils';
import { SummaryItem } from '../../CourierInfo';

const CourierSchedule: React.FC<{ schedule?: User['schedule'] | null }> = ({ schedule }) => {
  const user = useUser();

  const timeFormat = (time: any) => {
    if (typeof time === 'string') {
      return getDateFromTimezone(time, user, 'h:mm A');
    } else {
      return `${time.hour}:${time.minutes} ${time.period}`;
    }
  };

  return !schedule ? (
    <div>Round-the-clock</div>
  ) : (
    <>
      <Typography className={styles.subInfoTitle}>Working Hours</Typography>
      {schedule.wholeWeek.isClosed ? (
        days.map((day) =>
          schedule[day.value].isClosed ? (
            <SummaryItem title={day.label} value="Day Off" />
          ) : (
            <SummaryItem
              title={day.label}
              value={`${timeFormat(schedule[day.value].open)} - ${timeFormat(schedule[day.value].close)}`}
            />
          )
        )
      ) : (
        <>
          <SummaryItem title="Start" value={timeFormat(schedule.wholeWeek.open)} />
          <SummaryItem title="End" value={timeFormat(schedule.wholeWeek.close)} />
        </>
      )}
    </>
  );
};

export default CourierSchedule;
