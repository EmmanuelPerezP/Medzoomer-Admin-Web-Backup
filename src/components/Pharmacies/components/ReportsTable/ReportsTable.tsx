import { IconButton, Tooltip, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import usePharmacy from '../../../../hooks/usePharmacy';
import GridTable from '../../../common/GridTable';
import SVGIcon from '../../../common/SVGIcon';
import TopBar from '../../../common/TopBar';
import { PER_PAGE, reportsColumns } from '../../constants';
import { PharmacyReport } from '../../../../interfaces';
import useUser from '../../../../hooks/useUser';

export const ReportsTable: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();

  const { getReportsInPharmacy, filters } = usePharmacy();
  const { page } = filters;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useUser();

  const getReports = async () => {
    if (id) {
      setLoading(true);
      try {
        // tslint:disable-next-line:no-shadowed-variable
        const reports = await getReportsInPharmacy(id, {
          ...filters,
          page,
          sortField: 'createdAt',
          perPage: PER_PAGE
        });
        setReports(reports.data.filter((item: PharmacyReport) => item.name !== 'undefined'));
        setLoading(false);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void getReports().catch();
    // eslint-disable-next-line
  }, [id]);

  const rows = reports.map((row: any, index: number) => [
    <Typography key={index} variant="subtitle2">
      {moment(new Date(row.name.includes('.') ? row.name.split('.')[0] : row.name)).tz(user.timezone as string).format('ll')}
    </Typography>,
    <Typography key={`2-${index}`} variant="subtitle2">
      {moment(row.createdAt).tz(user.timezone as string).format('hh:mm A')}
    </Typography>,
    <Tooltip key={`3-${index}`} title="Download" placement="top" arrow>
      <IconButton href={row.url}>
        <SVGIcon name={'upload'} />
      </IconButton>
    </Tooltip>
  ]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TopBar
        hasBackButton
        title="Reports"
        perPage={PER_PAGE}
        page={page}
        // filteredCount={reports.meta.filteredCount}
        filteredCount={reports.length}
        onChangePage={() => null}
        isSmall
      />
      <GridTable columns={reportsColumns} rows={rows} isSmall isLoading={loading} />
    </div>
  );
};
