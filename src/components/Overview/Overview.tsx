import React, { FC, useState } from 'react';
import classNames from 'classnames';
import uuid from 'uuid/v4';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import Link from '@material-ui/core/Link';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import SVGIcon from '../common/SVGIcon';
import Select from '../common/Select';

import styles from './Overview.module.sass';

const items = [
  {
    id: uuid(),
    name: 'Dima',
    family_name: 'Povetkin',
    picture: '',
    email: 'dmitriy.povetkin@nordwhale.com'
  },
  {
    id: uuid(),
    name: 'Dima',
    family_name: 'Povetkin',
    picture:
      'data:image/jpeg;base64,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',
    email: 'dmitriy.povetkin@nordwhale.com'
  },
  {
    id: uuid(),
    name: 'Dima',
    family_name: 'Povetkin',
    picture:
      'data:image/jpeg;base64,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',
    email: 'dmitriy.povetkin@nordwhale.com'
  }
];

const selectItems = [
  { value: 'Last 30 days', label: 'Last 30 days' },
  { value: 'Last 7 days', label: 'Last 7 days' },
  { value: 'Last day', label: 'Last day' }
];

export const Overview: FC = () => {
  const [inputValue, setInputValue] = useState<string>(selectItems[0].value);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInputValue(event.target.value as string);
  };

  const renderHeaderBlock = () => {
    return (
      <div className={styles.metrics}>
        <div className={styles.header}>
          <span style={{ width: '100%' }} />
          <Typography className={styles.mainTitle}>Overview</Typography>
          <Select
            value={inputValue}
            onChange={handleChange}
            items={selectItems}
            IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
            classes={{ input: styles.input, root: styles.select, inputRoot: styles.inputRoot }}
          />
        </div>
        <div className={styles.moneyWrapper}>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Orders Placed</Typography>
            <Typography className={styles.money}>273</Typography>
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>Revenue</Typography>
            <Typography className={classNames(styles.money, styles.earned)}>
              $4852
              <span className={styles.pennies}>.70</span>
            </Typography>
          </div>
          <div className={styles.moneyBlock}>
            <Typography className={styles.title}>New Customers</Typography>
            <Typography className={styles.money}>190</Typography>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = (users: object[], type: string, path: string) => {
    return (
      <div className={styles.userBlock}>
        <div className={classNames(styles.header, styles.userHeader)}>
          <Typography className={styles.title}>
            <span className={styles.count}>{users.length}</span> New {type}
          </Typography>
          <Link href={path} className={styles.link}>
            View All
          </Link>
        </div>
        <Table>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id} className={styles.tableItem}>
                <TableCell className={styles.picture}>
                  {row.picture ? (
                    <img className={styles.avatar} src={row.picture} alt="" />
                  ) : (
                    <div
                      className={styles.avatar}
                    >{`${row.name[0].toUpperCase()} ${row.family_name[0].toUpperCase()}`}</div>
                  )}
                </TableCell>
                <TableCell className={styles.name}>{`${row.name} ${row.family_name}`}</TableCell>
                <TableCell className={styles.email} align="right">
                  {row.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className={styles.overviewWrapper}>
      {renderHeaderBlock()}
      <div className={styles.usersWrapper}>
        {renderUsers(items, 'Courier', `/dashboard/couriers`)}
        {renderUsers(items, 'Consumers', `/dashboard/consumers`)}
      </div>
    </div>
  );
};
