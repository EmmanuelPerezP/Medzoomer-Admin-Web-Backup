import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { DELIVERY_STATUS, DeliveryStatuses } from '../../../../constants';
import useDelivery from '../../../../hooks/useDelivery';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';

import styles from './DeliveryInfo.module.sass';
import moment from 'moment';
import Button from '@material-ui/core/Button';

export const DeliveryInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const [isLoading, setIsLoading] = useState(true);
  const { delivery, getDelivery, sendTaskToOnfleet } = useDelivery();
  const [deliveryInfo, setDeliveryInfo] = useState(delivery);
  const [note, setNote] = useState('');

  useEffect(() => {
    getCourierInfo().catch();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (deliveryInfo.notes) {
      try {
        let tempString = ' ';
        const tempNote = JSON.parse(deliveryInfo.notes);
        // tslint:disable-next-line:forin
        for (const i in tempNote) {
          tempString += `${tempNote[i].name} ${tempNote[i].dose} ${tempNote[i].quantity}${
            tempNote.length === Number(i) + 1 ? ' ' : ', '
          }`;
        }
        // console.log(tempString);
        setNote(tempString);
      } catch (e) {
        console.error(e);
      }
    }
  }, [deliveryInfo]);

  const handleSendTaskInOnfleet = useCallback(async () => {
    await sendTaskToOnfleet(id);
    window.location.href = '/dashboard/orders';
  }, [id, sendTaskToOnfleet]);

  const getCourierInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getDelivery(id);
      setDeliveryInfo(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [id, getDelivery]);

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link to={'/dashboard/orders'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>Delivery Details</Typography>
      </div>
    );
  };

  const renderMainInfo = () => {
    return (
      <div className={styles.mainInfo}>
        <div className={styles.parametrs}>
          <Typography className={styles.item}>Created</Typography>
          <Typography className={styles.item}>Status</Typography>
          <Typography className={styles.item}>Delivery Time</Typography>
          <Typography className={styles.item}>Сustomer</Typography>
          <Typography className={styles.item}>Pharmacy</Typography>
          <Typography className={styles.item}>Pharmacist</Typography>
          <Typography className={styles.item}>Order</Typography>
          <Typography className={styles.item}>Note Delivery</Typography>
          <Typography className={styles.item}>Task Ids</Typography>
          {/*<Typography className={styles.item}>is Completed</Typography>*/}
          <Typography className={styles.item}>Distance to pharmacy</Typography>
        </div>
        <div className={styles.values}>
          <Typography className={styles.item}>{moment(deliveryInfo.createdAt).format('MM/DD/YYYY')}</Typography>
          <Typography className={styles.item}>
            {deliveryInfo.status}
            {deliveryInfo.status === 'PENDING' && deliveryInfo.order.status === 'ready' ? (
              <Button
                className={styles.btnSendTo}
                variant="contained"
                color="secondary"
                disabled={isLoading}
                onClick={handleSendTaskInOnfleet}
              >
                <Typography className={styles.summaryText}>Send To OnFleet</Typography>
              </Button>
            ) : null}
          </Typography>
          <Typography className={styles.item}>{deliveryInfo.deliveryTime}</Typography>
          <Typography className={styles.item}>
            <Link to={`/dashboard/consumers/${deliveryInfo.customer._id}`}>
              {deliveryInfo.customer.name} {deliveryInfo.customer.family_name}
            </Link>
          </Typography>
          <Typography className={styles.item}>
            <Link to={`/dashboard/pharmacies/${deliveryInfo.pharmacy._id}`}>{deliveryInfo.pharmacy.name}</Link>
          </Typography>
          <Typography className={styles.item}>
            {deliveryInfo.order && deliveryInfo.order.pharmacist
              ? `${deliveryInfo.order.pharmacist.name} ${deliveryInfo.order.pharmacist.family_name} ${
                  deliveryInfo.order.pharmacist.jobTitle ? `(${deliveryInfo.order.pharmacist.jobTitle})` : ''
                }`
              : '-'}
          </Typography>
          <Typography className={styles.item}>{deliveryInfo.order_uuid}</Typography>
          <Typography className={styles.item}>{note}</Typography>
          <Typography className={styles.item}>
            {deliveryInfo.taskIds && deliveryInfo.taskIds.length ? deliveryInfo.taskIds.join(',') : '-'}
          </Typography>
          {/*<Typography className={styles.item}>{deliveryInfo.isCompleted}</Typography>*/}
          <Typography className={styles.item}>{deliveryInfo.distToPharmacy}</Typography>
        </div>
      </div>
    );
  };

  const renderCourierInfo = () => {
    return (
      <div className={styles.deliveryBlock}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryInfoTitle}>
                <Typography className={styles.fullName}>#{deliveryInfo.order_uuid}</Typography>
                <div className={styles.statusesWrapper}>
                  <Typography className={styles.status}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.active]: deliveryInfo.status === DELIVERY_STATUS.COMPLETED,
                        [styles.declined]: deliveryInfo.status === DELIVERY_STATUS.DECLINED,
                        [styles.pending]: deliveryInfo.status === DELIVERY_STATUS.PENDING,
                        [styles.processed]: deliveryInfo.status === DELIVERY_STATUS.PROCESSED,
                        [styles.canceled]: deliveryInfo.status === DELIVERY_STATUS.CANCELED
                      })}
                    />
                    {DeliveryStatuses[deliveryInfo.status]}
                  </Typography>
                </div>
              </div>
              <>
                <div className={styles.personalInfo}>{renderMainInfo()}</div>
              </>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={styles.deliveryInfoWrapper}>
      {renderHeaderBlock()}
      {renderCourierInfo()}
    </div>
  );
};
