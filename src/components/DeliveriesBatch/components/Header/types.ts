import { IDeliveriesBatchConfiguration } from '../../types';

export interface IHeaderProps {
  configuration: IDeliveriesBatchConfiguration;
  handleOpenFilter: () => void;
}
