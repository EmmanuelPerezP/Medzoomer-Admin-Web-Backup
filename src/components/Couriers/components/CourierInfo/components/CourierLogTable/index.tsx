import React, { FC } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Pagination from '../../../../../common/Pagination';
import SVGIcon from '../../../../../common/SVGIcon';
import Loading from '../../../../../common/Loading';
import styles from './CourierLogTable.module.sass';
import { DeliveryStatuses, TransactionReasons, TransactionTypes } from '../../../../../../constants';
// import useUser from '../../../../../../hooks/useUser';
import {
  // getDateFromTimezone,
  getDateWithFormat
} from '../../../../../../utils';

interface ICourierLogTable {
  page: number;
  filteredCount: number;
  handleChangePage: any;
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
  logTitle,
  perPage = 50,
  data = [],
  isLoading,
  dataEmptyMessage = 'There is no data yet',
  isDeliveries,
  titleInCenter = false
}) => {
  // const user = useUser();

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
        <div className={classNames(styles.item, styles.date)}>Date</div>
        {!isDeliveries && <div className={classNames(styles.item, styles.orderId)}>Order ID</div>}
        {!isDeliveries && <div className={classNames(styles.item, styles.type)}>Type</div>}
        {!isDeliveries && <div className={classNames(styles.item, styles.reason)}>Reason</div>}
        {!isDeliveries && <div className={classNames(styles.item, styles.note)}>Note</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.trip)}>Trip number</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.status)}>Status</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.tips)}>Total distance</div>}
        <div className={classNames(styles.item, styles.earned)}>Amount</div>
      </div>
    </div>
  );

  const renderTBody = () => (
    <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className={styles.content}>
          {data.length > 0 &&
            !isDeliveries &&
            data.map((row: any, i: any) => {
              const { amount, updatedAt, type, reason, note, delivery } = row;

              return (
                <div key={i} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>
                    {updatedAt && getDateWithFormat(updatedAt, 'lll')}
                  </div>
                  <div className={classNames(styles.item, styles.orderId)}>
                    {delivery && delivery.order ? (
                      <Link to={`/dashboard/orders/${delivery.order}`} className={styles.link}>
                        {delivery.order_uuid}
                      </Link>
                    ) : '-'}
                  </div>
                  <div className={classNames(styles.item, styles.type)}>
                    {TransactionTypes[type] || '-'}
                  </div>
                  <div className={classNames(styles.item, styles.reason)}>
                    {reason ? TransactionReasons[reason] : '-'}
                  </div>
                  <div className={classNames(styles.item, styles.note)}>
                    {note || '-'}
                  </div>

                  <div className={classNames(styles.item, styles.earned, type === 'WITHDRAW' && styles.withdraw)}>
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
                  {row.updatedAt && getDateWithFormat(row.updatedAt, 'lll')}
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
                <div className={classNames(styles.item, styles.distance)}>
                  {`${row.distToPharmacy} mi`}
                </div>
                <div className={classNames(styles.item, styles.earned)}>
                  ${row.payout ? Number(row.payout.amount).toFixed(2) : '0.00'}
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
