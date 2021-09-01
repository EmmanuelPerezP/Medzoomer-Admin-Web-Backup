import React, { Dispatch, FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// import { useStores } from '../../../../../../store';
import useTransactions from '../../../../../../hooks/useTransactions';
import Loading from '../../../../../common/Loading';
import { getDateWithFormat } from '../../../../../../utils';
import { Wrapper } from '../../../../../OrderDetails/components/Wrapper';
import {
  TransactionReasons, TransactionTypes
} from '../../../../../../constants';
import { Transaction } from '../../../../../../interfaces';

import styles from '../../CourierInfo.module.sass';


interface ICourierLastBonuses {
  id: string;
  path: string;
  setNewBalanceModal: Dispatch<boolean>;
}

const CourierLastBonuses: FC<ICourierLastBonuses> = ({ id, path = '', setNewBalanceModal }) => {
  const history = useHistory();
  const { getTransactions } = useTransactions();
  // const { deliveryStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [bonuses, setBonuses] = useState([]);

  const getLastBonuses = useCallback(async () => {
    setIsLoading(true);
    try {
      const f = {
        endDate: '',
        order: 'desc',
        page: 0,
        perPage: 3,
        sortField: 'createdAt',
        startDate: '',
        // type: 'FUNDS',
        courier: id
      };
      const { data } = await getTransactions(f);
      setBonuses(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  }, [getTransactions, id]);

  useEffect(() => {
    getLastBonuses().catch();
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper
      subTitle={'Latest Transactions'}
      iconName="transactions"
      isContentLeft={false}
      HeaderRightComponent={(
        <div className={styles.wrapperHeaderRight}>
          {/*<div className={styles.balance}>*/}
          {/*  <div className={styles.label}>Balance</div>*/}
          {/*  <div className={styles.value}>+ ${Math.round(deliveryStore.get('meta').bonus * 100) / 100}</div>*/}
          {/*</div>*/}
          <div>
            <Button
              className={styles.headerActionBtn}
              variant="contained"
              color="secondary"
              onClick={() => setNewBalanceModal(true)}
            >
              <Typography className={styles.headerActionBtnText}>Adjust</Typography>
            </Button>
          </div>
        </div>
      )}
    >
      <div className={styles.table}>
        {isLoading ? (
          <div className={styles.loadingWrapper}>
            <Loading/>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell className={classNames(styles.date, styles.headerCell)}>Date</TableCell>
                <TableCell className={classNames(styles.orderId, styles.headerCell)}>Order ID</TableCell>
                <TableCell className={classNames(styles.type, styles.headerCell)}>Type</TableCell>
                <TableCell className={classNames(styles.reason, styles.headerCell)}>Reason</TableCell>
                <TableCell className={classNames(styles.note, styles.headerCell)}>Note</TableCell>
                <TableCell className={classNames(styles.earned, styles.headerCell)} align="right">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            {!bonuses.length && <Typography className={styles.noDelivery}>There is no bonus history yet</Typography>}
            <TableBody>
              {bonuses.length
                ? bonuses.map((row: Transaction, i) => {
                  const { amount, updatedAt, reason, type, note, delivery } = row;

                  return (
                    <TableRow key={i} className={styles.tableItem}>
                      <TableCell className={styles.date}>
                        {updatedAt && getDateWithFormat(updatedAt, 'lll')}
                      </TableCell>
                      <TableCell className={styles.orderId}>
                        {delivery && delivery.order ? (
                          <Link to={`/dashboard/orders/${delivery.order}`} className={styles.link}>
                            {delivery.order_uuid}
                          </Link>
                        ) : '-'}
                      </TableCell>
                      <TableCell className={styles.type}>
                        {TransactionTypes[type] || '-'}
                      </TableCell>
                      <TableCell className={styles.reason}>
                        {reason ? TransactionReasons[reason] : '-'}
                      </TableCell>
                      <TableCell className={styles.note}>
                        {note || '-'}
                      </TableCell>

                      <TableCell className={classNames(styles.earned, type === 'WITHDRAW' && styles.withdraw)} align="right">
                        ${amount ? Number(amount).toFixed(2) : '0.00'}
                      </TableCell>
                    </TableRow>
                  );
                })
                : null}
            </TableBody>
          </Table>
        )}

        <div className={styles.viewAllBtnWrapper}>
          <Button
            className={styles.viewAllBtn}
            variant="text"
            color="secondary"
            onClick={() => history.push(path)}
          >
            <Typography className={styles.text}>View All</Typography>
          </Button>
        </div>
      </div>
    </Wrapper>
  );
};

export default CourierLastBonuses;
