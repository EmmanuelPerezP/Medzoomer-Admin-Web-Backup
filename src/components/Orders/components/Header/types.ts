import { IOrdersConfiguration } from '../../types';

export interface IHeaderProps {
  configuration: IOrdersConfiguration;
  handleOpenFilter: () => void;
}
