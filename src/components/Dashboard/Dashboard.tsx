import React, { FC, useEffect, useState } from 'react';
import useLogin from '../../hooks/useLogin';
import { Redirect } from 'react-router';
import { useStores } from '../../store';
import { map } from 'rxjs/operators';

export const Dashboard: FC = () => {
  const { user, logout } = useLogin();
  const { test } = useStores();
  const [x, setX] = useState<boolean>(false);

  useEffect(() => {
    const profileSubscription = test
      .on('profile')
      .pipe(map((value) => Boolean(value && value.adult)))
      .subscribe((value) => {
        // console.log('map', value);
        setX(value);
      });

    return () => {
      profileSubscription.unsubscribe();
    };
  }, [test, x]);

  const addHandler = () => {
    test.set('profile')({
      name: 'My Name',
      age: Math.ceil(Math.random() * 100)
    });
  };

  const addHandler2 = () => {
    test.set('profile')({
      name: 'My Name',
      age: Math.ceil(Math.random() * 100),
      color: 'yellow'
    });
  };

  const rmHandler = () => {
    test.set('profile')(undefined);
  };

  if (!user) {
    return <Redirect to="/login"/>;
  }

  const { profile } = test.getState();

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>{x ? 'available' : 'forbidden'}</div>
        <div>{profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}</div>
        <div>
          <button onClick={addHandler}>Add Default</button>
          <button onClick={addHandler2}>Add Yellow</button>
          <button onClick={rmHandler}>delete</button>
        </div>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};
