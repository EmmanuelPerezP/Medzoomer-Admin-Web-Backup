import styles from './Grid.module.sass';
import React, { FC, useMemo, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';

import EmptyList from '../../../common/EmptyList';

import { IGridProps } from './types';
import { GridRow } from './GridRow';
import { GridHeader } from './GridHeader';
import Loading from '../../../common/Loading';
import { IBatch, IOrder } from '../../../../interfaces';
import useUser from '../../../../hooks/useUser';

const Loader = (
  <div className={classNames(styles.content, styles.loader)}>
    <Loading />
  </div>
);

export const Grid: FC<IGridProps> = ({ items, isLoading }) => {
  const user = useUser();

  const haveItems = useMemo(() => !!items.length, [items]);

  const renderItem = (item: IBatch, index: number) => {
    const isLastOne = items.length === index + 1;
    return (
      <Fragment key={index}>
        <GridRow item={item} user={user} />
        {!isLastOne && <div className={styles.divider} />}
      </Fragment>
    );
  };

  const Content = haveItems ? <div className={styles.content}>{items.map(renderItem)}</div> : <EmptyList />;

  return (
    <div className={styles.container}>
      <GridHeader />
      {isLoading ? Loader : Content}
    </div>
  );
};
