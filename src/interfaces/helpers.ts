import { ComponentType } from 'react';

export interface DestructByKey<T> {
  [key: string]: T;
}

export interface IconProps {
  name: string;
  className?: string;
  style?: object;
  rest?: object;
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
