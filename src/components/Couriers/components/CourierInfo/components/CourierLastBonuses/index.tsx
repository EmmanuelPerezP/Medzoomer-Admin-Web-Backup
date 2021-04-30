import React, { FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { useHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styles from '../../CourierInfo.module.sass';
import useTransactions from '../../../../../../hooks/useTransactions';
import Loading from '../../../../../common/Loading';

interface ICourierLastBonuses {
  id: string;
  path: string;
}

const CourierLastBonuses: FC<ICourierLastBonuses> = ({ id, path = '' }) => {
  const history = useHistory();
  const { getTransactions } = useTransactions();
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
        type: 'FUNDS',
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
    <div className={styles.deliveries}>
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Loading />
        </div>
      )}
      {!isLoading && (
        <>
          <div className={styles.deliveryHeader}>
            <Typography className={styles.title}>Bonus History</Typography>
            <Button
              className={styles.headerButton}
              variant="outlined"
              color="secondary"
              onClick={() => history.push(path)}
            >
              <Typography className={styles.orderText}>View All</Typography>
            </Button>
          </div>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell className={classNames(styles.date, styles.headerCell)}>Date</TableCell>
                <TableCell className={classNames(styles.time, styles.headerCell)}>Time</TableCell>
                <TableCell className={classNames(styles.earned, styles.headerCell)} align="right">
                  Earned
                </TableCell>
              </TableRow>
            </TableHead>
            {!bonuses.length && <Typography className={styles.noDelivery}>There is no bonus history yet</Typography>}
            <TableBody>
              {bonuses.length
                ? bonuses.map((row, i) => {
                    const { amount, updatedAt } = row;

                    return (
                      <TableRow key={i} className={styles.tableItem}>
                        <TableCell className={styles.date}>{updatedAt && moment(updatedAt).format('ll')}</TableCell>
                        <TableCell className={styles.time}>
                          {updatedAt && moment(updatedAt).format('HH:mm A')}
                        </TableCell>

                        <TableCell className={styles.earned} align="right">
                          ${amount ? Number(amount).toFixed(2) : '0.00'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default CourierLastBonuses;
