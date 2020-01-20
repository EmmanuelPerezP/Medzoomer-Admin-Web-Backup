import { UserInterface } from '../interfaces/user';
import { useState } from 'react';

let value: UserInterface | null = null;

function setValue(login: boolean): UserInterface | null {
  value = login
    ? {
        firstName: 'Jack',
        lastName: 'Sanders',
        email: 'jack.sanders@mail.com'
      }
    : null;

  return value;
}

export default function useLogin() {
  const [user, dispatch] = useState(value);

  return {
    user,
    login: () => dispatch(setValue(true)),
    logout: () => dispatch(setValue(false))
  };
}
