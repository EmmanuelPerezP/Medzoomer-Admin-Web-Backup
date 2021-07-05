import React, { FC } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Grid, IconButton, Typography, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Pagination from '../../../common/Pagination';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import styles from './DeliveriesLogTable.module.sass';
import { DeliveryStatuses } from '../../../../constants';
import Button from '@material-ui/core/Button';

interface ICourierLogTable {
  page: number;
  filteredCount: number;
  handleChangePage: any;
  queueInfo: any;
  sendInvoice: any;
  clickBackTo: string;
  logTitle: string;
  perPage: number;
  data: any;
  isLoading: boolean;
  dataEmptyMessage: string;
  isDeliveries?: boolean;
  titleInCenter?: boolean;
}

const CourierLogTable: FC<ICourierLogTable> = ({
  page,
  filteredCount,
  handleChangePage,
  clickBackTo,
  queueInfo,
  sendInvoice,
  logTitle,
  perPage = 50,
  data = [],
  isLoading,
  dataEmptyMessage = 'There is no data yet',
  isDeliveries,
  titleInCenter = false
}) => {
  const renderTHeader = () => (
    <div className={styles.header}>
      <div className={styles.navigation}>
        {clickBackTo ? (
          <Link to={clickBackTo}>
            <SVGIcon name="backArrow" className={styles.backArrowIcon} />
          </Link>
        ) : null}

        <Typography className={classNames(styles.title, { [styles.titleInCenter]: titleInCenter })}>
          {logTitle}
        </Typography>
        <div className={styles.pagination}>
          <Pagination
            rowsPerPage={perPage}
            page={page}
            classes={{ toolbar: styles.paginationButton }}
            filteredCount={filteredCount}
            onChangePage={handleChangePage}
          />
        </div>
      </div>
      <div className={styles.tableHeader}>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            Billing Name: {queueInfo ? queueInfo.settingsGP.name : '-'}
          </Grid>
          <Grid item xs={4}>
            Start date: {queueInfo ? queueInfo.deliveryStartDate : '-'}
          </Grid>
          <Grid item xs={4}>
            End date: {queueInfo ? queueInfo.deliveryEndDate : '-'}
          </Grid>
        </Grid>
        <Button
          className={styles.buttonResend}
          variant="contained"
          onClick={() => {
            sendInvoice(queueInfo._id);
          }}
          color="secondary"
        >
          Resend
        </Button>
      </div>
      <div className={styles.tableHeader}>
        <div className={classNames(styles.item, styles.date)}>Date</div>
        <div className={classNames(styles.item, styles.time)}>Time</div>
        {isDeliveries && <div className={classNames(styles.item, styles.trip)}>Trip number</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.status)}>Status</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.earned)}>Action</div>}
        {/*{isDeliveries && <div className={classNames(styles.item, styles.tips)}>Tips</div>}*/}
        {/*<div className={classNames(styles.item, styles.earned)}>Earned</div>*/}
      </div>
    </div>
  );

  const renderTBody = () => (
    <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          {data.length > 0 &&
            !isDeliveries &&
            data.map((row: any, i: any) => {
              const { amount, updatedAt } = row;

              return (
                <div key={i} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>
                    {updatedAt && moment(updatedAt).format('ll')}
                  </div>
                  <div className={classNames(styles.item, styles.time)}>
                    {updatedAt && moment(updatedAt).format('HH:mm A')}
                  </div>

                  <div className={classNames(styles.item, styles.earned)}>
                    ${amount ? Number(amount).toFixed(2) : '0.00'}
                  </div>
                </div>
              );
            })}

          {data.length > 0 &&
            isDeliveries &&
            data.map((row: any) => (
              <div key={row._id} className={styles.tableItem}>
                <div className={classNames(styles.item, styles.date)}>
                  {row.updatedAt && moment(row.updatedAt).format('ll')}
                </div>
                <div className={classNames(styles.item, styles.time)}>
                  {row.updatedAt && moment(row.updatedAt).format('HH:mm A')}
                </div>
                <div className={classNames(styles.item, styles.trip)}>{row.order_uuid && row.order_uuid}</div>
                <div className={classNames(styles.item, styles.trip)}>
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
                </div>
                {/*<div className={classNames(styles.item, styles.tips)}>*/}
                {/*  {row.tips ? `$${Number(row.tips.amount).toFixed(2)}` : '-'}*/}
                {/*</div>*/}
                <div className={classNames(styles.item, styles.earned)}>
                  <Link to={row._id ? `/dashboard/orders/${row._id}` : '-'}>
                    <Tooltip title="Details" placement="top" arrow>
                      <IconButton size="small">
                        <SVGIcon name={'details'} />
                      </IconButton>
                    </Tooltip>
                  </Link>
                </div>
              </div>
            ))}

          {data.length === 0 && <Typography className={styles.noDelivery}>{dataEmptyMessage}</Typography>}
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.consumerWrapper}>
      {renderTHeader()}
      {renderTBody()}
    </div>
  );
};
export default CourierLogTable;
