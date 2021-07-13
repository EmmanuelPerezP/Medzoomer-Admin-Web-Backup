import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Divider as DividerBase, Typography } from '@material-ui/core';
import useSettingsGP from '../../hooks/useSettingsGP';
import Pagination from '../common/Pagination';
import SVGIcon from '../common/SVGIcon';
import styles from './InvoiceDetails.module.sass';
import { WrapperTable } from '../InvoiceHistoryDetails/components/WrapperTable';
import { InvoiceDetails as CInvoiceDetails } from '../InvoiceHistoryDetails/components/InvoiceDetails';
import { ResendButton } from '../InvoiceHistoryDetails/components/ResendButton';
import { DeliverySearch } from '../InvoiceHistoryDetails/components/DeliverySearch';
import { DeliveriesTable } from '../InvoiceHistoryDetails/components/DeliveriesTable';
import { PharmacyGroupTable } from '../InvoiceHistoryDetails/components/PharmacyGroupTable';
import { PharmacyDetails } from './components/PharmacyDetails';

const PER_PAGE: number = 10;

const Divider = ({ size = 20 }) => <DividerBase style={{ height: size, backgroundColor: 'transparent' }} />;

export const InvoiceDetails = () => {
  const {
    params: { id }
  } = useRouteMatch<{ id: string }>();
  const { getInvoiceDeliveriesByQueue, reSendInvoice } = useSettingsGP();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [queueInfo, setQueueInfo] = useState();
  const [page, setPage] = useState<number>(0);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  const [deliverySearch, setDeliverySearch] = useState<string>('');

  const history = useHistory();

  const getQueueList = useCallback(async () => {
    setIsLoading(true);
    try {
      const dataRes = await getInvoiceDeliveriesByQueue({
        id,
        page
      });
      setData(dataRes.data);
      setQueueInfo(dataRes.queueInfo);
      // const arr: any = [...dataRes.data, ...dataRes.data, ...dataRes.data, ...dataRes.data];
      // setData(arr);
      setTotalCount(dataRes.totalCount);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getInvoiceDeliveriesByQueue, id]);

  const sendInvoice = useCallback(
    async (idQ: string) => {
      setIsLoading(true);
      try {
        await reSendInvoice(idQ);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      } finally {
        history.push('/dashboard/invoice_history');
      }
    },
    [getInvoiceDeliveriesByQueue, id]
  );

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  const handleChangeSearch = (text: string) => {
    setDeliverySearch(text);
  };

  useEffect(() => {
    getQueueList().catch();
    // eslint-disable-next-line
  }, [id]);

  const handleResend = () => {
    // tslint:disable-next-line:no-console
    console.log('clicked');
  };

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
        HeaderRightComponent={<ResendButton onClick={handleResend} ownKey="re-send-buton" />}
        iconName="invoicing"
        title="Invoice ID"
        subTitle={id}
        biggerIcon
      >
        <CInvoiceDetails invoice={{}} />
      </WrapperTable>
    );
  };

  const renderDeliveriesInfo = () => {
    return (
      <WrapperTable
        iconName="delivery"
        title="Delivery Detail"
        subTitle={`${42} Deliveries`} // TODO - paste valid data
        HeaderRightComponent={
          <DeliverySearch
            onChangeSearchValue={handleChangeSearch}
            searchValue={deliverySearch}
            amount={'546.344353'} // TODO - pase valid data
          />
        }
        BottomRightComponent={
          <Pagination page={page} onChangePage={setPage} filteredCount={filteredCount} rowsPerPage={PER_PAGE} />
        }
        biggerIcon
      >
        <DeliveriesTable deliveries={[]} />
      </WrapperTable>
    );
  };

  const renderBillingsInfo = () => {
    return (
      <WrapperTable
        iconName="pharmacyBilling"
        title="Pharmacy"
        subTitle={`CVS Pharmacy`} // TODO - paste valid data
      >
        <PharmacyDetails pharmacy={{}} />
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
        <Divider />
        {renderBillingsInfo()}
      </div>
    </div>
  );
};
