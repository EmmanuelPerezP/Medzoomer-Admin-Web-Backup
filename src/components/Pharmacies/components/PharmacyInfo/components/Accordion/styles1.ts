import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '0',
      boxShadow: '0 0 1px 0 rgba(0, 0, 0, 0.14)',
      borderBottom: '1px solid #e3e4e8',
      '&$expanded': {
        margin: '0 0',
        boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.08)'
      },
      '&::before': { display: 'none' }
    },
    expanded: {},
    summary: {
      padding: '18px 40px',
      [theme.breakpoints.down('sm')]: {
        padding: '10px 20px'
      }
    },
    details: {
      padding: '0 40px 18px',
      [theme.breakpoints.down('sm')]: {
        padding: '0 20px 10px'
      }
    }
  })
);
