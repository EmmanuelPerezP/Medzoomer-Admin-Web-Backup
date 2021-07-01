import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';

import SVGIcon from '../../../common/SVGIcon';

import styles from './HistoryDeliveryModal.module.sass';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import Loading from '../../../common/Loading';
import Search from '../../../common/Search';
import Pagination from '../../../common/Pagination';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { DeliveryStatuses } from '../../../../constants';
import CourierLogTable from '../../../Couriers/components/CourierInfo/components/CourierLogTable';

export const HistoryDeliveryModal = ({
  historyData,
  onClose,
  isOpen,
  effort
}: {
  effort: any;
  historyData: any;
  onClose: any;
  isOpen: any;
}) => {
  const { getInvoiceDeliveriesByQueue } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);

  const getQueueList = useCallback(async () => {
    setIsLoading(true);
    try {
      const dataRes = await getInvoiceDeliveriesByQueue({
        id: effort,
        page
      });
      setData(dataRes.data);
      setTotalCount(dataRes.totalCount);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getInvoiceDeliveriesByQueue, historyData]);

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  useEffect(() => {
    getQueueList().catch();
    // eslint-disable-next-line
  }, [historyData]);

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={onClose}
      isOpen={isOpen}
      className={styles.modal}
    >
      <div className={styles.header}>
        <Typography className={styles.title}>
          History By {historyData.detail.queue.settingGP[0].name} ({historyData.detail.queue.deliveryStartDate} /{' '}
          {historyData.detail.queue.deliveryEndDate})
        </Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>

      <CourierLogTable
        page={page}
        filteredCount={totalCount}
        handleChangePage={handleChangePage}
        clickBackTo={``}
        logTitle={'Log of Deliveries'}
        perPage={20}
        data={data}
        isLoading={isLoading}
        dataEmptyMessage={'There is no delivery history yet'}
        isDeliveries
      />
    </Modal>
  );
};
