import { Button, Grid, IconButton, InputAdornment } from '@material-ui/core';
import React, { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { Wrapper } from '../../../OrderDetails/components/Wrapper';
import { ITaskInfoProps } from './types';
import styles from './TaskInfo.module.sass';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Input from '../../../common/Input';
import SVGIcon from '../../../common/SVGIcon';
import ConfirmationModal from '../../../common/ConfirmationModal';
import useDelivery from '../../../../hooks/useDelivery';

const buttonStyles = {
  fontSize: 13,
  paddingTop: 5,
  paddingBottom: 5,
  paddingRight: 12,
  paddingLeft: 12,
  fontWeight: 500
};

const ReturnCashDelimeter = 'IS_RETURN_CASH';

export const TaskInfo: FC<ITaskInfoProps> = ({ item }) => {
  const {
    completedOrder,
    forcedInvoicedOrder,
    failedOrder,
    sendSignatureLink,
  } = useDelivery();
  const [isLoading, setIsLoading] = useState(false);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [forcedInvoicedModalOpen, setForcedInvoicedModalOpen] = useState(false);
  const [sendSignatureModalOpen, setSendSignatureModalOpen] = useState(false);

  const handleAddInvoicedPopup = () => {
    setForcedInvoicedModalOpen(!forcedInvoicedModalOpen);
  };

  const handleFailOrderPopup = () => {
    setFailModalOpen(!failModalOpen);
  };

  const handleSendSignatureLinkPopup = () => {
    setSendSignatureModalOpen(!sendSignatureModalOpen);
  };

  const handleAddInvoiced = useCallback(async () => {
    if (item) {
      setIsLoading(true);
      await forcedInvoicedOrder(item._id);
      window.location.href = '/dashboard/deliveries';
    }
    // tslint:disable-next-line:no-console
    else console.log('Error while handleAddInvoiced: Delivery does not have order field');
    // eslint-disable-next-line
  }, [item, completedOrder]);

  const handleFailOrder = useCallback(async () => {
    // if (isCopay) {
    //   setIsLoading(true);
    //   await failedOrder(`${ReturnCashDelimeter}=${(item as any)._id}`);
    //   window.location.href = '/dashboard/orders';
    // } else {
    //   if (item && item.order) {
    //     setIsLoading(true);
    //     await failedOrder(item.order._id);
    //     window.location.href = '/dashboard/orders';
    //   }
    //   // tslint:disable-next-line:no-console
    //   else console.log('Error while handleFailOrder: Delivery does not have order field');
    // }
  }, []);

  const handleSendSignatureLink = useCallback(async () => {
    setIsLoading(true);
    await sendSignatureLink(item.id);
    // window.location.href = '/dashboard/orders';
    setIsLoading(false);
    setSendSignatureModalOpen(false);
    // eslint-disable-next-line
  }, [item]);

  const status = useMemo(() => {
    switch (item.status) {
      case 'assigned':
        return 'Assigned';
      default:
        return 'Assigned';
    }
  }, [item.status]);

  return (
    <Wrapper
      title="Task ID"
      subTitle={`${item._id}`}
      iconName="locationPin"
      HeaderRightComponent={
        <Grid container spacing={2}>
          {item.status !== 'complete'}{' '}
          {
            <Grid item>
              <Button onClick={handleAddInvoicedPopup} variant="contained" size="small" color="secondary" style={buttonStyles}>
                Add to Invoice
              </Button>
            </Grid>
          }
          <Grid item>
            <Button onClick={handleSendSignatureLinkPopup} variant="contained" size="small" color="secondary" style={buttonStyles}>
              Send E-Signature
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={handleFailOrderPopup} variant="contained" size="small" color="primary" style={buttonStyles}>
              Mark as Failed
            </Button>
          </Grid>
        </Grid>
      }
    >
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.label}>Task Status</div>
          <div className={classNames(styles.value, styles.rowValue)}>
            <div
              className={classNames(styles.itemStatus, {
                [styles.assigned]: item.status === 'assigned'
              })}
            />
            {status}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Courier</div>
          <div className={styles.value}>
            <Link to={`/dashboard/couriers/${item.courier._id}`} className={styles.link}>
              {item.courier.fullName}
            </Link>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Task Type</div>
          <div className={styles.value}>{item.type}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Onfleet Link</div>
          <div className={styles.value}>
            <Link to={`/dashboard/${item.onfleetLink}`} className={styles.link}>
              Link
            </Link>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Onfleet Distance</div>
          <div className={styles.value}>{item.onfleetDistance}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Google Maps Distance</div>
          <div className={styles.value}>{item.googleMapsDistance}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Price for this delivery leg (based on Onfleet distance)</div>
          <div className={styles.value}>{`$ ${Number(item.price).toFixed(2)}`}</div>
        </div>

        <div className={styles.underline} />

        <div className={styles.row}>
          <div className={styles.label}>Courier Delivery Price</div>
          <div className={styles.value}>
            <Input
              className={styles.minInput}
              endAdornment={
                <InputAdornment style={{ marginRight: 9 }} position="end">
                  $
                </InputAdornment>
              }
              aria-describedby="standard-weight-helper-text"
            />
            <IconButton size="small">
              <SVGIcon name={'refresh'} />
            </IconButton>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Pharmacy Delivery Price</div>
          <div className={styles.value}>
            <Input
              className={styles.minInput}
              endAdornment={
                <InputAdornment style={{ marginRight: 9 }} position="end">
                  $
                </InputAdornment>
              }
              aria-describedby="standard-weight-helper-text"
            />
            <IconButton size="small">
              <SVGIcon name={'refresh'} />
            </IconButton>
          </div>
        </div>

        <div className={styles.underline} />

        <div className={styles.row}>
          <div className={styles.label}>Invoice Status</div>
          <div className={styles.value}>
            {/* {true ? ( */}
            <Fragment>
              <SVGIcon name="checkmark" />
              <p className={styles.queue}>Sent to queue</p>
              <Button size="small" color="secondary">
                Remove
              </Button>
            </Fragment>
            {/* ) : (
              <p className={styles.notSent}>Not Sent</p>
            )} */}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={forcedInvoicedModalOpen}
        handleModal={handleAddInvoicedPopup}
        onConfirm={handleAddInvoiced}
        loading={isLoading}
        title={'Do you really want to send invoice?'}
      />

      <ConfirmationModal
        isOpen={failModalOpen}
        handleModal={handleFailOrderPopup}
        onConfirm={handleFailOrder}
        loading={isLoading}
        title={'Do you really want to mark as Failed the order?'}
      />

      <ConfirmationModal
        isOpen={sendSignatureModalOpen}
        handleModal={handleSendSignatureLinkPopup}
        onConfirm={handleSendSignatureLink}
        loading={isLoading}
        title={'Do you really want to send SMS with link for signature?'}
      />

    </Wrapper>
  );
};
