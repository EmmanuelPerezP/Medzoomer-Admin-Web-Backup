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
  fullName: string;
  email: string;
}
