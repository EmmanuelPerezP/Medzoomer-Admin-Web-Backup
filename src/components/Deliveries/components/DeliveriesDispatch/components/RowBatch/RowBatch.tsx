import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import TableItem from '../../../TableItem';
import styles from './RowBatch.module.sass';
import useDelivery from '../../../../../../hooks/useDelivery';

interface Props {
  data: any;
}

export const RowBatch: FC<Props> = (props) => {
  const { data } = props;
  const { updateNameBatch } = useDelivery();
  const [label, setLabel] = useState(data.label ? data.label : moment(data.dateDispatch).format('lll'));
  const [needSaveLabel, setNeedSaveLabel] = useState(false);

  useEffect(() => {
    const oldLabel = data.label ? data.label : moment(data.dateDispatch).format('lll');
    if (label !== oldLabel) {
      setNeedSaveLabel(true);
    } else {
      setNeedSaveLabel(false);
    }
  }, [label, data]);

  const onSaveTitle = useCallback(() => {
    void updateNameBatch(label, data._id).then(() => {
      setNeedSaveLabel(false);
    });
  }, [updateNameBatch, label, data]);

  const onCancelTitle = useCallback(() => {
    setLabel(data.label ? data.label : moment(data.dateDispatch).format('lll'));
  }, [data]);

  if (!data) return null;

  return (
    <div>
      <div className={styles.groupTitleBox}>
        <input onChange={(e) => setLabel(e.target.value)} value={label} className={styles.groupTitle} />
        {needSaveLabel && (
          <>
            <IconButton
              size="small"
              onClick={() => {
                onCancelTitle();
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                onSaveTitle();
              }}
            >
              <DoneIcon color="action" fontSize="small" />
            </IconButton>
          </>
        )}
      </div>
      <div className={styles.deliveries}>
        {data.deliveries.map((row: any) => (
          <div key={row._id} className={styles.tableItem_Box}>
            <TableItem data={{ ...row, pharmacy: data.pharmacy }} path={'/dashboard/orders'} />
          </div>
        ))}
      </div>
    </div>
  );
};
