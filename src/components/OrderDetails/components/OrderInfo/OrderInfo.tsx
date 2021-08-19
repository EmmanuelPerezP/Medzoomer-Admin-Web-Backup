import styles from './OrderInfo.module.sass';
import React, { FC, useMemo } from 'react';
import { Button } from '@material-ui/core';
import { IOrderInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import classNames from 'classnames';
import Loading from '../../../common/Loading';
import { canCreateDelivery } from '../../utils';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

const createButtonStyles = {
  ...buttonStyles
};

const cancelButtonStyles = {
  ...buttonStyles,
  paddingTop: 4,
  paddingBottom: 4
};

export const OrderInfo: FC<IOrderInfoProps> = ({
  item,
  onCancelOrder,
  onCreateDelivery,
  isAlreadyInBatch,
  isLoading
}) => {
  const user = useUser();
  const isCanceled = item.status === 'canceled';

  const status = useMemo(() => {
    switch (item.status) {
      case 'new':
        return 'New';
      case 'ready':
        return 'Ready';
      case 'canceled':
        return 'Canceled';
      case 'pending':
        return 'Pending Pickup';
      case 'route':
        return 'En Route';
      case 'delivered':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'New';
    }
  }, [item.status]);

  const date: string = useMemo(() => getDateFromTimezone(item.createdAt, user, 'MMM DD, YYYY, LT'), [item.createdAt]); // eslint-disable-line
  // eslint-disable-next-line
  const dispatchDate: string = useMemo(() => getDateFromTimezone(item.dispatchAt, user, 'MMM DD, YYYY'), [
    item.dispatchAt
  ]);

  const [haveSpecialReq, specialReq] = useMemo(() => [!!item.notes, item.notes], [item.notes]);

  const showCreationButton = useMemo(() => {
    return canCreateDelivery(item);
  }, [item]);

  const renderButtons = () => (
    <>
      {showCreationButton && (
        <Button
          variant="contained"
          size="small"
          color="secondary"
          style={createButtonStyles}
          onClick={onCreateDelivery}
        >
          Create Delivery
        </Button>
      )}
      {!isCanceled && (
        <>
          <div className={styles.buttonDivider} />
          <Button variant="outlined" size="small" color="primary" style={cancelButtonStyles} onClick={onCancelOrder}>
            CANCEL
          </Button>
        </>
      )}
    </>
  );

  return (
    <Wrapper
      title="Order ID"
      subTitle={`${item.order_uuid}`}
      iconName="order"
      HeaderRightComponent={<div className={styles.buttonsContainer}>{isLoading ? <Loading /> : renderButtons()}</div>}
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Order Status</div>
          <div className={classNames(styles.value, styles.rowValue)}>
            <div
              className={classNames(styles.itemStatus, {
                [styles.new]: item.status === 'new',
                [styles.ready]: item.status === 'ready',
                [styles.canceled]: item.status === 'canceled',
                [styles.pending]: item.status === 'pending',
                [styles.route]: item.status === 'route',
                [styles.delivered]: item.status === 'delivered',
                [styles.failed]: item.status === 'failed'
              })}
            />
            {status}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Created</div>
          <div className={styles.value}>{date}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Dispatch Date</div>
          <div className={styles.value}>{dispatchDate}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Special Order Requirements</div>
          <div className={haveSpecialReq ? styles.value : styles.disabled}>
            {haveSpecialReq ? specialReq : 'Not provided'}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Is contactless delivery allowed?</div>
          <div className={styles.value}>{item.isContactlessDelivery ? 'Yes' : 'No'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>
            Can the package be left in a safe location for our contactless delivery option?
          </div>
          <div className={styles.value}>{item.canPackageBeLeft ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </Wrapper>
  );
};
