import { ReactElement } from 'react';

export interface IWrapperProps {
  iconName: string;
  title?: string;
  subTitle?: string;
  subTitleLink?: string;
  HeaderRightComponent?: ReactElement | null;
  HeaderCenterComponent?: ReactElement | null;
  biggerIcon?: boolean;
  isLoading?: boolean;
  BottomRightComponent?: ReactElement | null;
}
