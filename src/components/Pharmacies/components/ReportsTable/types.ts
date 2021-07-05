export interface IReportEntity {
  createdAt: string; // ISO date
  expiredAt: string; // ISO date
  updatedAt: string; // ISO date
  name: string;
  pharmacy: string;
  token: string;
  url: string;
  _id: string;
}

export interface IReports extends Array<IReportEntity> {}

export interface IReportRowProps {
  report: IReportEntity;
  activeResendLoading: IReportEntity['_id'] | null;
  activeRegenerateLoading: IReportEntity['_id'] | null;
  onClickResend: (reportId: string) => void;
  onClickRegenerate: (reportId: string) => void;
  index: number;
}

export interface IRenderConditionalLoader {
  condition: boolean;
  content: any;
}

export interface IReportsGridProps {
  reports: IReports;
  onResend?: (reportId: string) => void;
  onRegenerate?: (reportId: string) => void;
  isLoading: boolean;
}

export interface IUseAccumulateLoaderActions {
  show: (id: string) => void;
  hide: (id: string) => void;
  isExist: (id: string, fromRef?: boolean) => boolean;
  hideAll: () => void;
}

export interface IUseAccumulateLoaderState extends Array<string> {}

export type IUseAccumulateLoader = () => [IUseAccumulateLoaderState, IUseAccumulateLoaderActions];

export interface IReportButtonProps {
  onClick: () => void;
  ownKey: string;
  title: string;
  style?: any;
}

export interface IResendButtonProps extends Omit<IReportButtonProps, 'title'> {}

export interface IRegenerateButtonProps extends Omit<IReportButtonProps, 'title'> {}
