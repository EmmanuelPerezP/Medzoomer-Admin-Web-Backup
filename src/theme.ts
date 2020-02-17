import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
  white: '#fff',
  black: '#000',
  border: 'rgba(0, 0, 0, 0.14)',
  borderFocus: '#b2b2e7',
  borderError: '#e0bbbb',
  tableColor: '#536270',
  label: '#73738b'
};

export const fontSizes = {
  main: 14,
  secondary: 16,
  table: 13,
  menu: 15,
  button: 17,
  title: 20,
  subTitle: 18,
  largeTitle: 42
};

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Work Sans',
    fontSize: fontSizes.main,
    htmlFontSize: fontSizes.main,
    body1: {
      fontSize: fontSizes.main,
      lineHeight: 'normal'
    }
  },
  palette: {
    common: {
      black: colors.black,
      white: colors.white
    },
    primary: {
      main: '#e21c40',
      contrastText: colors.white
    },
    secondary: {
      main: '#006cf0',
      contrastText: colors.white
    },
    error: {
      main: '#ff7272',
      contrastText: colors.white
    },
    background: {
      default: '#f7f8fa',
      paper: colors.white
    },
    text: {
      primary: colors.black,
      secondary: colors.label,
      disabled: colors.label,
      hint: '#a4a6aa'
    },
    divider: '#e3e4e8',
    action: {
      active: colors.borderFocus,
      hover: colors.borderFocus,
      hoverOpacity: 0.08,
      selected: colors.borderFocus,
      disabled: '#e4e4f3',
      disabledBackground: '#f3f4f7'
    }
  },
  overrides: {
    MuiLink: {
      underlineHover: {
        '&:hover': {
          textDecoration: 'none'
        }
      }
    },
    MuiInputBase: {
      input: {
        height: '1.125em',
        padding: '18px 22px'
      }
    },
    MuiFormControlLabel: {
      labelPlacementStart: {
        marginRight: 0
      }
    },
    MuiButton: {
      root: {
        fontSize: fontSizes.button,
        padding: '15px 30px',
        textTransform: 'none'
      },
      contained: {
        boxShadow: 'none !important'
      }
    },
    MuiTableCell: {
      root: {
        padding: '0px',
        border: 'none'
      },
      body: {
        color: colors.tableColor
      }
    },
    MuiSelect: {
      select: {
        paddingRight: '0 !important'
      }
    }
  }
});

export default theme;
