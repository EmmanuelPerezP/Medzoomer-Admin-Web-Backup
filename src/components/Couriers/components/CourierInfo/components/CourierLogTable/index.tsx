import React, { FC } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Pagination from '../../../../../common/Pagination';
import SVGIcon from '../../../../../common/SVGIcon';
import Loading from '../../../../../common/Loading';
import styles from './CourierLogTable.module.sass';
import { DeliveryStatuses } from '../../../../../../constants';

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
  isDeliveries
}) => {
  const renderTHeader = () => (
    <div className={styles.header}>
      <div className={styles.navigation}>
        <Link to={clickBackTo}>
          <SVGIcon name="backArrow" className={styles.backArrowIcon} />
        </Link>
        <Typography className={styles.title}>{logTitle}</Typography>
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
        <div className={classNames(styles.item, styles.time)}>Time</div>
        {isDeliveries && <div className={classNames(styles.item, styles.trip)}>Trip number</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.status)}>Status</div>}
        {isDeliveries && <div className={classNames(styles.item, styles.tips)}>Tips</div>}
        <div className={classNames(styles.item, styles.earned)}>Earned</div>
      </div>
    </div>
  );

  const renderTBody = () => (
    <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
      {isLoading && <Loading />}
      {!isLoading && (
        <div>
          {data.length &&
            !isDeliveries &&
            data.map((row: any, i: any) => {
              const { amount, updatedAt } = row;

              return (
                <div key={i} className={styles.tableItem}>
                  <div className={classNames(styles.item, styles.date)}>
                    {updatedAt && moment(updatedAt).format('D MMMM, YYYY')}
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

          {data.length &&
            isDeliveries &&
            data.map((row: any) => (
              <div key={row._id} className={styles.tableItem}>
                <div className={classNames(styles.item, styles.date)}>
                  {row.updatedAt && moment(row.updatedAt).format('D MMMM, YYYY')}
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
                <div className={classNames(styles.item, styles.tips)}>
                  {row.tips ? `$${Number(row.tips.amount).toFixed(2)}` : '-'}
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