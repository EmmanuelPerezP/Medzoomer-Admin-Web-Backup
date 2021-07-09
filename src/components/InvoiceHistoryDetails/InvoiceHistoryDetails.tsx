import React, { useCallback, useEffect, useState } from 'react';

import useSettingsGP from '../../hooks/useSettingsGP';

import DeliveriesLogTable from './components/DeliveriesLogTable';
import { useHistory, useRouteMatch } from 'react-router';
export const InvoiceHistoryDetails = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const { getInvoiceDeliveriesByQueue, reSendInvoice } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [queueInfo, setQueueInfo] = useState();
  const [page, setPage] = useState(0);
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

  useEffect(() => {
    getQueueList().catch();
    // eslint-disable-next-line
  }, [id]);

  return (
    <DeliveriesLogTable
      page={page}
      filteredCount={totalCount}
      handleChangePage={handleChangePage}
      clickBackTo={`/dashboard/invoice_history/`}
      logTitle={'Log of Deliveries'}
      perPage={20}
      data={data}
      sendInvoice={sendInvoice}
      queueInfo={queueInfo}
      isLoading={isLoading}
      dataEmptyMessage={'There is no delivery history yet'}
      isDeliveries
      titleInCenter
    />
  );
};
