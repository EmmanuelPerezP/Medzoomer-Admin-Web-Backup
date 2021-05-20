import { Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import Loading from '../../../../../common/Loading';
import SVGIcon from '../../../../../common/SVGIcon';
import styles from '../../PharmacyInfo.module.sass';

interface ReportsProps {
  pharmacyId: string;
}

export const PharmacyReports: FC<ReportsProps> = (props) => {
  const { pharmacyId } = props;
  const history = useHistory();
  const { getReportsInPharmacy, filters } = usePharmacy();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReports = async () => {
    if (pharmacyId) {
      setLoading(true);
      try {
        const reportsList = await getReportsInPharmacy(pharmacyId, {
          ...filters,
          page: 0,
          perPage: 3,
          sortField: 'createdAt'
        });
        setReports(reportsList.data);
        setLoading(false);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void getReports();
    // eslint-disable-next-line
  }, [pharmacyId]);

  return (
    <div className={styles.lastBlock}>
      <div className={styles.nextBlock}>
        <div className={styles.resetGroupData}>
          <Button
            onClick={() => history.push(`/dashboard/pharmacies/${pharmacyId}/reports`)}
            className={styles.headerButton}
            color="secondary"
            variant="outlined"
            size="large"
          >
            <Typography className={styles.orderText}>View All</Typography>
          </Button>
        </div>
        <Typography className={styles.blockTitle}>Reports</Typography>
        {loading ? (
          <Loading className={styles.loaderCenter} />
        ) : reports.length ? (
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="right">Downlaod</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports
                .slice(-3)
                .reverse()
                .map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{moment(item.name).format('ll')}</TableCell>
                    <TableCell align="center">{moment(item.createdAt).format('hh:mm A')}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Download" placement="top" arrow>
                        <IconButton href={item.url}>
                          <SVGIcon className={styles.userActionIcon} name={'upload'} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className={styles.usersEmptyList}>No reports</div>
        )}
      </div>
    </div>
  );
};
