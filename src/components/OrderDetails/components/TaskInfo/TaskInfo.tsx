import styles from './TaskInfo.module.sass';
import React, { FC, useMemo, useCallback } from 'react';
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ITaskInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { emptyChar, getOnfleetTaskLink, isPopulatedObject } from '../../utils';
import { TDeliveryStatuses, User } from '../../../../interfaces';
import Loading from '../../../common/Loading';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

export const TaskInfo: FC<ITaskInfoProps> = ({ order, delivery, isLoading, onForceInvoiced }) => {
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
  }, [delivery.status, deliveryStatus]);

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
  }, [delivery.forcedPriceForCourier, delivery.payout]);

  const pharmacyPrice = useMemo(() => {
    if ('forcedPriceForPharmacy' in delivery) {
      return `$${Number(delivery.forcedPriceForPharmacy).toFixed(2)}`;
    } else return emptyChar;
  }, [delivery.forcedPriceForPharmacy]);

  const [dropOffLink, pickUpLink]: [string | null, string | null] = useMemo(() => {
    if(delivery.taskIds && delivery.taskIds.length) {
      const [pickUp, dropOff] = delivery.taskIds

      return [
        dropOff ? getOnfleetTaskLink(dropOff) : null, 
        pickUp ? getOnfleetTaskLink(pickUp) : null
      ]
    }
    return [null, null]
  }, [delivery.taskIds])

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
            <Link to={`/dashboard/consumers/${courierId}`} className={classNames(styles.link, styles.value)}>
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

        {
          pickUpLink && (
            <div className={styles.row}>
              <div className={styles.label}>Onfleet Link (Pick Up)</div>
              <a href={pickUpLink} target="_blank" className={classNames(styles.value, styles.link)}>
                Link
              </a>
            </div>
          )
        }

        {
          dropOffLink && (
            <div className={styles.row}>
              <div className={styles.label}>Onfleet Link (Drop Off)</div>
              <a href={dropOffLink} target="_blank" className={classNames(styles.value, styles.link)}>
                Link
              </a>
            </div>
          )
        }

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
          {/* 
            // ! TODO - dispaly price for delivery leg
          */}
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

        <div className={styles.row}>
          <div className={styles.label}>Invoice Status</div>
          <div className={classNames(styles.value, styles.disabled)}>Not Sent</div>
        </div>
      </div>
    </Wrapper>
  );
};
