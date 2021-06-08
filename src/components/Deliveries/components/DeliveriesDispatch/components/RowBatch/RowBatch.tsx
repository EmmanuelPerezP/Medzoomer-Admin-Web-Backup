import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import TableItem from '../../../TableItem';
import styles from './RowBatch.module.sass';
import useDelivery from '../../../../../../hooks/useDelivery';
import classNames from 'classnames';
import { Delivery } from '../../../../../../interfaces';

interface Props {
  data: any;
  searchMeta: {
    order_uuid: number | null;
    isSearchByOrder: boolean;
  };
}

const collapsedText = {
  [String(true)]: 'Show more',
  [String(false)]: 'Show less'
};

// ? is return cash delivery
const isRC = (delivery: Delivery) => delivery.type && delivery.type === 'RETURN_CASH';

export const RowBatch: FC<Props> = ({ data, searchMeta: { order_uuid, isSearchByOrder } }) => {
  const { updateNameBatch } = useDelivery();
  const [label, setLabel] = useState(data.label ? data.label : moment(data.dateDispatch).format('lll'));
  const [needSaveLabel, setNeedSaveLabel] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [displayList, setDisplayList] = useState<any[]>([]);

  const showCollapseButton = isSearchByOrder && data.deliveries.length > 1;

  useEffect(() => {
    const oldLabel = data.label ? data.label : moment(data.dateDispatch).format('lll');
    if (label !== oldLabel) {
      setNeedSaveLabel(true);
    } else {
      setNeedSaveLabel(false);
    }
  }, [label, data]);

  useEffect(() => {
    setDisplayList(isSearchByOrder && isCollapsed ? getNeededOrderInArray() : data.deliveries);
    // eslint-disable-next-line
  }, [data.deliveries]);

  const onSaveTitle = useCallback(() => {
    void updateNameBatch(label, data._id).then(() => {
      setNeedSaveLabel(false);
    });
  }, [updateNameBatch, label, data]);

  const onCancelTitle = useCallback(() => {
    setLabel(data.label ? data.label : moment(data.dateDispatch).format('lll'));
  }, [data]);

  const handleCollapseChange = useCallback(() => {
    setDisplayList(isCollapsed ? data.deliveries : getNeededOrderInArray());
    setIsCollapsed(!isCollapsed);
    // eslint-disable-next-line
  }, [setIsCollapsed, isCollapsed]);

  const getNeededOrderInArray = useCallback(() => {
    const order = data.deliveries.find((item: any) => item.order_uuid === order_uuid);
    return order ? [order] : [];
  }, [data.deliveries, order_uuid]);

  const renderCollapseController = () =>
    showCollapseButton && (
      <div className={styles.collapseContainer}>
        <div className={styles.collapseInnterContainer}>
          <span className={styles.collapseButton} onClick={handleCollapseChange}>
            {collapsedText[String(isCollapsed)] + ` (${data.deliveries.length})`}
          </span>
        </div>
      </div>
    );

  if (!data) return null;

  return (
    <div>
      <div className={styles.groupTitleBox} style={isSearchByOrder ? { marginBottom: 0 } : {}}>
        <input
          onChange={(e) => setLabel(e.target.value)}
          value={label}
          className={styles.groupTitle}
          style={{
            minWidth: label.length + 'ch'
          }}
        />
        {needSaveLabel && (
          <>
            <IconButton size="small" onClick={onCancelTitle}>
              <ClearIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onSaveTitle}>
              <DoneIcon color="action" fontSize="small" />
            </IconButton>
          </>
        )}
      </div>
      {renderCollapseController()}
      <div className={styles.deliveries}>
        {displayList.map((row: any) => (
          <div key={row._id} className={classNames(styles.tableItem_Box, { [styles.rcRow]: isRC(row) })}>
            <TableItem data={{ ...row, pharmacy: data.pharmacy }} path={'/dashboard/orders'} />
          </div>
        ))}
      </div>
    </div>
  );
};
