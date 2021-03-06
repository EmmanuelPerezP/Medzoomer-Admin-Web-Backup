import React, { FC } from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import { colors, fontSizes } from '../../../theme';
// @ts-ignore
interface IStyles {
  classes: {
    toolbar: string;
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
    <>
      <TablePagination
        classes={{ toolbar: classes.toolbar }}
        rowsPerPageOptions={rowsPerPageOptions || []}
        component="div"
        count={filteredCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={onChangePage}
      />
    </>
  );
};

const PaginationField = withStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      color: colors.tableColor,
      fontSize: fontSizes.main
    }
  })
)(PaginationBase);

export default PaginationField;
