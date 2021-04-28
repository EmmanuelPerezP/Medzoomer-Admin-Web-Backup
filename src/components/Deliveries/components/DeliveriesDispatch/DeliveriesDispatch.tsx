import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import TableItem from '../TableItem';
import styles from './DeliveriesDispatch.module.sass';

interface Props {
  data: any;
  handleSaveTitle: any;
  path: string;
}

export const DeliveriesDispatch: FC<Props> = (props) => {
  const { data, handleSaveTitle, path } = props;
  const [title, setTitle] = useState('');

  const setCurrentTitle = () => {
    const item = data.get('deliveries')[0];
    setTitle(item.title || moment(item.createdAt).format('lll'));
  };

  useEffect(() => {
    if (data.get('deliveries').length && !title) {
      setCurrentTitle();
    }
    // eslint-disable-next-line
  }, [data, title]);

  const onSaveTitle = useCallback(() => {
    handleSaveTitle(title);
  }, [handleSaveTitle, title]);

  return (
    <div>
      <div className={styles.groupTitleBox}>
        <input onChange={(e) => setTitle(e.target.value)} value={title} className={styles.groupTitle} />
        {true && (
          <>
            <IconButton size="small" onClick={setCurrentTitle}>
              <ClearIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onSaveTitle}>
              <DoneIcon color="action" fontSize="small" />
            </IconButton>
          </>
        )}
      </div>
      <div className={styles.deliveries}>
        {data.get('deliveries').map((row: any) => (
          <div key={row._id} className={styles.tableItem_Box}>
            <TableItem data={row} path={path} />
          </div>
        ))}
      </div>
    </div>
  );
};
