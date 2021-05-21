import { IconButton, Tooltip, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { FC, useEffect, useState, Fragment } from 'react';
import { useRouteMatch } from 'react-router';
import usePharmacy from '../../../../hooks/usePharmacy';
import GridTable from '../../../common/GridTable';
import SVGIcon from '../../../common/SVGIcon';
import TopBar from '../../../common/TopBar';
import { PER_PAGE, reportsColumns } from '../../constants';

export const ReportsTable: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();

  const { getReportsInPharmacy, filters } = usePharmacy();
  const { page } = filters;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
    void getReports().catch();
    // eslint-disable-next-line
  }, [id]);

  const rows = reports.map((row: any, i) => [
    <Fragment key={i}>
      <Typography variant="subtitle2">{moment(row.createdAt).format('MM/DD/YYYY')}</Typography>,
      <Typography variant="subtitle2">{moment(row.createdAt).format('hh:mm A')}</Typography>,
      <Tooltip title="Download" placement="top" arrow>
        <IconButton href={row.url}>
          <SVGIcon name={'upload'} />
        </IconButton>
      </Tooltip>
    </Fragment>
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
        onChangePage={() => {}}
        isSmall
      />
      <GridTable columns={reportsColumns} rows={rows.reverse()} isSmall isLoading={loading} />
    </div>
  );
};
