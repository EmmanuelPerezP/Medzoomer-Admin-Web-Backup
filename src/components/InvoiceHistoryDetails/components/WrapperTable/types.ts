import React, { ReactElement } from 'react';

export interface IWrapperTableProps {
  iconName: string;
  title: string;
  subTitle: string;
  HeaderRightComponent?: ReactElement;
  biggerIcon?: boolean;
  BottomRightComponent?: ReactElement;
}
