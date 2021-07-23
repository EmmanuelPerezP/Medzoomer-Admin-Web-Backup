import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Divider as DividerBase, Typography } from '@material-ui/core';
import useSettingsGP from '../../hooks/useSettingsGP';
import Pagination from '../common/Pagination';
import SVGIcon from '../common/SVGIcon';
import styles from './InvoiceQueueDetails.module.sass';
import { WrapperTable } from './components/WrapperTable';
import { InvoiceDetails as CInvoiceDetails } from './components/InvoiceDetails';
import { ResendButton } from './components/ResendButton';
import { DeliverySearch } from './components/DeliverySearch';
import { DeliveriesTable } from './components/DeliveriesTable';
import { PharmacyGroupTable } from './components/PharmacyGroupTable';
import { PharmacyDetails } from './components/PharmacyDetails';
import Loading from '../common/Loading';

const PER_PAGE: number = 10;

const Divider = ({ size = 20 }) => <DividerBase style={{ height: size, backgroundColor: 'transparent' }} />;

export const InvoiceQueueDetails = () => {
  const {
    params: { id }
  } = useRouteMatch<{ id: string }>();

  const { reSendInvoice, getInvoiceQueueDetails } = useSettingsGP();
  const [isLoadingMainInfo, setIsLoadingMainInfo] = useState<boolean>(true);
  const [queueInfo, setQueueInfo] = useState();

  const history = useHistory();

  const getDetail = useCallback(async () => {
    setIsLoadingMainInfo(true);
    try {
      const dataRes = await getInvoiceQueueDetails({ id });
      setQueueInfo(dataRes.data);
      setIsLoadingMainInfo(false);
    } catch (err) {
      console.error(err);
      setIsLoadingMainInfo(false);
    }
  }, [getInvoiceQueueDetails, id]);

  const sendInvoice = useCallback(
    async (idQ: string) => {
      setIsLoadingMainInfo(true);
      try {
        await reSendInvoice(idQ);
        setIsLoadingMainInfo(false);
      } catch (err) {
        console.error(err);
        setIsLoadingMainInfo(false);
      } finally {
        history.push('/dashboard/invoice_history');
      }
    },
    [reSendInvoice, id]
  );

  useEffect(() => {
    getDetail().catch();
  }, [id]);

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.navigation}>
        <Link to={`/dashboard/invoice_queue/`}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={classNames(styles.title, styles.titleInCenter)}>Queue Details</Typography>
      </div>
    </div>
  );

  const renderInvoiceInfo = () => {
    return (
      <WrapperTable
        HeaderRightComponent={
          <ResendButton
            onClick={() => {
              sendInvoice(queueInfo._id).catch();
            }}
            ownKey="re-send-buton"
          />
        }
        iconName="queue"
        title="Queue ID"
        subTitle={queueInfo && queueInfo.queue_id}
        biggerIcon
      >
        <CInvoiceDetails queue={queueInfo} isLoading={isLoadingMainInfo} />
      </WrapperTable>
    );
  };

  const renderDeliveriesInfo = () => {
    return (
      <WrapperTable
        iconName="play"
        title="Attempts"
        subTitle={``} // TODO - paste valid data
        biggerIcon
      >
        <DeliveriesTable attempts={queueInfo && queueInfo.dataHistory ? queueInfo.dataHistory : []} />
      </WrapperTable>
    );
  };

  return (
    <div className={styles.BillingAccountWrapper}>
      {renderHeader()}
      <div className={styles.content}>
        {renderInvoiceInfo()}
        <Divider />
        {renderDeliveriesInfo()}
      </div>
    </div>
  );
};
