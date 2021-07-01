import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';

import SVGIcon from '../../../common/SVGIcon';

import styles from './HistoryModal.module.sass';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import Loading from '../../../common/Loading';
import Search from '../../../common/Search';
import Pagination from '../../../common/Pagination';
import Button from '@material-ui/core/Button';
import moment from 'moment';

export const HistoryModal = ({
  historyData,
  onClose,
  isOpen,
  openHistoryDelivery,
  setEfforthandler
}: {
  historyData: any;
  onClose: any;
  isOpen: any;
  openHistoryDelivery: any;
  setEfforthandler: any;
}) => {
  const { getInvoiceHistoryDetails, reSendInvoice } = useSettingsGP();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const getQueueList = useCallback(async () => {
    setIsLoading(true);
    try {
      const dataRes = await getInvoiceHistoryDetails({
        queueId: historyData.detail.queue._id
      });
      setData(dataRes.data);
      // const arr: any = [...dataRes.data, ...dataRes.data, ...dataRes.data, ...dataRes.data];
      // setData(arr);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [getInvoiceHistoryDetails, historyData]);

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
          <Button
            className={styles.buttonResend}
            variant="contained"
            onClick={() => {
              reSendInvoice(historyData.detail.queue._id)
                .then()
                .catch();
            }}
            color="secondary"
          >
            Resend
          </Button>
        </Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>

      {isLoading ? (
        <div className={styles.contentInLoader}>
          <div className={styles.loader}>
            <Loading />
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.tableHeader}>
              <div className={styles.tr}>Total Deliveries</div>
              <div className={styles.tr}>Amount</div>
              <div className={styles.tr}>InvoicedID</div>
              <div className={styles.tr}>Send Date</div>
              <div className={styles.tr}>Action</div>
            </div>
          </div>
          <div className={styles.billingAccount}>
            {data &&
              data.map((row: any) => {
                return (
                  <div key={row._id} className={styles.tableItem}>
                    <div className={styles.tr}> {row.deliveryIDCollection.length}</div>
                    <div className={styles.tr}> {row.amount}</div>
                    <div className={styles.tr}> {row.invoicedId}</div>
                    <div className={styles.tr}> {moment(row.createdAt).format('MM/DD/YYYY HH:mm')}</div>
                    <div className={styles.tr}>
                      <Button
                        className={styles.logDeliveries}
                        variant="contained"
                        onClick={() => {
                          setEfforthandler(row._id);
                          openHistoryDelivery(true);
                        }}
                        color="secondary"
                      >
                        log deliveries
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </Modal>
  );
};
