import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DEFAULT_TITLE = 'Opps, something went wrong! We’re hard at work on a solution.';
const DEFAULT_BODY = 'If this problem persists, contact your support representative.';

export default function AlertDialogSlide({
  onClose,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY
}: {
  title: string;
  body: string;
  onClose: any;
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="error-dialog-slide-title"
      aria-describedby="error-dialog-slide-description"
    >
      <DialogTitle id="error-dialog-slide-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="error-dialog-slide-description">{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
