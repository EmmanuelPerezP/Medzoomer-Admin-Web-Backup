import { IconButton, Tooltip, Typography } from '@material-ui/core';
import moment from 'moment-timezone';
import React, { FC, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import usePharmacy from '../../../../hooks/usePharmacy';
import TopBar from '../../../common/TopBar';
import { PER_PAGE } from '../../constants';
import { PharmacyReport } from '../../../../interfaces';
import useUser from '../../../../hooks/useUser';
import { IReports } from './types';
import { ReportsGrid } from './ReportsGrid';

export const ReportsTable: FC = () => {
  const {
    params: { id }
  } = useRouteMatch<{ id: string }>();

  const { getReportsInPharmacy, filters } = usePharmacy();
  const { page } = filters;
  const [currentPage, setCurrentPage] = useState(page);
  const [reports, setReports] = useState<IReports>([]);
  const [totalNumberOfReports, setTotalNumberOfReports] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = useUser();

  const getReports = async () => {
    if (id) {
      setLoading(true);
      try {
        // tslint:disable-next-line:no-shadowed-variable
        const reports = await getReportsInPharmacy(id, {
          ...filters,
          page: currentPage,
          sortField: 'createdAt',
          perPage: PER_PAGE
        });
        setReports(reports.data.filter((item: PharmacyReport) => item.name !== 'undefined'));
        setTotalNumberOfReports(reports.totalNumberOfReports);
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

  const handleChangePage = (e: object, nextPage: number) => {
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    void getReports().catch();
    // eslint-disable-next-line
  }, [id, currentPage]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TopBar
        hasBackButton
        title="Reports"
        perPage={PER_PAGE}
        page={currentPage}
        filteredCount={totalNumberOfReports}
        onChangePage={handleChangePage}
        isSmall
      />
      <ReportsGrid reports={reports} isLoading={loading} onUpdateUrl={onUpdateUrl} />
    </div>
  );
};
