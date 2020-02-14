import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { Statuses } from '../../utils';
import useCourier from '../../hooks/useCourier';
import { useStores } from '../../store';

import SVGIcon from '../common/SVGIcon';
import Loading from '../common/Loading';

import styles from './CourierInfo.module.sass';

export const CourierInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const { courier, getCourier, updateCourierStatus } = useCourier();
  const { courierStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCouriersById().catch();
  }, []);

  const getCouriersById = async () => {
    setIsLoading(true);
    const courierInfo = await getCourier(id);
    courierStore.set('courier')(courierInfo.data);
    setIsLoading(false);
  };

  const handleUpdatestatus = (status: string) => async () => {
    const courierInfo = await updateCourierStatus(id, status);
    courierStore.set('courier')(courierInfo.data);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link href={'/dashboard/couriers'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>Courier Management</Typography>
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
              <Typography className={styles.status}>
                <span
                  className={classNames(styles.statusColor, {
                    [styles.active]: courier.status === 'ACTIVE',
                    [styles.declined]: courier.status === 'DECLINED'
                  })}
                />
                {Statuses[courier.status]}
              </Typography>
              <div className={styles.personalInfo}>
                <Typography className={styles.title}>Personal Information</Typography>
                {renderMainInfo()}
                <Typography className={styles.title}>Documents</Typography>
                {renderDocuments()}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div className={styles.buttons}>
        <Button
          className={styles.updateButton}
          variant="contained"
          color="primary"
          onClick={handleUpdatestatus('DECLINED')}
        >
          <Typography>Deny</Typography>
        </Button>
        <Button
          className={classNames(styles.updateButton, styles.approve)}
          variant="contained"
          color="primary"
          onClick={handleUpdatestatus('ACTIVE')}
        >
          <Typography>Approve</Typography>
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.courierInfoWrapper}>
      {renderHeaderBlock()}
      {renderCourierInfo()}
      {renderFooter()}
    </div>
  );
};
