import React from 'react';
import moment from 'moment-timezone';
import { Typography } from '@material-ui/core';
import { days } from '../../../../../../constants';
import { User } from '../../../../../../interfaces';
import styles from '../../CourierInfo.module.sass';
import useUser from '../../../../../../hooks/useUser';

const CourierSchedule: React.FC<{ schedule?: User['schedule'] | null }> = ({ schedule }) => {
  const user = useUser();

  const timeFormat = (time: any) => {
    if (typeof time === 'string') {
      return moment(time).tz(user.timezone as string).format('h:mm A');
    } else {
      return `${time.hour}:${time.minutes} ${time.period}`;
    }
  };

  return !schedule ? (
    <div>Round-the-clock</div>
  ) : (
    <>
      {schedule.wholeWeek.isClosed ? (
        days.map((day) =>
          schedule[day.value].isClosed ? (
            <div className={styles.scheduleItem}>
              <Typography component="p">{day.label}</Typography>
              <div>{`Day Off`}</div>
            </div>
          ) : (
            <div className={styles.scheduleItem}>
              <Typography component="p">{day.label}</Typography>
              <div>
                {timeFormat(schedule[day.value].open)} - {timeFormat(schedule[day.value].close)}
              </div>
            </div>
          )
        )
      ) : (
        <>
          <div className={styles.scheduleItem}>
            <Typography component="p">Opens</Typography>
            <div>{timeFormat(schedule.wholeWeek.open)}</div>
          </div>
          <div className={styles.scheduleItem}>
            <Typography component="p">Close</Typography>
            <div>{timeFormat(schedule.wholeWeek.close)}</div>
          </div>
        </>
      )}
    </>
  );
};

export default CourierSchedule;
