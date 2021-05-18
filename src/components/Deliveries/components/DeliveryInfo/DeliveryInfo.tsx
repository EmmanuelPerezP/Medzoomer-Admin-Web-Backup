import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { DELIVERY_STATUS, DeliveryStatuses, URL_TO_ONFLEET_SIGNATURE } from '../../../../constants';
import useDelivery from '../../../../hooks/useDelivery';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import ImageDelivery from '../../../common/ImageDelivery';
import { ConfirmationModal } from '../../../common/ConfirmationModal/ConfirmationModal';
import Image from '../../../common/Image';

import styles from './DeliveryInfo.module.sass';

export const DeliveryInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const [isLoading, setIsLoading] = useState(true);
  const {
    delivery,
    getDelivery,
    sendTaskToOnfleet,
    canceledOrder,
    completedOrder,
    failedOrder,
    forcedInvoicedOrder
  } = useDelivery();
  const [deliveryInfo, setDeliveryInfo] = useState(delivery);
  const [note, setNote] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState<boolean>(false);
  const [completedModalOpen, setCompletedModalOpen] = useState(false);
  const [forcedInvoicedModalOpen, setForcedInvoicedModalOpen] = useState(false);

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
    setIsLoading(true);
    await sendTaskToOnfleet(id);
    window.location.href = '/dashboard/orders';
  }, [id, sendTaskToOnfleet]);

  const handleCanceledOrder = useCallback(async () => {
    setIsLoading(true);
    await canceledOrder(deliveryInfo.order._id);
    window.location.href = '/dashboard/orders';
  }, [deliveryInfo, canceledOrder]);

  const handleFailOrder = useCallback(async () => {
    setIsLoading(true);
    await failedOrder(deliveryInfo.order._id);
    window.location.href = '/dashboard/orders';
  }, [deliveryInfo, failedOrder]);

  const handleCompletedOrder = useCallback(async () => {
    setIsLoading(true);
    await completedOrder(deliveryInfo.order._id);
    window.location.href = '/dashboard/orders';
  }, [deliveryInfo, completedOrder]);

  const handleForcedInvoiced = useCallback(async () => {
    setIsLoading(true);
    await forcedInvoicedOrder(deliveryInfo.order._id);
    window.location.href = '/dashboard/orders';
    // eslint-disable-next-line
  }, [deliveryInfo, completedOrder]);

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

  const handleCancelOrderPopup = () => {
    setCancelModalOpen(!cancelModalOpen);
  };

  const handleFailOrderPopup = () => {
    setFailModalOpen(!failModalOpen);
  };

  const handleCompletedOrderPopup = () => {
    setCompletedModalOpen(!completedModalOpen);
  };

  const handleForcedInvoicedPopup = () => {
    setForcedInvoicedModalOpen(!forcedInvoicedModalOpen);
  };

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

  const renderMainInfo = () => (
    <>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Created</div>
        {moment(deliveryInfo.createdAt).format('MM/DD/YYYY')}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Status</div>
        {deliveryInfo.status}
      </div>
      {/* <div className={styles.parametrsAndValues}>
          <div className={styles.params}>Delivery Time</div>
          {deliveryInfo.deliveryTime}
        </div> */}
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Consumer</div>
        <Link to={`/dashboard/consumers/${deliveryInfo.customer._id}`}>
          {deliveryInfo.customer.name} {deliveryInfo.customer.family_name}
        </Link>
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Pharmacy</div>
        {deliveryInfo.pharmacy ? (
          <Link to={`/dashboard/pharmacies/${deliveryInfo.pharmacy._id}`}>{deliveryInfo.pharmacy.name}</Link>
        ) : (
          <div>-</div>
        )}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Courier</div>
        {deliveryInfo.user ? (
          <Link to={`/dashboard/couriers/${deliveryInfo.user._id}`}>
            {deliveryInfo.user.name} {deliveryInfo.user.family_name}
          </Link>
        ) : (
          <div>-</div>
        )}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Pharmacist</div>
        {deliveryInfo.order && deliveryInfo.order.pharmacist
          ? `${deliveryInfo.order.pharmacist.name} ${deliveryInfo.order.pharmacist.family_name} ${
              deliveryInfo.order.pharmacist.jobTitle ? `(${deliveryInfo.order.pharmacist.jobTitle})` : ''
            }`
          : '-'}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Order ID</div>
        {deliveryInfo.order_uuid}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Prescriptions</div>
        {note}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Note Delivery</div>
        {deliveryInfo.errorNotes}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Onfleet Task ID</div>
        {deliveryInfo.taskIds && deliveryInfo.taskIds.length ? deliveryInfo.taskIds.join(',') : '-'}
      </div>
      {/* <div className={styles.parametrsAndValues}>
          <div className={styles.params}>is Completed</div> {deliveryInfo.isCompleted}
        </div> */}
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Distance to Pharmacy</div>
        {deliveryInfo.distToPharmacy}
      </div>
      <div className={styles.parametrsAndValues}>
        <div className={styles.params}>Special Delivery Requirements</div>
        {deliveryInfo.order.notes || '-'}
      </div>
    </>
  );

  const getSignatureBlock = () => {
    if (deliveryInfo.signature) {
      return (
        <Image
          className={styles.img}
          alt={'Signature'}
          src={deliveryInfo.signature}
          // width={300}
          // height={300}
          cognitoId={deliveryInfo.customer._id}
          isPreview={true}
        />
      );
    } else if (deliveryInfo.signatureUploadId) {
      return (
        <ImageDelivery
          key={`signature-photo`}
          isPreview={true}
          className={styles.img}
          src={`${URL_TO_ONFLEET_SIGNATURE}/${deliveryInfo.signatureUploadId}/800x.png`}
          alt={'No signature'}
        />
      );
    } else {
      return null;
    }
  };

  const renderVehiclePhotos = () => {
    return (
      <div className={styles.documents}>
        {(!!deliveryInfo.signatureUploadId || !!deliveryInfo.signature) && (
          <div className={styles.document}>
            <Typography className={styles.label}>Signature</Typography>
            <div className={styles.photo}>{getSignatureBlock()}</div>
          </div>
        )}
        {deliveryInfo.photoUploadIds &&
          deliveryInfo.photoUploadIds.map((value: any, index: number) => {
            return (
              // tslint:disable-next-line:jsx-key
              <div className={styles.document}>
                <Typography className={styles.label}>{`Photo ${index + 1}`}</Typography>
                <div className={styles.photo}>
                  <ImageDelivery
                    key={`${index}-photo`}
                    isPreview={true}
                    className={styles.img}
                    src={`${URL_TO_ONFLEET_SIGNATURE}/${value}/800x.png`}
                    alt={'No signature'}
                  />
                </div>
              </div>
            );
          })}
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
                <div className={styles.divider} />
                <div className={styles.statusesWrapper}>
                  <Typography className={styles.status}>
                    <span
                      className={classNames(styles.statusColor, {
                        [styles.active]: deliveryInfo.status === DELIVERY_STATUS.COMPLETED,
                        [styles.declined]: deliveryInfo.status === DELIVERY_STATUS.DECLINED,
                        [styles.pending]: deliveryInfo.status === DELIVERY_STATUS.PENDING,
                        [styles.processed]: deliveryInfo.status === DELIVERY_STATUS.PROCESSED,
                        [styles.canceled]: deliveryInfo.status === DELIVERY_STATUS.CANCELED,
                        [styles.failed]: deliveryInfo.status === DELIVERY_STATUS.FAILED
                      })}
                    />
                    {DeliveryStatuses[deliveryInfo.status]}
                  </Typography>
                </div>

                {deliveryInfo.status !== DELIVERY_STATUS.CANCELED ? (
                  <>
                    <div className={styles.divider} />
                    <div className={styles.statusesWrapper}>
                      <Button
                        className={styles.btnSendTo}
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        onClick={handleCancelOrderPopup}
                      >
                        <Typography className={styles.summaryText}>Cancel</Typography>
                      </Button>
                    </div>
                  </>
                ) : null}
                {deliveryInfo.status === 'PENDING' && deliveryInfo.order.status === 'ready' ? (
                  <>
                    <div className={styles.divider} />
                    <div className={styles.statusesWrapper}>
                      <Button
                        className={styles.btnSendTo}
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        onClick={handleFailOrderPopup}
                      >
                        <Typography className={styles.summaryText}>Mark as Failed</Typography>
                      </Button>
                    </div>
                  </>
                ) : null}
                {deliveryInfo.status !== 'COMPLETED' && deliveryInfo.user ? (
                  <>
                    <div className={styles.divider} />
                    <div className={styles.statusesWrapper}>
                      <Button
                        className={styles.btnSendTo}
                        variant="contained"
                        color="secondary"
                        disabled={isLoading}
                        onClick={handleCompletedOrderPopup}
                      >
                        <Typography className={styles.summaryText}>Complete</Typography>
                      </Button>
                    </div>
                  </>
                ) : null}
              </div>
              <>
                <div className={styles.personalInfo}>
                  {renderMainInfo()}
                  {renderVehiclePhotos()}
                </div>
              </>
              <div className={styles.deliveryBtn}>
                {deliveryInfo.status === 'PENDING' && deliveryInfo.order.status === 'ready' ? (
                  <div className={styles.statusesWrapper}>
                    <Button
                      className={styles.btnSendTo}
                      variant="contained"
                      color="secondary"
                      disabled={isLoading}
                      onClick={handleSendTaskInOnfleet}
                    >
                      <Typography className={styles.summaryText}>Send to Onfleet</Typography>
                    </Button>
                    <div className={styles.divider} />
                  </div>
                ) : null}
                {deliveryInfo.income || deliveryInfo.forcedIncome ? (
                  <div>Order was successfully added to the invoice.</div>
                ) : (
                  <div className={styles.statusesWrapper}>
                    <Button
                      className={styles.btnSendTo}
                      variant="contained"
                      color="secondary"
                      disabled={isLoading}
                      onClick={handleForcedInvoicedPopup}
                    >
                      <Typography className={styles.summaryText}>Add to Invoice</Typography>
                    </Button>
                  </div>
                )}
              </div>
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
      <ConfirmationModal
        isOpen={cancelModalOpen}
        handleModal={handleCancelOrderPopup}
        onConfirm={handleCanceledOrder}
        loading={isLoading}
        title={'Do you really want to cancel the order?'}
      />
      <ConfirmationModal
        isOpen={failModalOpen}
        handleModal={handleFailOrderPopup}
        onConfirm={handleFailOrder}
        loading={isLoading}
        title={'Do you really want to mark as Failed the order?'}
      />
      <ConfirmationModal
        isOpen={completedModalOpen}
        handleModal={handleCompletedOrderPopup}
        onConfirm={handleCompletedOrder}
        loading={isLoading}
        title={'Do you really want to COMPLETE the order?'}
      />
      <ConfirmationModal
        isOpen={forcedInvoicedModalOpen}
        handleModal={handleForcedInvoicedPopup}
        onConfirm={handleForcedInvoiced}
        loading={isLoading}
        title={'Do you really want to send forced invoice for this order?'}
      />
    </div>
  );
};
