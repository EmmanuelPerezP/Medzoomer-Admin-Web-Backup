import React, { FC } from 'react';
import { IResendButtonProps } from '../../../Pharmacies/components/ReportsTable/types';
import { Button, Typography } from '@material-ui/core';

export const ResendButton: FC<IResendButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outlined" color="secondary" onClick={onClick}>
      <Typography>Reprocess</Typography>
    </Button>
  );
};
