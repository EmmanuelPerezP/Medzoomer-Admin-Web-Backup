import React, { FC, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useRouteMatch, useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { Statuses, CheckRStatuses, tShirtSizes } from '../../constants';
import useCourier from '../../hooks/useCourier';
import useUser from '../../hooks/useUser';
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
  const { getFileLink, getImageLink } = useUser();
  const { courierStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [testImg,setTestImg] = useState('');
  useEffect(() => {
    getCouriersById().catch();
    // eslint-disable-next-line
  }, []);

  const getCouriersById = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getCourier(id);
      const images = [];

      if (data.license) {
        images.push(getImageLink(data.cognitoId, data.license));
      }
      if (data.photosCar) {
        images.push(getImageLink(data.cognitoId, data.photosCar.front));
        images.push(getImageLink(data.cognitoId, data.photosCar.back));
        images.push(getImageLink(data.cognitoId, data.photosCar.left));
        images.push(getImageLink(data.cognitoId, data.photosCar.right));
      }
      if (data.insurance) {
        images.push(getImageLink(data.cognitoId, data.insurance));
      }
      if (data.picture) {
        images.push(getImageLink(data.cognitoId, data.picture));
      }
      setTestImg(`/img/${data.cognitoId}/${data.photosCar.front}`);
      const links = await Promise.all(images);
      const courierInfo = {
        ...data,
        license: { key: data.license, preview: (links[0] && links[0].link) || '' },
        photosCar: {
          front: { key: data.photosCar.front,k1:data.cognitoId,k2: data.photosCar.front, preview: (links[1] && links[1].link) || '' },
          back: { key: data.photosCar.right, preview: (links[2] && links[2].link) || '' },
          left: { key: data.photosCar.left, preview: (links[3] && links[3].link) || '' },
          right: { key: data.photosCar.right, preview: (links[4] && links[4].link) || '' }
        },
        insurance: { key: data.license, preview: (links[5] && links[5].link) || '' },
        picture: { key: data.picture, preview: (links[6] && links[6].link) || '' }
      };
      courierStore.set('courier')(courierInfo);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [courierStore, getCourier, getImageLink, id]);

  const handleGetFileLink = (fileId: string) => async () => {
    try {
      const { link } = await getFileLink(process.env.REACT_APP_HELLO_SIGN_KEY as string, `${fileId}.pdf`);
      (window.open(link, '_blank') as any).focus();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatestatus = (status: string) => async () => {
    setIsLoading(true);
    try {
      const courierInfo = await updateCourierStatus(id, status);
      courierStore.set('courier')({ ...courierInfo.data });
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
          <Typography className={styles.item}>Agreement</Typography>
          <Typography className={styles.item}>FW9</Typography>
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
          <Typography
            onClick={
              courier.hellosign && courier.hellosign.agreement
                ? handleGetFileLink(courier.hellosign.agreement)
                : undefined
            }
            className={classNames(styles.item, { [styles.link]: courier.hellosign && courier.hellosign.fw9 })}
          >
            agreement.pdf
          </Typography>
          <Typography
            onClick={courier.hellosign && courier.hellosign.fw9 ? handleGetFileLink(courier.hellosign.fw9) : undefined}
            className={classNames(styles.item, { [styles.link]: courier.hellosign && courier.hellosign.fw9 })}
          >
            fw9.pdf
          </Typography>
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
            <img className={styles.img} src={courier.license.preview} alt={'No Document'} />
          </div>
        </div>
        {courier.insurance ? (
          <div className={styles.document}>
            <Typography className={styles.label}>Car Insurance Card</Typography>
            <div className={styles.photo}>
              <img className={styles.img} src={courier.insurance.preview} alt={'No Document'} />
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
            <img className={styles.img} src={testImg} alt={'No Car'} />
            <img className={styles.img} src={courier.photosCar.front.preview} alt={'No Car'} />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Back</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.photosCar.back.preview} alt={'No Car'} />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Left Side</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.photosCar.left.preview} alt={'No Car'} />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Right Side</Typography>
          <div className={styles.photo}>
            <img className={styles.img} src={courier.photosCar.right.preview} alt={'No Car'} />
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
            {courier.picture.preview ? (
              <img className={classNames(styles.avatar, styles.img)} src={courier.picture.preview} alt={'No Avatar'} />
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
