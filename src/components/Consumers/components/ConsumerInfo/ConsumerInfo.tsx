import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useHistory, useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom';

import { ConsumerStatuses, DeliveryStatuses } from '../../../../constants';
import { getAddressString } from '../../../../utils';
import useConsumer from '../../../../hooks/useConsumer';
import useDelivery from '../../../../hooks/useDelivery';
import { useStores } from '../../../../store';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Back from '../../../common/Back';

import styles from './ConsumerInfo.module.sass';

const PER_PAGE = 3;

export const ConsumerInfo: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const history = useHistory();
  const { getDeliveries, filters } = useDelivery();
  const { consumer, getConsumer, updateConsumerStatus } = useConsumer();
  const { consumerStore, deliveryStore } = useStores();
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const { page, sortField, order } = filters;

  useEffect(() => {
    getConsumerInfo().catch();
    getDeliveriesList().catch();
    // eslint-disable-next-line
  }, []);

  const getConsumerInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getConsumer(id);
      consumerStore.set('consumer')(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [consumerStore, getConsumer, id]);

  const getDeliveriesList = useCallback(async () => {
    setIsLoading(true);
    try {
      const deliveries = await getDeliveries({
        page,
        perPage: PER_PAGE,
        sortField,
        order,
        customerId: id
      });
      deliveryStore.set('deliveries')(deliveries.data);
      deliveryStore.set('meta')(deliveries.meta);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [deliveryStore, getDeliveries, id, order, page, sortField]);

  const handleUpdateStatus = (status: string) => async () => {
    setIsLoading(true);
    setIsRequestLoading(true);
    try {
      const consumerInfo = await updateConsumerStatus(id, status);
      consumerStore.set('consumer')({ ...consumerInfo.data });
      history.push('/dashboard/consumers');
      setIsRequestLoading(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsRequestLoading(false);
      setIsLoading(false);
    }
  };

  // const handleChangeCollapse = () => {
  //   setIsOpen(!isOpen);
  // };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.header}>
        <Back />
        <Typography className={styles.title}>Patient Details</Typography>
      </div>
    );
  };

  const renderMainInfo = () => {
    return (
      <div className={styles.mainInfo}>
        <div className={styles.parametrs}>
          <Typography className={styles.item}>Full Name</Typography>
          <Typography className={styles.item}>Email</Typography>
          <Typography className={styles.item}>Date of Birth</Typography>
          <Typography className={styles.item}>Phone</Typography>
          <Typography className={styles.item}>Address</Typography>
        </div>
        <div className={styles.values}>
          <Typography className={styles.item}>{`${consumer.name} ${consumer.family_name}`}</Typography>
          <Typography className={styles.item}>{consumer.email || '-'}</Typography>
          <Typography className={styles.item}>{consumer.dob || '-'}</Typography>
          <Typography className={styles.item}>{consumer.phone}</Typography>
          <Typography className={styles.item}>{getAddressString(consumer.address)}</Typography>
        </div>
      </div>
    );
  };

  const renderConsumerInfo = () => {
    return (
      <div className={styles.consumerBlock}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className={styles.avatar}>
              {`${consumer.name && consumer.name[0].toUpperCase()} ${consumer.family_name &&
                consumer.family_name[0].toUpperCase()}`}
            </div>
            <div className={styles.consumerInfo}>
              <Typography className={styles.fullName}>{`${consumer.name} ${consumer.family_name}`}</Typography>
              <div className={styles.statusesWrapper}>
                <Typography className={styles.status}>
                  <span
                    className={classNames(styles.statusColor, {
                      [styles.active]: consumer.status === 'ACTIVE',
                      [styles.locked]: consumer.status === 'LOCKED'
                    })}
                  />
                  {ConsumerStatuses[consumer.status]}
                </Typography>
              </div>
              {/* {consumer.status === 'ACTIVE' ? (
                <>
                  {!isOpen ? (
                    <Typography className={styles.collapseText} onClick={handleChangeCollapse}>
                      Show Personal Information
                    </Typography>
                  ) : null}
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <div className={styles.personalInfo}>
                      <Typography className={styles.title}>Personal Information</Typography>
                      {renderMainInfo()}
                      <Typography className={styles.collapseText} onClick={handleChangeCollapse}>
                        Hide Personal Information
                      </Typography>
                    </div>
                  </Collapse>
                </>
              ) : ( */}
              <div className={styles.personalInfo}>
                <Typography className={styles.title}>Personal Information</Typography>
                {renderMainInfo()}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderFooter = () => {
    switch (consumer.status) {
      case 'ACTIVE':
        return (
          <div className={classNames(styles.buttons)}>
            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('LOCKED')}
            >
              <Typography>Lock Account</Typography>
            </Button>
          </div>
        );
      case 'LOCKED':
        return (
          <div className={classNames(styles.buttons, styles.oneButton)}>
            <Button
              className={classNames(styles.updateButton, styles.active)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('ACTIVE')}
            >
              <Typography>Unlock Account</Typography>
            </Button>
          </div>
        );
      default:
        return (
          <div className={styles.buttons}>
            <Button
              className={styles.updateButton}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('LOCKED')}
            >
              <Typography>Lock Account</Typography>
            </Button>
            <Button
              className={classNames(styles.updateButton, styles.active)}
              variant="contained"
              color="primary"
              disabled={isRequestLoading}
              onClick={handleUpdateStatus('ACTIVE')}
            >
              <Typography>Unlock Account</Typography>
            </Button>
          </div>
        );
    }
  };

  const renderLastOrderHistory = () => {
    return (
      <div className={styles.orders}>
        {deliveryStore.get('deliveries').length ? (
          <>
            <div className={styles.orderHeader}>
              <Typography className={styles.title}>Latest Orders</Typography>
              {/* <div> */}
              <Button
                className={styles.headerButton}
                variant="outlined"
                color="secondary"
                onClick={() => history.push(`/dashboard/consumers/${id}/orders`)}
              >
                <Typography className={styles.orderText}>View All</Typography>
              </Button>
              {/* <Button
                  className={styles.headerButton}
                  variant="contained"
                  color="secondary"
                  onClick={() => history.push('/dashboard/orders')}
                >
                  <Typography className={styles.orderText}>Add Order</Typography>
                </Button> */}
              {/* </div> */}
            </div>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeader}>
                  <TableCell className={classNames(styles.date, styles.headerCell)}>Date</TableCell>
                  <TableCell className={classNames(styles.time, styles.headerCell)}>Time</TableCell>
                  <TableCell className={classNames(styles.id, styles.headerCell)}>Order ID</TableCell>
                  <TableCell className={classNames(styles.status, styles.headerCell)}>Status</TableCell>
                  <TableCell className={classNames(styles.details, styles.headerCell)} align="right">
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryStore.get('deliveries').map((row: any) => (
                  <TableRow key={row._id} className={styles.tableItem}>
                    <TableCell className={styles.date}>{row.updatedAt && moment(row.updatedAt).format('ll')}</TableCell>
                    <TableCell className={styles.time}>
                      {row.updatedAt && moment(row.updatedAt).format('HH:mm A')}
                    </TableCell>
                    <TableCell className={styles.id}>{row.order_uuid && row.order_uuid}</TableCell>
                    <TableCell className={styles.status}>
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
                    </TableCell>
                    <TableCell className={styles.details} align="right">
                      <Link to={`/dashboard/orders/${row._id}`}>
                        <Tooltip title="Details" placement="top" arrow>
                          <IconButton className={styles.action}>
                            <SVGIcon name={'details'} className={styles.pharmacyActionIcon} />
                          </IconButton>
                        </Tooltip>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className={styles.noOrder}>
            <Typography className={classNames(styles.noOrderTitle, styles.noOrderText)}>No Orders Yet</Typography>
            <Typography className={classNames(styles.noOrderSubtitle, styles.noOrderText)}>
              All new orders will appear here
            </Typography>
            {/* <Button
              className={styles.addorder}
              variant="contained"
              color="secondary"
              onClick={() => history.push('/dashboard/orders')}
            >
              <Typography className={styles.orderText}>Add Order</Typography>
            </Button> */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.consumerInfoWrapper}>
      {renderHeaderBlock()}
      {renderConsumerInfo()}
      {isLoading ? null : renderFooter()}
      {!isLoading ? renderLastOrderHistory() : null}
    </div>
  );
};
