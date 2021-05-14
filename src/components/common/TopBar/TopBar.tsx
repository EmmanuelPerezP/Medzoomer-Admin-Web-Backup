import { Button, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import clsx from 'clsx';
import Pagination from '../Pagination';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Search from '../Search';
import styles from './TopBar.module.sass';

interface TopBarProps {
  hasBackButton?: boolean;
  maxWidth?: number;
  backText?: string;
  title?: string;
  value?: any;
  subtitle?: string;
  btnTitle?: string;
  onButton?: any;
  onChangeSearch?: any;
  onChangePage?: any;
  count?: number;
  isSmall?: boolean;

  startSlot?: any;
  endSlot?: any;
}

export const TopBar: FC<TopBarProps> = (props) => {
  const history = useHistory();

  const {
    hasBackButton,
    maxWidth,
    backText,
    title,
    value,
    subtitle,
    btnTitle,
    onButton,
    onChangeSearch,
    onChangePage,
    count,
    isSmall,
    startSlot,
    endSlot: EndSlot
  } = props;

  return (
    <div className={clsx(styles.root, isSmall && styles.smallBox)}>
      <Grid container alignItems="center" wrap="nowrap" style={{ maxWidth: maxWidth }}>
        <Grid item container xs="auto" justify="flex-start" alignItems="center">
          {startSlot && startSlot}
          {hasBackButton && (
            <IconButton
              style={{ color: '#73738B' }}
              onClick={() => {
                history.goBack();
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          {backText && (
            <Typography variant="subtitle1" color="primary" style={{ marginLeft: 5 }}>
              {backText}
            </Typography>
          )}
          {onChangeSearch && (
            <>
              {hasBackButton && <Divider style={{ margin: '0 10px' }} orientation="vertical" />}
              <Search onChange={onChangeSearch} value={value} />
            </>
          )}
        </Grid>
        <Grid item container xs="auto" direction="column" alignItems="center" justify="center">
          <Typography className={styles.title}>{title}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {subtitle}
          </Typography>
        </Grid>
        <Grid item container xs="auto" justify="flex-end" alignItems="center" style={onChangePage && { minWidth: 350 }}>
          {/* {onChangePage && <Pagination onChangePage={onChangePage} filteredCount={filteredCount} />} */}
          {btnTitle && (
            <>
              <Button variant="contained" color="secondary" size="medium" onClick={onButton}>
                {btnTitle}
              </Button>
            </>
          )}
          {EndSlot && <EndSlot />}
        </Grid>
      </Grid>
    </div>
  );
};
