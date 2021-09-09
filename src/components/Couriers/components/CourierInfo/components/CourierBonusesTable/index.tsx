import React, { FC, useEffect, useState, useCallback } from 'react';
import { useRouteMatch } from 'react-router';
import useTransactions from '../../../../../../hooks/useTransactions';
import CourierLogTable from '../CourierLogTable';
const PER_PAGE = 50;

const CourierBonusesTable: FC = () => {
  const {
    params: { id }
  } = useRouteMatch();
  const [isLoading, setIsLoading] = useState(true);
  const { getTransactions, filters } = useTransactions();
  const [page, setPage] = useState(0);
  const [bonuses, setBonuses] = useState({
    data: [],
    meta: {
      filteredCount: 0
    }
  });

  const getBonuses = useCallback(async () => {
    setIsLoading(true);
    try {
      const f = {
        sortField: 'createdAt',
        order: 'desc',
        courier: id,
        page,
        perPage: PER_PAGE
        // type: 'FUNDS'
      };
      const data = await getTransactions(f);
      setBonuses(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [getTransactions, filters]);

  useEffect(() => {
    getBonuses().catch();
    // eslint-disable-next-line
  }, [page]);

  const handleChangePage = (e: object, nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <CourierLogTable
      page={page}
      filteredCount={bonuses.meta.filteredCount}
      handleChangePage={handleChangePage}
      clickBackTo={`/dashboard/couriers/${id}`}
      logTitle={'Log of Transactions'}
      perPage={PER_PAGE}
      data={bonuses.data}
      isLoading={isLoading}
      dataEmptyMessage={'There is no bonus history yet'}
    />
  );
};

export default CourierBonusesTable;
