import React, { FC, useMemo } from 'react';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { convertDeliveriesToTasks, emptyChar, getOnFleetDistance, isPopulatedObject } from '../../utils';
import styles from './OnfleetTasks.module.sass';
import { IOnfleetTasksProps } from './types';
import { Delivery, Task } from '../../../../interfaces';
import { TaskHeader } from './TaskHeader';
import { TaskRow } from './TaskRow';
import { TaskIcon } from './TaskIcon';

export const OnfleetTasks: FC<IOnfleetTasksProps> = ({ pharmacy, deliveries }) => {
  const tasks: Task[] = useMemo(() => {
    return convertDeliveriesToTasks(deliveries, pharmacy);
  }, [deliveries, pharmacy]);

  const totalDistance = useMemo(() => {
    if (deliveries.length && isPopulatedObject(deliveries[0])) {
      const distance = (deliveries as Delivery[]).reduce((acc, curr) => acc + Number(getOnFleetDistance(curr) || 0), 0);
      return `${Number(distance).toFixed(3)} mi`;
    } else return emptyChar;
  }, [deliveries]);

  const renderIconItems = () => tasks.map((task, index) => <TaskIcon key={index} task={task} isFirst={index === 0} />);
  const renderItems = () => tasks.map((task, index) => <TaskRow task={task} key={index} />);
  const renderEmptyMessage = () => <div className={styles.emptyMessage}>Onfleet tasks list is empty</div>;

  return (
    <Wrapper
      title="Delivery"
      subTitle="Onfleet Tasks"
      iconName="onfleetTasks"
      HeaderRightComponent={
        <div className={styles.totalContainer}>
          <div className={styles.label}>Total Onfleet Distance</div>
          <div className={styles.value}>{totalDistance}</div>
        </div>
      }
      ContentLeftComponent={<div className={styles.leftComponent}>{renderIconItems()}</div>}
    >
      <div className={styles.content}>
        <TaskHeader />
        {tasks.length ? renderItems() : renderEmptyMessage()}
      </div>
    </Wrapper>
  );
};
