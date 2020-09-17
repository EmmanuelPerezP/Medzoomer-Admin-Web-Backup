export interface DestructByKey<T> {
  [key: string]: T;
}

export interface IconProps {
  name: string;
  className?: string;
  style?: object;
  rest?: object;
  onClick?: any;
}

export interface LogoProps {
  className: string;
  logo: string;
}

export interface AvatarProps {
  className?: string;
  src: string;
  cognitoId: string;
  fullName: string;
  email: string;
  isHide: boolean;
}

export interface Filters {
  search: string;
  page: number;
  sortField: string;
  order: 'asc' | 'desc';
}

export interface FiltersDel {
  search: string;
  page: number;
  sortField: string;
  order: 'asc' | 'desc';
  status: 'PENDING' | 'PROCESSED' | 'ACTIVE' | 'ASSIGNED' | 'UNASSIGNED' | 'COMPLETED' | 'ALL';
  assigned: any;
  courier: string;
  pharmacy: string;
  startDate: any;
  endDate: any;
}
