import styles from './TaskInfo.module.sass';
import React, { FC, useMemo, useCallback } from 'react';
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import { Link, useHistory } from 'react-router-dom';

import { ITaskInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { emptyChar, getOnfleetTaskLink, isPopulatedObject } from '../../utils';
import { TDeliveryStatuses, User } from '../../../../interfaces';
import Loading from '../../../common/Loading';
import DoneIcon from '@material-ui/icons/Done';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

export const TaskInfo: FC<ITaskInfoProps> = ({ order, delivery, isLoading, onForceInvoiced }) => {
  const history = useHistory();
  const deliveryStatus = delivery.status as TDeliveryStatuses;

  const status = useMemo(() => {
    switch (deliveryStatus) {
      case 'PENDING':
        return 'Pending';
      case 'PROCESSED':
        return 'Processed';
      case 'UNASSIGNED':
        return 'Unassigned';
      case 'ASSIGNED':
        return 'Assigned';
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELED':
        return 'Canceled';
      case 'FAILED':
        return 'Failed';

      default:
        return 'Pending';
    }
  }, [delivery.status, deliveryStatus]); // eslint-disable-line

  const canShowForcedInvoice = useMemo(() => !(delivery.income || delivery.forcedIncome), [
    delivery.income,
    delivery.forcedIncome
  ]);

  const [courier, courierId, haveCourier]: [User | string, string | null, boolean] = useMemo(() => {
    const user = delivery.user;
    if (!user) return [emptyChar, null, false];
    if (isPopulatedObject(user)) {
      return [`${user.name} ${user.family_name}`, user._id, true];
    }
    return [user, (user as unknown) as string, true];
  }, [delivery.user]);

  const onFleetDistance: string = useMemo(() => {
    if (delivery.completionDetails && delivery.completionDetails.distance) {
      return `${delivery.completionDetails.distance} mi`;
    }
    return emptyChar;
  }, [delivery.completionDetails]);

  const mapsDistance: string = useMemo(() => {
    if (!delivery.distToPharmacy) return emptyChar;
    return `${delivery.distToPharmacy} mi`;
  }, [delivery.distToPharmacy]);

  const courierPrice = useMemo(() => {
    if ('forcedPriceForCourier' in delivery) {
      return `$${Number(delivery.forcedPriceForCourier).toFixed(2)}`;
    }
    if ((delivery as any).payout) {
      return `$${Number((delivery as any).payout.amount).toFixed(2)}`;
    }
    return emptyChar;
  }, [delivery.forcedPriceForCourier, delivery.payout]); // eslint-disable-line

  const pharmacyPrice = useMemo(() => {
    if ('forcedPriceForPharmacy' in delivery) {
      return `$${Number(delivery.forcedPriceForPharmacy).toFixed(2)}`;
    } else return emptyChar;
  }, [delivery.forcedPriceForPharmacy]); // eslint-disable-line

  const handleTaskDetailsRedirect = useCallback(() => {
    history.push(`/dashboard/deliveries/task/${(delivery as any)._id}`);
  }, [history, delivery]);

  const renderTaskStatus = () => {
    let isSent: boolean = false;

    if (delivery && (delivery.income || delivery.payout || delivery.forcedIncome)) {
      isSent = true;
    }

    return (
      <div className={styles.row}>
        <div className={styles.label}>Invoice Status</div>
        {isSent ? (
          <div className={styles.taskStatusWrapper}>
            <DoneIcon color="action" fontSize="small" />
            <div className={styles.taskStatusValue}>Sent to queue</div>
          </div>
        ) : (
          <div className={classNames(styles.value, styles.disabledValue)}>Not Sent</div>
        )}
      </div>
    );
  };

  return (
    <Wrapper
      title="Task ID"
      subTitle={`${order.order_uuid}`}
      iconName="locationPin"
      HeaderRightComponent={
        <div className={styles.buttonContainer}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {canShowForcedInvoice && (
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  style={buttonStyles}
                  onClick={onForceInvoiced}
                >
                  Add to Invoice
                </Button>
              )}
              <div className={styles.buttonDivider} />
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                style={buttonStyles}
                onClick={handleTaskDetailsRedirect}
              >
                Task Details
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Task Status</div>
          <div className={classNames(styles.rowValue, styles.value)}>
            <div
              className={classNames(styles.itemStatus, {
                [styles.pending]: deliveryStatus === 'PENDING',
                [styles.proccessed]: deliveryStatus === 'PROCESSED',
                [styles.unassigned]: deliveryStatus === 'UNASSIGNED',
                [styles.assigned]: deliveryStatus === 'ASSIGNED',
                [styles.active]: deliveryStatus === 'ACTIVE',
                [styles.completed]: deliveryStatus === 'COMPLETED',
                [styles.canceled]: deliveryStatus === 'CANCELED',
                [styles.failed]: deliveryStatus === 'FAILED'
              })}
            />
            {status}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Courier</div>
          {haveCourier ? (
            <Link to={`/dashboard/couriers/${courierId}`} className={classNames(styles.link, styles.value)}>
              {courier}
            </Link>
          ) : (
            <div className={styles.value}>{courier}</div>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Task Type</div>
          <div className={styles.value}>Drop Off</div>
        </div>

        {delivery.currentTaskId && (
          <div className={styles.row}>
            <div className={styles.label}>Onfleet Link</div>
            <a
              href={getOnfleetTaskLink(delivery.currentTaskId)}
              target="_blank" // eslint-disable-line
              className={classNames(styles.value, styles.link)}
            >
              Link
            </a>
          </div>
        )}

        <div className={styles.row}>
          <div className={styles.label}>Onfleet Distance</div>
          <div className={styles.value}>{onFleetDistance}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Google Maps Distance</div>
          <div className={styles.value}>{mapsDistance}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Price for this delivery leg (based on Onfleet distance)</div>
          <div className={styles.value}>{courierPrice}</div>
        </div>

        <div className={styles.underline} />

        <div className={styles.row}>
          <div className={styles.label}>Courier Delivery Price</div>
          <div className={styles.value}>{courierPrice}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Pharmacy Delivery Price</div>
          <div className={styles.value}>{pharmacyPrice}</div>
        </div>

        <div className={styles.underline} />
        {renderTaskStatus()}
      </div>
    </Wrapper>
  );
};
