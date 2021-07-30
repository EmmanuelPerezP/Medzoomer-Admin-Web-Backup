import React, { FC } from 'react';
import { IResendButtonProps } from './types';
import { Button, Typography } from '@material-ui/core';

export const ExportButton: FC<IResendButtonProps> = ({ href }) => {
  return (
    <Button variant="outlined" color="secondary" href={href}>
      <Typography>Export</Typography>
    </Button>
  );
};
