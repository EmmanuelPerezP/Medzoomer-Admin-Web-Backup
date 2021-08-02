import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Divider as DividerBase, Typography } from '@material-ui/core';
import useSettingsGP from '../../hooks/useSettingsGP';
import Pagination from '../common/Pagination';
import SVGIcon from '../common/SVGIcon';
import styles from './InvoiceDetails.module.sass';
import { WrapperTable } from './components/WrapperTable';
import { InvoiceDetails as CInvoiceDetails } from './components/InvoiceDetails';
import { ResendButton } from './components/ResendButton';
import { DeliverySearch } from './components/DeliverySearch';
import { DeliveriesTable } from './components/DeliveriesTable';
import { PharmacyGroupTable } from './components/PharmacyGroupTable';
import { PharmacyDetails } from './components/PharmacyDetails';
import Loading from '../common/Loading';
import { ExportButton } from './components/ExportButton';

const PER_PAGE: number = 10;

const Divider = ({ size = 20 }) => <DividerBase style={{ height: size, backgroundColor: 'transparent' }} />;

export const InvoiceDetails = () => {
  const {
    params: { id }
  } = useRouteMatch<{ id: string }>();
  const { getInvoiceDeliveriesByQueue, reSendInvoice, getInvoiceHistoryDetails } = useSettingsGP();
  const [isLoadingMainInfo, setIsLoadingMainInfo] = useState<boolean>(true);
  const [isLoadingDelivery, setIsLoadingDelivery] = useState<boolean>(true);
  const [deliveries, setDeliveries] = useState([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [queueInfo, setQueueInfo] = useState();
  const [page, setPage] = useState<number>(0);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  const [deliverySearch, setDeliverySearch] = useState<string>('');

  const history = useHistory();

  const getDetail = useCallback(async () => {
    setIsLoadingMainInfo(true);
    try {
      const dataRes = await getInvoiceHistoryDetails({ id });
      setQueueInfo(dataRes.data);
      setIsLoadingMainInfo(false);
    } catch (err) {
      console.error(err);
      setIsLoadingMainInfo(false);
    }
  }, [getInvoiceHistoryDetails, id]);

  const getDeliveryList = useCallback(async () => {
    setIsLoadingDelivery(true);
    try {
      const dataRes = await getInvoiceDeliveriesByQueue({
        id,
        page,
        search: deliverySearch
      });
      setDeliveries(dataRes.data);
      setTotalCount(dataRes.totalCount);
      setFilteredCount(dataRes.totalCountFilter);
      setIsLoadingDelivery(false);
    } catch (err) {
      console.error(err);
      setIsLoadingDelivery(false);
    }
  }, [getInvoiceDeliveriesByQueue, id, page, deliverySearch]);

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

  const handleChangeSearch = (text: string) => {
    setDeliverySearch(text);
  };

  useEffect(() => {
    getDetail().catch();
  }, [id]);

  useEffect(() => {
    getDeliveryList().catch();
  }, [page, deliverySearch]);

  const renderHeader = () => (
    <div className={styles.header}>
      <div className={styles.navigation}>
        <Link to={`/dashboard/invoice_history/`}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>

        <Typography className={classNames(styles.title, styles.titleInCenter)}>Invoice Details</Typography>
      </div>
    </div>
  );

  const renderInvoiceInfo = () => {
    return (
      <WrapperTable
        HeaderRightComponent={
          <>
            <ResendButton
              onClick={() => {
                sendInvoice(queueInfo.queue._id).catch();
              }}
              ownKey="re-send-buton"
            />
          </>
        }
        iconName="invoicing"
        title="Invoice Number"
        subTitle={queueInfo && queueInfo.invoicedNumber}
        biggerIcon
      >
        <CInvoiceDetails invoice={queueInfo} isLoading={isLoadingMainInfo} />
      </WrapperTable>
    );
  };
  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  const renderDeliveriesInfo = () => {
    if (queueInfo && queueInfo.status === 'No Orders') {
      return null;
    }

    return (
      <WrapperTable
        iconName="delivery"
        title="Delivery Detail"
        subTitle={`${totalCount ? totalCount : 0} Deliveries`} // TODO - paste valid data
        HeaderRightComponent={
          <DeliverySearch
            onChangeSearchValue={handleChangeSearch}
            searchValue={deliverySearch}
            amount={!isLoadingMainInfo && queueInfo.amount ? `$${Number(queueInfo.amount).toFixed(2)}` : '-'} // TODO - pase valid data
          />
        }
        BottomRightComponent={
          !isLoadingDelivery ? (
            <>
              <Pagination
                page={page}
                onChangePage={handleChangePage}
                filteredCount={filteredCount}
                rowsPerPage={PER_PAGE}
              />
              {queueInfo && queueInfo.urlToFileReport ? <ExportButton href={queueInfo.urlToFileReport} /> : null}
            </>
          ) : null
        }
        biggerIcon
      >
        {isLoadingDelivery ? (
          <div className={classNames(styles.center)}>
            {' '}
            <Loading />{' '}
          </div>
        ) : (
          <DeliveriesTable deliveries={deliveries || []} />
        )}
      </WrapperTable>
    );
  };

  const renderBillingsInfo = () => {
    if (queueInfo) {
      return (
        <WrapperTable
          iconName="pharmacyBilling"
          title={queueInfo.owner.type === 'group' ? 'Group' : 'Pharmacy'}
          subTitle={queueInfo.owner.name}
        >
          {queueInfo.owner.type === 'pharmacy' ? (
            <PharmacyDetails pharmacy={queueInfo.owner} />
          ) : (
            <PharmacyGroupTable data={queueInfo.info || {}} />
          )}
        </WrapperTable>
      );
    }
    return null;
  };

  return (
    <div className={styles.BillingAccountWrapper}>
      {renderHeader()}
      <div className={styles.content}>
        {renderInvoiceInfo()}
        <Divider />
        {renderDeliveriesInfo()}
        <Divider />
        {renderBillingsInfo()}
      </div>
    </div>
  );
};
