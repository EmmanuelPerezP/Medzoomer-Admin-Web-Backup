import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
  white: '#fff',
  black: '#000',
  border: '#cfcfe1',
  borderFocus: '#b2b2e7',
  borderError: '#e0bbbb',
  label: '#73738b'
};

export const fontSizes = {
  main: 14,
  table: 13,
  menu: 15,
  button: 16,
  title: 20,
  subTitle: 18,
  largeTitle: 42
};

const theme = createMuiTheme({
  typography: {
    fontFamily: '"Work Sans", sans-serif',
    fontSize: fontSizes.main,
    htmlFontSize: fontSizes.main
  },
  palette: {
    common: {
      black: colors.black,
      white: colors.white
    },
    primary: {
      main: '#00adc7',
      contrastText: colors.white
    },
    secondary: {
      main: '#00c853',
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
    MuiInputBase: {
      input: {
        height: '1.125em',
        padding: '17px 22px'
      }
    },
    MuiButton: {
      root: {
        fontSize: fontSizes.button,
        padding: '12px 30px'
      },
      contained: {
        boxShadow: 'none !important'
      }
    }
  }
});

export default theme;
