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
import usePharmacy from '../../../../../../hooks/usePharmacy';
import Loading from '../../../../../common/Loading';
import SVGIcon from '../../../../../common/SVGIcon';
import styles from '../../PharmacyInfo.module.sass';

interface ReportsProps {
  pharmacyId: string;
}

export const PharmacyReports: FC<ReportsProps> = (props) => {
  const { pharmacyId } = props;
  const { getReportsInPharmacy } = usePharmacy();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReports = async () => {
    if (pharmacyId) {
      setLoading(true);
      try {
        const reportsList = await getReportsInPharmacy(pharmacyId);
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
        <Typography className={styles.blockTitle}>Reports</Typography>
        {loading ? (
          <Loading className={styles.loaderCenter} />
        ) : reports.length ? (
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell align="right">Downlaod</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{moment(item.createdAt).format('MM/DD/YYYY')}</TableCell>
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
