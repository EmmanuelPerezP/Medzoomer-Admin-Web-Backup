import { Checkbox } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import classNames from 'classnames';
import React, { FC, useCallback } from 'react';
import EmptyList from '../../../common/EmptyList';
import Loading from '../../../common/Loading';
import TableItem from '../TableItem';
import styles from './DeliveriesTable.module.sass';

interface Props {
  isLoading: boolean;
  data: any;
  path: string;
  activeTab: string;
  selected: any;
  setOpenDrawerGroup: any;
  setSelectedDeliveries: any;
}

export const DeliveriesTable: FC<Props> = (props) => {
  const { isLoading, data, selected, setSelectedDeliveries, setOpenDrawerGroup, path, activeTab } = props;
  const handleChangeCheckbox = useCallback(
    (event: any) => {
      const arr: any = selected;
      if (event.target.checked) {
        arr.push(event.target.name);
        setSelectedDeliveries([...arr]);
      } else {
        arr.splice(arr.indexOf(event.target.name), 1);
        setSelectedDeliveries([...arr]);
      }

      if (arr.length) {
        setOpenDrawerGroup(true);
      } else {
        setOpenDrawerGroup(false);
      }
    },
    [selected, setSelectedDeliveries, setOpenDrawerGroup]
  );

  return (
    <div>
      <div className={classNames(styles.deliveries, { [styles.isLoading]: isLoading })}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data.get('deliveries') && data.get('deliveries').length ? (
              data.get('deliveries').map((row: any) => (
                <div key={row._id} className={styles.tableItem_Box}>
                  {activeTab === 'dispatched' ? null : (
                    <Checkbox
                      name={row._id}
                      onChange={handleChangeCheckbox}
                      checked={selected.includes(row._id)}
                      icon={<RadioButtonUncheckedIcon fontSize="small" />}
                      checkedIcon={<CheckCircleIcon fontSize="small" />}
                    />
                  )}

                  <TableItem data={row} path={path} />
                </div>
              ))
            ) : (
              <EmptyList />
            )}
          </>
        )}
      </div>
    </div>
  );
};
