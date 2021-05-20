import { IconButton, Tooltip, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import usePharmacy from '../../../../hooks/usePharmacy';
import GridTable from '../../../common/GridTable';
import SVGIcon from '../../../common/SVGIcon';
import TopBar from '../../../common/TopBar';
import { reportsColumns } from '../../constants';

export const ReportsTable: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();

  const { getReportsInPharmacy } = usePharmacy();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReports = async () => {
    if (id) {
      setLoading(true);
      try {
        // tslint:disable-next-line:no-shadowed-variable
        const reports = await getReportsInPharmacy(id);
        setReports(reports.data);
        setLoading(false);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getReports().catch((e) => {
      // tslint:disable-next-line:no-console
      console.log(e);
    });
    // eslint-disable-next-line
  }, [id]);

  const rows = reports.map((row: any, index) => [
    <Typography key={`date-${index}`} variant="subtitle2">
      {moment(row.name).format('MM/DD/YYYY')}
    </Typography>,
    <Typography key={`time-${index}`} variant="subtitle2">
      {moment(row.createdAt).format('hh:mm A')}
    </Typography>,
    <Tooltip key={index} title="Download" placement="top" arrow>
      <IconButton href={row.url}>
        <SVGIcon name={'upload'} />
      </IconButton>
    </Tooltip>
  ]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TopBar title="Reports" hasBackButton isSmall />
      <GridTable columns={reportsColumns} rows={rows.reverse()} isSmall isLoading={loading} />
    </div>
  );
};
