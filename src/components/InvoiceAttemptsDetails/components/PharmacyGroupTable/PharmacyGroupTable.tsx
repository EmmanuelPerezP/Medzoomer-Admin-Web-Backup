import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IPharmacyGroupTable } from './types';
import styles from './PharmacyGroupTable.module.sass';

export const PharmacyGroupTable: FC<IPharmacyGroupTable> = ({ data = {} }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const listTemp: any = [];
    // tslint:disable-next-line:forin
    for (const row in data) {
      listTemp.push({
        ...data[row],
        _id: row
      });
    }
    setList(listTemp);
  }, [data, setList]);

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={classNames(styles.group, styles.leftAligned)}>Pharmacy</div>
        <div className={classNames(styles.group, styles.leftAligned)}>Address</div>
        <div className={styles.single}>Total Delivery</div>
        <div className={styles.single}>Invoice Amount</div>
      </div>
      {(list || []).length // TODO - replace data with pharmacies
        ? list.map((pharmacy: any) => {
            return (
              <div key={pharmacy._id} className={styles.tableItem}>
                <div className={classNames(styles.group, styles.leftAligned)}>
                  <Link to={`/dashboard/pharmacies/${pharmacy._id}`} className={styles.link}>
                    {pharmacy.name}
                  </Link>
                </div>

                <div className={classNames(styles.group, styles.leftAligned)}>
                  <Typography className={styles.value}>{pharmacy ? pharmacy.address : ''}</Typography>
                </div>

                <div className={styles.single}>
                  <Typography className={styles.value}>{pharmacy.countDeliveries}</Typography>
                </div>

                <div className={styles.single}>
                  <Typography className={styles.value}>${Number(pharmacy.total).toFixed(2)}</Typography>
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};
