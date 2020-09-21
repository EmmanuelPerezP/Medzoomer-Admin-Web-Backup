import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { DELIVERY_STATUS, Statuses } from '../../../../constants';
import useDelivery from '../../../../hooks/useDelivery';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';

import styles from './DeliveryInfo.module.sass';
import moment from 'moment';

export const DeliveryInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const [isLoading, setIsLoading] = useState(true);
  const { delivery, getDelivery } = useDelivery();
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
          <Typography className={styles.item}>Order</Typography>
          <Typography className={styles.item}>Note Delivery</Typography>
          <Typography className={styles.item}>Task Ids</Typography>
          <Typography className={styles.item}>is Completed</Typography>
          <Typography className={styles.item}>Total Distance</Typography>
        </div>
        <div className={styles.values}>
          <Typography className={styles.item}>{moment(deliveryInfo.createdAt).format('MM/DD/YYYY')}</Typography>
          <Typography className={styles.item}>{deliveryInfo.status}</Typography>
          <Typography className={styles.item}>{deliveryInfo.deliveryTime}</Typography>
          <Typography className={styles.item}>
            <Link to={`/dashboard/consumers/${deliveryInfo.customer._id}`}>
              {deliveryInfo.customer.name} {deliveryInfo.customer.family_name}
            </Link>
          </Typography>
          <Typography className={styles.item}>
            <Link to={`/dashboard/pharmacies/${deliveryInfo.pharmacy._id}`}>{deliveryInfo.pharmacy.name}</Link>
          </Typography>
          <Typography className={styles.item}>{deliveryInfo.order_uuid}</Typography>
          <Typography className={styles.item}>{note}</Typography>
          <Typography className={styles.item}>{deliveryInfo.taskIds.join(',')}</Typography>
          <Typography className={styles.item}>{deliveryInfo.isCompleted}</Typography>
          <Typography className={styles.item}>{deliveryInfo.totalDistance}</Typography>
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
              <Typography className={styles.fullName}>{deliveryInfo.order_uuid}</Typography>
              <div className={styles.statusesWrapper}>
                <Typography className={styles.status}>
                  <span
                    className={classNames(styles.statusColor, {
                      [styles.verified]: deliveryInfo.status === DELIVERY_STATUS.VERIFIED,
                      [styles.declined]: deliveryInfo.status === DELIVERY_STATUS.DECLINED,
                      [styles.pending]: deliveryInfo.status === DELIVERY_STATUS.PENDING
                    })}
                  />
                  {Statuses[deliveryInfo.status]}
                </Typography>
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
