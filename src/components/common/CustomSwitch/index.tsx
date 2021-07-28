import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const CustomSwitch = withStyles((theme) => ({
  root: {
    width: 30,
    height: 18,
    padding: 0,
    margin: theme.spacing(1),
    marginTop: theme.spacing(1.5)
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#006cf0',
        opacity: 1,
        border: 'none'
      },
      '& $thumb': {
        border: 'none'
      }
    }
  },
  thumb: {
    width: 16,
    height: 16,
    border: `2.5px solid ${theme.palette.grey[400]}`
  },
  track: {
    borderRadius: 50,
    border: `2.5px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  checked: {}
}))(Switch);

export default CustomSwitch;
