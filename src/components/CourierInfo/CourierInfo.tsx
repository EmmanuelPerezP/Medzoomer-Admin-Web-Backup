import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { Statuses, CheckRStatuses, tShirtSizes } from '../../constants';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './CourierInfo.module.sass';

export const CourierInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { courier, getCourier, updateCourierStatus } = useCourier();
  const { courierStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestLoading, setIsRequestLoading] = useState(false);

  useEffect(() => {
    getCouriersById().catch();
  }, []);

  const getCouriersById = async () => {
    setIsLoading(true);
    try {
      const courierInfo = await getCourier(id);
      courierStore.set('courier')({ ...courierInfo.data, carPhotos: JSON.parse(courierInfo.data.carPhotos) });
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleUpdatestatus = (status: string) => async () => {
    setIsLoading(true);
    try {
      const courierInfo = await updateCourierStatus(id, status);
      courierStore.set('courier')({ ...courierInfo.data, carPhotos: JSON.parse(courierInfo.data.carPhotos) });
      history.push('/dashboard/couriers');
      setIsRequestLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link href={'/dashboard/couriers'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>Courier Details</Typography>
      </div>
    );
  };

  const renderMainInfo = () => {
    return (
      <div className={styles.mainInfo}>
        <div className={styles.parametrs}>
          <Typography className={styles.item}>Full name</Typography>
          <Typography className={styles.item}>Email</Typography>
          <Typography className={styles.item}>Phone</Typography>
          <Typography className={styles.item}>Date of birth</Typography>
          <Typography className={styles.item}>Full address</Typography>
          <Typography className={styles.item}>T-shirt size</Typography>
          <Typography className={styles.item}>
            Have you ever worked for another delivery service (Insacart, Uber Eats, etc)?
          </Typography>
        </div>
        <div className={styles.values}>
          <Typography className={styles.item}>{`${courier.name} ${courier.family_name}`}</Typography>
          <Typography className={styles.item}>{courier.email}</Typography>
          <Typography className={styles.item}>{courier.phone_number}</Typography>
          <Typography className={styles.item}>
            {moment(courier.birthdate).format('MMMM DD, YYYY')}
            <span className={styles.years}>{` (${new Date().getFullYear() -
              new Date(courier.birthdate).getFullYear()} years old)`}</span>
          </Typography>
          <Typography className={styles.item}>{courier.address}</Typography>
          <Typography className={styles.item}>{tShirtSizes[courier.tShirt]}</Typography>
          <Typography className={styles.item}>{courier.isWorked ? 'Yes' : 'No'}</Typography>
        </div>
      </div>
    );
  };

  const renderDocuments = () => {
    return (
      <div className={styles.documents}>
        <div className={styles.document}>
          <Typography className={styles.label}>Driver's License</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.license} alt="No Image" />
          </div>
        </div>
        {courier.insurance ? (
          <div className={styles.document}>
            <Typography className={styles.label}>Car Insurance Card</Typography>
            <div className={styles.photo}>
              <img className={styles.img} src={courier.insurance} alt="No Image" />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderVehicleInfo = () => {
    return (
      <div className={styles.mainInfo}>
        <div className={styles.parametrs}>
          <Typography className={styles.item}>Make</Typography>
          <Typography className={styles.item}>Model</Typography>
          <Typography className={styles.item}>Year</Typography>
        </div>
        <div className={styles.values}>
          <Typography className={styles.item}>{courier.make}</Typography>
          <Typography className={styles.item}>{courier.carModel}</Typography>
          <Typography className={styles.item}>{courier.carYear}</Typography>
        </div>
      </div>
    );
  };

  const renderVehiclePhotos = () => {
    return (
      <div className={styles.documents}>
        <div className={styles.document}>
          <Typography className={styles.label}>Front</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.carPhotos.front} alt="No Image" />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Back</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.carPhotos.back} alt="No Image" />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Left Side</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.carPhotos.left} alt="No Image" />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Right Side</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.carPhotos.right} alt="No Image" />
          </div>
        </div>
      </div>
    );
  };

  const renderCourierInfo = () => {
    return (
      <div className={styles.courierBlock}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {courier.picture ? (
              <img className={classNames(styles.avatar, styles.img)} src={courier.picture} alt="" />
            ) : (
              <div className={styles.avatar}>
                {`${courier.name && courier.name[0].toUpperCase()} ${courier.family_name &&
                  courier.family_name[0].toUpperCase()}`}
              </div>
            )}
            <div className={styles.courierInfo}>
              <Typography className={styles.fullName}>{`${courier.name} ${courier.family_name}`}</Typography>
              <div className={styles.statusesWrapper}>
                <Typography className={styles.status}>
                  <span
                    className={classNames(styles.statusColor, {
                      [styles.active]: courier.status === 'ACTIVE',
                      [styles.declined]: courier.status === 'DECLINED'
                    })}
                  />
                  {Statuses[courier.status]}
                </Typography>
                {courier.checkrStatus ? (
                  <Typography className={styles.checkrStatus}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.active]: CheckRStatuses[courier.checkrStatus] === 'Passed',
                        [styles.declined]: CheckRStatuses[courier.checkrStatus] === 'Failed'
                      })}
                    />
                    {CheckRStatuses[courier.checkrStatus]} checking
                  </Typography>
                ) : null}
              </div>
              {/* <div className={styles.accountInfo}>
                <div className={styles.accountInfoItem}>
                  <Typography className={styles.title}>Supplies</Typography>
                  <Typography>Yes</Typography>
                </div>
                <div className={styles.accountInfoItem}>
                  <Typography className={styles.title}>Date Sent</Typography>
                  <Typography>{moment(courier.createdAt).format('MMMM DD, YYYY')}</Typography>
                </div>
                <div className={styles.accountInfoItem}>
                  <Typography className={styles.title}>In App Rating</Typography>
                  <Typography>4.1</Typography>
                </div>
              </div>
              <div className={styles.deliveryInfo}>
                <div className={styles.moneyBlock}>
                  <Typography className={styles.title}>Total Earned</Typography>
                  <Typography className={classNames(styles.money, styles.earned)}>
                    $0
                    <span className={styles.pennies}>.00</span>
                  </Typography>
                </div>
                <div className={styles.moneyBlock}>
                  <Typography className={styles.title}>Delivery Fees</Typography>
                  <Typography className={styles.money}>
                    $0
                    <span className={styles.pennies}>.00</span>
                  </Typography>
                </div>
              </div> */}
              <div className={styles.personalInfo}>
                <Typography className={styles.title}>Personal Information</Typography>
                {renderMainInfo()}
                <Typography className={styles.title}>Documents</Typography>
                {renderDocuments()}
                <Typography className={styles.title}>Vehicle Information</Typography>
                {renderVehicleInfo()}
                <Typography className={styles.title}>Vehicle Photos</Typography>
                {renderVehiclePhotos()}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    switch (courier.status) {
      case 'ACTIVE':
        return (
          <div className={classNames(styles.buttons, styles.oneButton)}>
            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdatestatus('DECLINED')}
            >
              <Typography>Disable</Typography>
            </Button>
          </div>
        );
      case 'DECLINED':
        return (
          <div className={classNames(styles.buttons, styles.oneButton)}>
            <Button
              className={classNames(styles.updateButton, styles.approve)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdatestatus('ACTIVE')}
            >
              <Typography>Activate</Typography>
            </Button>
          </div>
        );
      default:
        return (
          <div className={styles.buttons}>
            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdatestatus('DECLINED')}
            >
              <Typography>Deny</Typography>
            </Button>
            <Button
              className={classNames(styles.updateButton, styles.approve)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdatestatus('ACTIVE')}
            >
              <Typography>Approve</Typography>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className={styles.courierInfoWrapper}>
      {renderHeaderBlock()}
      {renderCourierInfo()}
      {isLoading ? null : renderFooter()}
    </div>
  );
};
