import React, { FC } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import { colors, fontSizes } from '../../../theme';

interface IStyles {
  classes: {
    pagination: string;
  };
}

export interface PaginationProps {
  filteredCount: number;
  rowsPerPage: number;
  page: number;
  onChangePage: any;
  rowsPerPageOptions?: number[];
}

const PaginationBase: FC<PaginationProps & IStyles> = (props) => {
  const { classes, onChangePage, page, rowsPerPage, filteredCount, rowsPerPageOptions } = props;
  return (
    <TablePagination
      classes={{ caption: classes.pagination }}
      rowsPerPageOptions={rowsPerPageOptions || []}
      component="div"
      count={filteredCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
    />
  );
};

const PaginationField = withStyles((theme: Theme) =>
  createStyles({
    pagination: {
      color: colors.tableColor,
      fontSize: fontSizes.main
    }
  })
)(PaginationBase);

export default PaginationField;
