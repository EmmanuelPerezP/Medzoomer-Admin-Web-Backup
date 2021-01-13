import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useHistory, useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom';

import { CheckRStatuses, DeliveryStatuses, Statuses, tShirtSizes } from '../../../../constants';
import useCourier from '../../../../hooks/useCourier';
import useUser from '../../../../hooks/useUser';
import useDelivery from '../../../../hooks/useDelivery';
import useTeams from '../../../../hooks/useTeams';
import { useStores } from '../../../../store';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import Image from '../../../common/Image';
import Video from '../../../common/Video';
import CourierSchedule from './components/CourierSchedule';
import { isCourierComplete, getAddressString, isCourierUnregistered } from '../../../../utils';
import IncreaseBalanceModal from '../IncreaseBalanceModal';
import ConfirmationModal from '../../../common/ConfirmationModal';

import styles from './CourierInfo.module.sass';

export const CourierInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const {
    courier,
    getCourier,
    updateCourierStatus,
    updateCourierOnboarded,
    reAddToOnfleet,
    setEmptyCourier,
    increaseCourierBalance,
    checkCreateCandidate
  } = useCourier();
  const { getTeams, teams } = useTeams();
  const { getFileLink } = useUser();
  const { courierStore, deliveryStore, teamsStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [newBalanceModal, setNewBalanceModal] = useState(false);
  const [agreement, setAgreement] = useState({ link: '', isLoading: false });
  const [fw9, setfw9] = useState({ link: '', isLoading: false });
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { getDeliveriesCourier, filters } = useDelivery();
  const { page, sortField, order, search } = filters;
  const [checkRCreateLoading, setCheckRCreateLoading] = useState(false);
  const [checkRModal, setCheckRModal] = useState(false);

  useEffect(() => {
    getCourierInfo().catch();
    if (!teams) {
      getTeamsList().catch();
    }
    return setEmptyCourier();
    // eslint-disable-next-line
  }, []);

  const getCourierInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getCourier(id);
      const deliveries = await getDeliveriesCourier({
        page,
        perPage: 3,
        search,
        sortField,
        order,
        sub: id
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      courierStore.set('courier')(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [courierStore, getCourier, id, deliveryStore, getDeliveriesCourier, order, page, search, sortField]);

  const getTeamsList = useCallback(async () => {
    try {
      const groups = await getTeams();
      teamsStore.set('teams')(groups.data.teams);
    } catch (err) {
      console.error(err);
    }
  }, [getTeams, teamsStore]);

  const handleGetFileLink = (fileId: string, type: string) => async () => {
    try {
      type === 'fw9' ? setfw9({ ...fw9, isLoading: true }) : setAgreement({ ...agreement, isLoading: true });
      if (type === 'fw9' ? fw9.link : agreement.link) {
        type === 'fw9' ? setfw9({ ...fw9, isLoading: false }) : setAgreement({ ...agreement, isLoading: false });
        (window.open(type === 'fw9' ? fw9.link : agreement.link, '_blank') as any).focus();
      } else {
        const { link } = await getFileLink(process.env.REACT_APP_HELLO_SIGN_KEY as string, `${fileId}.pdf`);
        type === 'fw9'
          ? setfw9({ ...fw9, link, isLoading: false })
          : setAgreement({ ...agreement, link, isLoading: false });

        (window.open(link, '_blank') as any).focus();
      }
    } catch (error) {
      type === 'fw9' ? setfw9({ ...fw9, isLoading: false }) : setAgreement({ ...agreement, isLoading: false });
      console.error(error);
    }
  };

  const handleUpdateStatus = (status: string) => async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      const courierInfo = await updateCourierStatus(id, status);
      courierStore.set('courier')({ ...courierInfo.data });
      history.push('/dashboard/couriers');
      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleReAddToOnfleet = () => async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      await reAddToOnfleet(id);

      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleAddBalance = async (amount: number) => {
    setIsLoading(true);
    setIsRequestLoading(true);
    await increaseCourierBalance(id, amount);
    await getCourierInfo();
    setIsLoading(false);
    setIsRequestLoading(false);
  };

  const handleChangeCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleUpdateOnboard = async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      const courierInfo = await updateCourierOnboarded(id, !courier.onboarded);

      courierStore.set('courier')({ ...courierInfo.data });
      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsRequestLoading(false);
      setIsLoading(false);
    }
  };

  const handleCreateCheckRCandidate = async () => {
    setCheckRCreateLoading(true);
    const { checkrData } = await checkCreateCandidate({ cognitoId: courier.cognitoId });
    setCheckRModal(false);
    setCheckRCreateLoading(false);
    courierStore.set('courier')({ ...courier, ...checkrData });
  };

  const toggleCheckRModal = () => {
    setCheckRModal(!checkRModal);
  };

  // const handlePackageUpdate = async () => {
  //   setIsLoading(true);
  //   setIsRequestLoading(true);
  //   try {
  //     const courierInfo = await updateCourierPackage(id, !courier.welcomePackageSent);

  //     courierStore.set('courier')({ ...courierInfo.data });
  //     setIsRequestLoading(false);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setIsRequestLoading(false);
  //     setIsLoading(false);
  //   }
  // };

  // const handleIsOnFleetUpdate = async () => {
  //   setIsLoading(true);
  //   setIsRequestLoading(true);
  //   try {
  //     const courierInfo = await updateCourierisOnFleet(id, !courier.isOnFleet);
  //
  //     courierStore.set('courier')({ ...courierInfo.data });
  //     setIsRequestLoading(false);
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setIsRequestLoading(false);
  //     setIsLoading(false);
  //   }
  // };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Link to={'/dashboard/couriers'}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>Courier Details</Typography>
      </div>
    );
  };

  const renderMainInfo = () => {
    let teamsNames = '';
    const teamsArr: string[] = [];

    if (courier.teams && courier.teams.length) {
      courier.teams.forEach((teamId: string) => {
        const team = teams && teams.find((t: any) => t.id === teamId);
        if (team) {
          teamsArr.push(team.name);
        }
      });
      if (teamsArr.length) {
        teamsNames = teamsArr.join(', ');
      } else {
        teamsNames = 'Not found';
      }
    } else {
      teamsNames = 'Not choose';
    }

    return (
      <div className={styles.mainInfo}>
        <div className={styles.parametrs}>
          <Typography className={styles.item}>Full Name</Typography>
          <Typography className={styles.item}>Email</Typography>
          <Typography className={styles.item}>Phone</Typography>
          <Typography className={styles.item}>Date of birth</Typography>
          <Typography className={styles.item}>Address</Typography>
          <Typography className={styles.item}>Apartment, suite, etc.</Typography>
          <Typography className={styles.item}>Teams</Typography>
          <Typography className={styles.item}>T-shirt size</Typography>
          {courier.hellosign && courier.hellosign.isAgreementSigned ? (
            <Typography className={styles.item}>Agreement</Typography>
          ) : null}
          {courier.hellosign && courier.hellosign.isFW9Signed ? (
            <Typography className={styles.item}>FW9</Typography>
          ) : null}
          {courier.heardFrom ? (
            <Typography className={styles.item}>How did you hear about Medzoomer?</Typography>
          ) : null}
          <Typography className={styles.item}>
            Have you ever worked for another delivery service (Instacart, Uber Eats, etc)?
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
          <Typography className={styles.item}>{getAddressString(courier.address, false)}</Typography>
          <Typography className={styles.item}>{(courier.address && courier.address.apartment) || '-'}</Typography>
          <Typography className={styles.item}>{teamsNames}</Typography>
          <Typography className={styles.item}>{tShirtSizes[courier.tShirt]}</Typography>
          {courier.hellosign && courier.hellosign.isAgreementSigned ? (
            <Typography
              onClick={handleGetFileLink(courier.hellosign.agreement, 'agreement')}
              className={classNames(styles.item, { [styles.link]: courier.hellosign && courier.hellosign.agreement })}
            >
              {agreement.isLoading ? <Loading className={styles.fileLoader} /> : 'agreement.pdf'}
            </Typography>
          ) : null}
          {courier.hellosign && courier.hellosign.isFW9Signed ? (
            <Typography
              onClick={handleGetFileLink(courier.hellosign.fw9, 'fw9')}
              className={classNames(styles.item, { [styles.link]: courier.hellosign && courier.hellosign.fw9 })}
            >
              {fw9.isLoading ? <Loading className={styles.fileLoader} /> : 'fw9.pdf'}
            </Typography>
          ) : null}
          {courier.heardFrom ? <Typography className={styles.item}>{courier.heardFrom}</Typography> : null}
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
            <Image
              // width={200}
              // height={200}
              isPreview={true}
              className={styles.img}
              cognitoId={courier.cognitoId}
              src={courier.license}
              alt={'No Document'}
            />
          </div>
        </div>
        {courier.insurance ? (
          <div className={styles.document}>
            <Typography className={styles.label}>Car Insurance Card</Typography>
            <div className={styles.photo}>
              <Image
                // width={200}
                // height={200}
                isPreview={true}
                className={styles.img}
                cognitoId={courier.cognitoId}
                src={courier.insurance}
                alt={'No Document'}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderPresentationVideo = () => {
    return courier.videoPresentation ? (
      <>
        <Typography className={styles.title}>Video presentation</Typography>
        <Video className={styles.videoBlock} cognitoId={courier.cognitoId} src={courier.videoPresentation} />
      </>
    ) : null;
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
            <Image
              // width={200}
              // height={200}
              isPreview={true}
              className={styles.img}
              cognitoId={courier.cognitoId}
              src={courier.photosCar && courier.photosCar.front}
              alt={'No Car'}
            />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Back</Typography>
          <div className={styles.photo}>
            <Image
              // width={200}
              // height={200}
              isPreview={true}
              className={styles.img}
              cognitoId={courier.cognitoId}
              src={courier.photosCar && courier.photosCar.back}
              alt={'No Car'}
            />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Left Side</Typography>
          <div className={styles.photo}>
            <Image
              // width={200}
              // height={200}
              isPreview={true}
              className={styles.img}
              cognitoId={courier.cognitoId}
              src={courier.photosCar && courier.photosCar.left}
              alt={'No Car'}
            />
          </div>
        </div>
        <div className={styles.document}>
          <Typography className={styles.label}>Right Side</Typography>
          <div className={styles.photo}>
            <Image
              // width={200}
              // height={200}
              isPreview={true}
              className={styles.img}
              cognitoId={courier.cognitoId}
              src={courier.photosCar && courier.photosCar.right}
              alt={'No Car'}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderRatings = () => {
    return (
      <>
        <div className={styles.accountInfo}>
          <div className={styles.accountInfoItem}>
            <Typography className={styles.title}>Welcome Package</Typography>
            <Typography
              onClick={!courier.onboarded ? handleUpdateOnboard : () => undefined}
              className={classNames({ [styles.isNotSent]: !courier.onboarded })}
            >
              {/* handlePackageUpdate */}
              {courier.onboarded ? 'Yes' : 'Mark as sent'}
            </Typography>
          </div>
          {courier.onboarded ? (
            <div className={styles.accountInfoItem}>
              <Typography className={styles.title}>Date Sent</Typography>
              <Typography>{moment(courier.dateSent).format('MMMM DD, YYYY')}</Typography>
            </div>
          ) : null}
          <div className={styles.accountInfoItem}>
            <Typography className={styles.title}>HIPAA Training Completed?</Typography>
            <Typography>{courier.completedHIPAATraining ? 'Yes' : 'No'}</Typography>
          </div>
          <div className={styles.accountInfoItem}>
            <Typography className={styles.title}>Registered for Onfleet?</Typography>
            <Typography>{courier.isOnFleet ? 'Yes' : 'No'}</Typography>
          </div>
          <div className={styles.accountInfoItem}>
            <Typography className={styles.title}>Set Billing Account?</Typography>
            <Typography>{courier.dwolla && courier.dwolla.bankAccountType ? 'Yes' : 'No'}</Typography>
          </div>
        </div>

        <div className={styles.deliveryInfo}>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Total Earned</Typography>
            <Typography className={classNames(styles.money, styles.earned)}>
              ${deliveryStore.get('meta').totalFees}
            </Typography>
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Total Bonus</Typography>
            <Typography className={classNames(styles.money, styles.earned)}>
              ${deliveryStore.get('meta').bonus}
            </Typography>
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Total Deliveries</Typography>
            <Typography className={styles.money}>{deliveryStore.get('meta').totalCount}</Typography>
          </div>
        </div>
      </>
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
              <Image
                // width={200}
                // height={200}
                isPreview={true}
                cognitoId={courier.cognitoId}
                className={classNames(styles.avatar, styles.img)}
                src={courier.picture}
                alt={'No Avatar'}
              />
            ) : (
              <div className={styles.avatar}>
                {`${courier.name && courier.name[0].toUpperCase()} ${courier.family_name &&
                  courier.family_name[0].toUpperCase()}`}
              </div>
            )}
            <div className={styles.courierInfo}>
              <Typography className={styles.fullName}>{`${courier.name} ${courier.family_name}`}</Typography>
              <div className={styles.statusesWrapper}>
                <div>
                  <Typography className={classNames(styles.status)}>Registration Status</Typography>
                  <Typography className={styles.status}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.active]: isCourierComplete(courier),
                        [styles.declined]: courier.status === 'DECLINED'
                      })}
                    />
                    {isCourierUnregistered(courier)
                      ? 'Unregistered'
                      : isCourierComplete(courier)
                      ? 'Complete'
                      : 'Incomplete'}
                  </Typography>
                </div>
                {courier.checkrStatus ? (
                  <div>
                    <Typography className={classNames(styles.checkrStatus)}>CheckR Status</Typography>
                    <Typography
                      className={classNames(styles.checkrStatus, {
                        [styles.failed]:
                          courier.checkrStatus === 'consider' ||
                          courier.checkrStatus === 'suspended' ||
                          courier.checkrStatus === 'dispute'
                      })}
                    >
                      {!!courier.checkrId && (
                        <span
                          className={classNames(styles.statusColor, {
                            [styles.active]: CheckRStatuses[courier.checkrStatus] === 'Passed',
                            [styles.declined]: CheckRStatuses[courier.checkrStatus] === 'Failed'
                          })}
                        />
                      )}
                      {!courier.checkrId ? 'ChechR link is not sent' : `${CheckRStatuses[courier.checkrStatus]}`}
                    </Typography>
                  </div>
                ) : null}
                <div>
                  <Typography className={classNames(styles.onboarded)}>Onboarding Status</Typography>
                  <Typography className={classNames(styles.onboarded)}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.active]: courier.onboarded,
                        [styles.declined]: !courier.onboarded && courier.status === 'DECLINED',
                        [styles.approved]: !courier.onboarded && courier.status === 'ACTIVE'
                      })}
                    />
                    {courier.onboarded
                      ? 'Onboarded'
                      : courier.status && /*courier.status !== 'INCOMPLETE' &&*/ Statuses[courier.status]}
                  </Typography>
                </div>
              </div>
              {renderRatings()}
              {courier.status === 'ACTIVE' ? (
                <>
                  {!isOpen ? (
                    <Typography className={styles.collapseText} onClick={handleChangeCollapse}>
                      Show Personal Information
                    </Typography>
                  ) : null}
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <div className={styles.personalInfo}>
                      <Typography className={styles.title}>Personal Information</Typography>
                      {renderMainInfo()}
                      {!!courier.schedule && (
                        <>
                          <Typography className={styles.title}>Working hours</Typography>
                          <CourierSchedule schedule={courier.schedule} />
                        </>
                      )}
                      <Typography className={styles.title}>Documents</Typography>
                      {courier.license ? renderDocuments() : null}
                      {renderPresentationVideo()}
                      {courier.make ? (
                        <>
                          <Typography className={styles.title}>Vehicle Information</Typography>
                          {renderVehicleInfo()}
                          <Typography className={styles.title}>Vehicle Photos</Typography>
                          {renderVehiclePhotos()}
                          <Typography className={styles.collapseText} onClick={handleChangeCollapse}>
                            Hide Personal Information
                          </Typography>
                        </>
                      ) : null}
                    </div>
                  </Collapse>
                </>
              ) : (
                <div className={styles.personalInfo}>
                  <Typography className={styles.title}>Personal Information</Typography>
                  {renderMainInfo()}
                  {!!courier.schedule && (
                    <>
                      <Typography className={styles.title}>Working hours</Typography>
                      <CourierSchedule schedule={courier.schedule} />
                    </>
                  )}
                  <Typography className={styles.title}>Documents</Typography>
                  {courier.license ? renderDocuments() : null}
                  {renderPresentationVideo()}
                  {courier.make ? (
                    <>
                      <Typography className={styles.title}>Vehicle Information</Typography>
                      {renderVehicleInfo()}
                      <Typography className={styles.title}>Vehicle Photos</Typography>
                      {renderVehiclePhotos()}
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    const checkRButton = (
      <Button
        className={styles.checkRButton}
        variant="contained"
        color="primary"
        // disabled={checkRCreateLoading}
        onClick={toggleCheckRModal}
      >
        <Typography>{!courier.checkrId ? 'Create CheckR candidate' : 'Send new CheckR link'}</Typography>
      </Button>
    );

    switch (courier.status) {
      case 'ACTIVE':
        return (
          <div className={classNames(styles.buttons)}>
            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('DECLINED')}
            >
              <Typography>Disable</Typography>
            </Button>

            <Button
              className={styles.increaseBalance}
              variant="contained"
              color="secondary"
              disabled={isRequestLoading}
              onClick={() => {
                setNewBalanceModal(true);
              }}
            >
              <Typography>Increase Courier Balance</Typography>
            </Button>

            <Button
              className={styles.reAddToOnfleet}
              variant="outlined"
              color="secondary"
              disabled={isRequestLoading}
              onClick={handleReAddToOnfleet()}
            >
              <Typography>Re-add to Onfleet</Typography>
            </Button>

            {checkRButton}

            <IncreaseBalanceModal
              sendToBalance={handleAddBalance}
              isOpen={newBalanceModal}
              onClose={() => {
                setNewBalanceModal(false);
              }}
            />
          </div>
        );
      case 'DECLINED':
        return (
          <div className={classNames(styles.buttons, styles.oneButton)}>
            <Button
              className={classNames(styles.updateButton)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('ACTIVE')}
            >
              <Typography>Activate</Typography>
            </Button>

            {checkRButton}
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
              onClick={handleUpdateStatus('DECLINED')}
            >
              <Typography>Deny</Typography>
            </Button>
            <Button
              className={classNames(styles.updateButton, styles.approve)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading /*|| courier.checkrStatus !== 'clear'*/}
              onClick={handleUpdateStatus('ACTIVE')}
            >
              <Typography>Approve</Typography>
            </Button>

            {checkRButton}
          </div>
        );
    }
  };

  const renderLastDeliveryHistory = (path: string) => {
    return (
      <div className={styles.deliveries}>
        <div className={styles.deliveryHeader}>
          <Typography className={styles.title}>Latest Delivery</Typography>
          <Link to={path} className={styles.link}>
            View All
          </Link>
        </div>
        <Table>
          <TableHead>
            <TableRow className={styles.tableHeader}>
              <TableCell className={classNames(styles.date, styles.headerCell)}>Date</TableCell>
              <TableCell className={classNames(styles.time, styles.headerCell)}>Time</TableCell>
              <TableCell className={classNames(styles.trip, styles.headerCell)}>Order ID</TableCell>
              <TableCell className={classNames(styles.status, styles.headerCell)}>Status</TableCell>
              <TableCell className={classNames(styles.tips, styles.headerCell)}>Tip</TableCell>
              <TableCell className={classNames(styles.earned, styles.headerCell)} align="right">
                Earned
              </TableCell>
            </TableRow>
          </TableHead>
          {!deliveryStore.get('deliveries').length && (
            <Typography className={styles.noDelivery}>There is no delivery history yet</Typography>
          )}
          <TableBody>
            {deliveryStore.get('deliveries')
              ? deliveryStore.get('deliveries').map((row) => (
                  <TableRow key={row._id} className={styles.tableItem}>
                    <TableCell className={styles.date}>{row.updatedAt && moment(row.updatedAt).format('ll')}</TableCell>
                    <TableCell className={styles.time}>
                      {row.updatedAt && moment(row.updatedAt).format('HH:mm A')}
                    </TableCell>
                    <TableCell className={styles.trip}>{row.order_uuid && row.order_uuid}</TableCell>
                    <TableCell className={styles.status}>
                      <span
                        className={classNames(styles.statusColor, {
                          [styles.active]: row.status === 'ACTIVE',
                          [styles.pending]: row.status === 'PENDING',
                          [styles.inprogress]: row.status === 'PROCESSED',
                          [styles.suspicious]: row.status === 'SUSPICIOUS',
                          [styles.canceled]: row.status === 'CANCELED',
                          [styles.completed]: row.status === 'COMPLETED',
                          [styles.failed]: row.status === 'FAILED'
                        })}
                      />
                      {DeliveryStatuses[row.status]}
                    </TableCell>
                    <TableCell className={styles.tips}>
                      {row.tips ? `$${Number(row.tips.amount).toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className={styles.earned} align="right">
                      ${row.payout ? Number(row.payout.amount).toFixed(2) : '0.00'}
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className={styles.courierInfoWrapper}>
      {renderHeaderBlock()}
      {renderCourierInfo()}
      {isLoading ? null : renderFooter()}
      {!isLoading && courier.status === 'ACTIVE'
        ? renderLastDeliveryHistory(`/dashboard/couriers/${id}/deliveries`)
        : null}

      <ConfirmationModal
        title={'CheckR request'}
        subtitle={`Send checkR link to courier?`}
        isOpen={checkRModal}
        handleModal={toggleCheckRModal}
        loading={checkRCreateLoading}
        onConfirm={handleCreateCheckRCandidate}
      />
    </div>
  );
};
