import { Button, Grid, IconButton, InputAdornment } from '@material-ui/core';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { ITaskInfoProps } from './types';
import styles from './TaskInfo.module.sass';
import classNames from 'classnames';
import { Link, useRouteMatch } from 'react-router-dom';
import Input from '../../../common/Input';
import SVGIcon from '../../../common/SVGIcon';
import ConfirmationModal from '../../../common/ConfirmationModal';
import useDelivery from '../../../../hooks/useDelivery';
import { TDeliveryStatuses, User } from '../../../../interfaces';
import { emptyChar, getOnfleetTaskLink, isPopulatedObject } from '../../utils';
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

const ReturnCashDelimeter = 'IS_RETURN_CASH';

export const TaskInfo: FC<ITaskInfoProps> = ({ delivery, updateDeliveryInfo, getHistory }) => {
  const {
    params: { id }
  }: any = useRouteMatch();
  const { completedOrder, forcedInvoicedOrder, failedOrder, sendSignatureLink, setForcedPrice } = useDelivery();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPriceCourier, setIsLoadingPriceCourier] = useState(false);
  const [isLoadingPricePharmacy, setIsLoadingPricePharmacy] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [forcedInvoicedModalOpen, setForcedInvoicedModalOpen] = useState(false);
  const [sendSignatureModalOpen, setSendSignatureModalOpen] = useState(false);
  const [forcedPriceForCourier, setForcedPriceForCourier] = useState<string | number>();
  const [forcedPriceForPharmacy, setForcedPriceForPharmacy] = useState<string | number | null>(null);

  const deliveryStatus = delivery.status as TDeliveryStatuses;
  const isCopay = useMemo(() => delivery.type === 'RETURN_CASH' || !!delivery.order.returnCash, [delivery]);
  const canShowForcedInvoice = useMemo(() => !(delivery.income || delivery.forcedIncome), [
    delivery.income,
    delivery.forcedIncome
  ]);

  const handleAddInvoicedPopup = () => {
    setForcedInvoicedModalOpen(!forcedInvoicedModalOpen);
  };

  const handleFailOrderPopup = () => {
    setFailModalOpen(!failModalOpen);
  };

  const handleSendSignatureLinkPopup = () => {
    setSendSignatureModalOpen(!sendSignatureModalOpen);
  };

  const [courier, courierId, haveCourier]: [User | string, string | null, boolean] = useMemo(() => {
    const user = delivery.user;
    if (!user) return [emptyChar, null, false];
    if (isPopulatedObject(user)) {
      return [`${user.name} ${user.family_name}`, user._id, true];
    }
    return [user, (user as unknown) as string, true];
  }, [delivery.user]);

  const handleAddInvoiced = useCallback(async () => {
    if (delivery && delivery.order) {
      setIsLoading(true);
      setForcedInvoicedModalOpen(false);
      await forcedInvoicedOrder(delivery.order._id);
      updateDeliveryInfo();
      setIsLoading(false);
    }
    // tslint:disable-next-line:no-console
    else console.log('Error while handleAddInvoiced: Delivery does not have order field');
    // eslint-disable-next-line
  }, [delivery, completedOrder]);

  const handleFailOrder = useCallback(async () => {
    if (isCopay) {
      setIsLoading(true);
      setFailModalOpen(false);
      await failedOrder(`${ReturnCashDelimeter}=${id}`);
      updateDeliveryInfo();
      setIsLoading(false);
    } else {
      if (delivery && delivery.order) {
        setIsLoading(true);
        setFailModalOpen(false);
        await failedOrder(delivery.order._id);
        updateDeliveryInfo();
        setIsLoading(false);
      }
      // tslint:disable-next-line:no-console
      else console.log('Error while handleFailOrder: Delivery does not have order field');
    }
  }, [delivery, failedOrder]);

  const handleSendSignatureLink = useCallback(async () => {
    setIsLoading(true);
    setSendSignatureModalOpen(false);
    await sendSignatureLink(id);
    updateDeliveryInfo();
    setIsLoading(false);
    // eslint-disable-next-line
  }, [delivery]);

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
  }, [deliveryStatus]);

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
    if (delivery.payout) {
      return `$${Number(delivery.payout.amount).toFixed(2)}`;
    }
    return emptyChar;
  }, [delivery.forcedPriceForCourier, delivery.payout]);

  const handleSetForcePrices = useCallback(
    async (type) => {
      const isCourier = type === 'courier';
      isCourier ? setIsLoadingPriceCourier(true) : setIsLoadingPricePharmacy(true);
      await setForcedPrice({
        id,
        forcedPriceForCourier: Number(forcedPriceForCourier),
        forcedPriceForPharmacy: Number(forcedPriceForPharmacy),
        type
      });
      isCourier ? setIsLoadingPriceCourier(false) : setIsLoadingPricePharmacy(false);
      updateDeliveryInfo();
      getHistory();
    },
    // eslint-disable-next-line
    [id, forcedPriceForCourier, forcedPriceForPharmacy]
  );

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

  const subTitle = delivery.order_uuid ?
    {
      subTitle: delivery.order_uuid
    } : {};

  return (
    <Wrapper
      title="Task ID"
      {...subTitle}
      iconName="locationPin"
      HeaderRightComponent={
        isLoading ? (
          <Loading />
        ) : (
          <Grid container spacing={2} justify="flex-end">
            {canShowForcedInvoice && (
              <Grid item>
                <Button
                  onClick={handleAddInvoicedPopup}
                  variant="contained"
                  size="small"
                  color="secondary"
                  style={buttonStyles}
                >
                  Add to Invoice
                </Button>
              </Grid>
            )}
            {!isCopay && (
              <Grid item>
                <Button
                  onClick={handleSendSignatureLinkPopup}
                  variant="contained"
                  size="small"
                  color="secondary"
                  style={buttonStyles}
                >
                  Send E-Signature
                </Button>
              </Grid>
            )}
            {delivery.status === 'PENDING' && delivery.order.status === 'ready' ? (
              <Grid item>
                <Button
                  onClick={handleFailOrderPopup}
                  variant="contained"
                  size="small"
                  color="primary"
                  style={buttonStyles}
                >
                  Mark as Failed
                </Button>
              </Grid>
            ) : null}
          </Grid>
        )
      }
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Task Status</div>
          <div className={classNames(styles.value, styles.rowValue)}>
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
          <div className={styles.value}>
            {haveCourier ? (
              <Link to={`/dashboard/patients/${courierId}`} className={classNames(styles.link, styles.value)}>
                {courier}
              </Link>
            ) : (
              <div className={styles.value}>{courier}</div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Task Type</div>
          <div className={styles.value}>Drop Off</div>
        </div>

        {delivery.currentTaskId && (
          <div className={styles.row}>
            <div className={styles.label}>Onfleet Link</div>
            <div className={styles.value}>
              <a href={getOnfleetTaskLink(delivery.currentTaskId)} target="_blank" className={styles.link}>
                Link
              </a>
            </div>
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
          <div className={styles.value}>
            <Input
              className={styles.minInput}
              onChange={(e) => {
                setForcedPriceForCourier(e.target.value);
              }}
              // @ts-ignore
              value={forcedPriceForCourier >= 0 ? forcedPriceForCourier : null}
              type={'number'}
              endAdornment={
                <InputAdornment style={{ marginRight: 9 }} position="end">
                  $
                </InputAdornment>
              }
              aria-describedby="standard-weight-helper-text"
            />
            {isLoadingPriceCourier ? (
              <Loading size={20} className={styles.minLoading} />
            ) : (
              <IconButton size="small" onClick={() => handleSetForcePrices('courier')}>
                <SVGIcon name={'refresh'} />
              </IconButton>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Pharmacy Delivery Price</div>
          <div className={styles.value}>
            <Input
              className={styles.minInput}
              onChange={(e) => {
                setForcedPriceForPharmacy(e.target.value);
              }}
              // @ts-ignore
              value={forcedPriceForPharmacy >= 0 ? forcedPriceForPharmacy : ''}
              endAdornment={
                <InputAdornment style={{ marginRight: 9 }} position="end">
                  $
                </InputAdornment>
              }
              aria-describedby="standard-weight-helper-text"
            />
            {isLoadingPricePharmacy ? (
              <Loading size={20} className={styles.minLoading} />
            ) : (
              <IconButton size="small" onClick={() => handleSetForcePrices('pharmacy')}>
                <SVGIcon name={'refresh'} />
              </IconButton>
            )}
          </div>
        </div>

        <div className={styles.underline} />
        {renderTaskStatus()}
      </div>

      <ConfirmationModal
        isOpen={forcedInvoicedModalOpen}
        handleModal={handleAddInvoicedPopup}
        onConfirm={handleAddInvoiced}
        title={'Do you really want to send invoice?'}
      />

      <ConfirmationModal
        isOpen={failModalOpen}
        handleModal={handleFailOrderPopup}
        onConfirm={handleFailOrder}
        title={'Do you really want to mark as Failed the order?'}
      />

      <ConfirmationModal
        isOpen={sendSignatureModalOpen}
        handleModal={handleSendSignatureLinkPopup}
        onConfirm={handleSendSignatureLink}
        title={'Do you really want to send SMS with link for signature?'}
      />
    </Wrapper>
  );
};
