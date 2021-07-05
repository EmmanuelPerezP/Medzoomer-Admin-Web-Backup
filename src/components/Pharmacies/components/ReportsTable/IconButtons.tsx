import { IconButton, Tooltip } from '@material-ui/core';
import React, { FC } from 'react';
import SVGIcon from '../../../common/SVGIcon';
import { IRegenerateButtonProps, IResendButtonProps } from './types';

export const ResendButton: FC<IResendButtonProps> = ({ onClick, ownKey, style = {} }) => (
  <Tooltip key={ownKey} title="Resend Link" placement="top" arrow>
    <IconButton onClick={onClick}>
      <SVGIcon style={{ width: 22, ...style }} name="resendReport" />
    </IconButton>
  </Tooltip>
);

export const RegenerateButton: FC<IRegenerateButtonProps> = ({ ownKey, onClick, style = {} }) => (
  <Tooltip key={ownKey} title="Regenerate" placement="top" arrow>
    <IconButton onClick={onClick}>
      <SVGIcon style={{ width: 22, ...style }} name="regenerateReport" />
    </IconButton>
  </Tooltip>
);
