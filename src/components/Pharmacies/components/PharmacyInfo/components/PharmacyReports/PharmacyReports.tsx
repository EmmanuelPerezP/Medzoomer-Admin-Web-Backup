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
import useGroup from '../../../../../../hooks/useGroup';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import Loading from '../../../../../common/Loading';
import SVGIcon from '../../../../../common/SVGIcon';
import { RegenerateButton, ResendButton, useAccumulateLoader } from '../../../ReportsTable';
import { IRenderConditionalLoader, IReports, TRegenerateTResponse, TResendResponse } from '../../../ReportsTable/types';
import styles from '../../PharmacyInfo.module.sass';

interface ReportsProps {
  pharmacyId: string;
}

export const PharmacyReports: FC<ReportsProps> = ({ pharmacyId }) => {
  const history = useHistory();
  const { getReportsInPharmacy, filters } = usePharmacy();
  const [reports, setReports] = useState<IReports>([]);
  const [loading, setLoading] = useState(true);

  const { resendReport, regeneratereport } = useGroup();
  const [, resendLoaderActions] = useAccumulateLoader();
  const [, regenerateLoaderActions] = useAccumulateLoader();

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

  const onUpdateUrl = (reportId: string, pdfUrl: string) => {
    setReports((prev) => {
      const next = prev.slice();
      const neededIndex = reports.findIndex((report) => report._id === reportId);
      // tslint:disable-next-line:no-bitwise
      if (~neededIndex) next[neededIndex].url = pdfUrl;
      return next;
    });
  };

  useEffect(() => {
    void getReports();
    // eslint-disable-next-line
  }, [pharmacyId]);

  const renderConditionalLoader = (props: IRenderConditionalLoader) => {
    const { condition, content } = props;

    if (condition) {
      return (
        <div className={styles.loaderContainer}>
          <Loading className={styles.loader} />
        </div>
      );
    } else return content;
  };

  const handleRegenerateReport = async (reportId: string) => {
    if (!reportId) return console.error(`Report id does not exist <${reportId}>`);
    try {
      regenerateLoaderActions.show(reportId);
      const result: TRegenerateTResponse = await regeneratereport(reportId);
      if (result.status === 'Success') onUpdateUrl(reportId, result.adminPdfLink);
      else throw result.message;
    } catch (error) {
      console.error(`Error while regeneration report <${reportId}>`, { error });
    } finally {
      regenerateLoaderActions.hide(reportId);
    }
  };

  const handleResendReport = async (reportId: string) => {
    if (!reportId) return console.error(`Report id does not exist <${reportId}>`);
    try {
      resendLoaderActions.show(reportId);
      const result: TResendResponse = await resendReport(reportId);
      if (result.status === 'Success') onUpdateUrl(reportId, result.adminPdfLink);
      else throw result.message;
    } catch (error) {
      console.error(`Error while resending the link report <${reportId}>`, { error });
    } finally {
      resendLoaderActions.hide(reportId);
    }
  };

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
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((item: any, i) =>
                item.name !== 'undefined' ? (
                  <TableRow key={`row-${i}`}>
                    <TableCell>
                      {moment(item.name.includes('.') ? item.name.split('.')[0] : item.name).format('ll')}
                    </TableCell>
                    <TableCell align="center">{moment(item.createdAt).format('hh:mm A')}</TableCell>
                    <TableCell align="right">
                      <div className={styles.reportButtonsContainer}>
                        <Tooltip title="Download" placement="top" arrow>
                          <IconButton href={item.url}>
                            <SVGIcon className={styles.userActionIcon} name={'upload'} />
                          </IconButton>
                        </Tooltip>
                        {renderConditionalLoader({
                          condition: regenerateLoaderActions.isExist(item._id),
                          content: (
                            <RegenerateButton ownKey={`4-${i}`} onClick={() => handleRegenerateReport(item._id)} />
                          )
                        })}
                        {renderConditionalLoader({
                          condition: resendLoaderActions.isExist(item._id),
                          content: <ResendButton ownKey={`5-${i}`} onClick={() => handleResendReport(item._id)} />
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        ) : (
          <div className={styles.usersEmptyList}>No reports</div>
        )}
      </div>
    </div>
  );
};
