import React, { FC } from 'react';
import { IRenderConditionalLoader, IReportsGridProps, TRegenerateTResponse, TResendResponse } from './types';
import { noop } from 'lodash';
import GridTable from '../../../common/GridTable';
import { reportsColumns } from '../../constants';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { IconButton, Tooltip } from '@material-ui/core';
import SVGIcon from '../../../common/SVGIcon';
import Loading from '../../../common/Loading';
import styles from './ReportsTable.module.sass';
import useGroup from '../../../../hooks/useGroup';
import useAccumulateLoader from './useAccumulateLoader';
import { ResendButton, RegenerateButton } from './IconButtons';

export const ReportsGrid: FC<IReportsGridProps> = ({ 
  reports, 
  onUpdateUrl = noop,
  isLoading 
}) => {
  const { resendReport, regeneratereport } = useGroup();
  const [, resendLoaderActions] = useAccumulateLoader();
  const [, regenerateLoaderActions] = useAccumulateLoader();

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
      if(result.status === 'Success') 
        onUpdateUrl(reportId, result.adminPdfLink) 
      else 
        throw result.message
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
      if(result.status === 'Success') 
        onUpdateUrl(reportId, result.adminPdfLink) 
      else 
        throw result.message
    } catch (error) {
      console.error(`Error while resending the link report <${reportId}>`, { error });
    } finally {
      resendLoaderActions.hide(reportId);
    }
  };

  const reportRows = reports.map((report, index) => [
    <Typography key={index} variant="subtitle2">
      {moment(new Date(report.name.includes('.') ? report.name.split('.')[0] : report.name)).format('ll')}
    </Typography>,
    <Typography key={`2-${index}`} variant="subtitle2">
      {moment(report.createdAt).format('hh:mm A')}
    </Typography>,
    <>
      <Tooltip key={`3-${index}`} title="Download" placement="top" arrow>
        <IconButton href={report.url}>
          <SVGIcon name="upload" />
        </IconButton>
      </Tooltip>
      {renderConditionalLoader({
        condition: regenerateLoaderActions.isExist(report._id),
        content: <RegenerateButton ownKey={`4-${index}`} onClick={() => handleRegenerateReport(report._id)} />
      })}

      {renderConditionalLoader({
        condition: resendLoaderActions.isExist(report._id),
        content: <ResendButton ownKey={`5-${index}`} onClick={() => handleResendReport(report._id)} />
      })}
    </>
  ]);

  return <GridTable columns={reportsColumns} rows={reportRows} isSmall isLoading={isLoading} />;
};
