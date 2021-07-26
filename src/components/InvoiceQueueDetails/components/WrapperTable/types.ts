import React, { ReactElement } from 'react';

export interface IWrapperTableProps {
  iconName: string;
  title: string;
  subTitle: string;
  HeaderRightComponent?: ReactElement | null;
  biggerIcon?: boolean;
  isLoading?: boolean;
  BottomRightComponent?: ReactElement | null;
}
