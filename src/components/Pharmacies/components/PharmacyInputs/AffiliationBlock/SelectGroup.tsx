import React, { useState, useEffect, useCallback } from 'react';
import usePharmacy from '../../../../../hooks/usePharmacy';
import { useStores } from '../../../../../store';
import Select from '../../../../common/Select';
import SVGIcon from '../../../../common/SVGIcon';
import Loading from '../../../../common/Loading';
import styles from './styles.module.sass';
import useGroup from '../../../../../hooks/useGroup';
import { Typography } from '@material-ui/core';

interface IGroup {
  label: string,
  value: string
}

const SelectGroup = () => {
  const [groupsList, setGroupsList]  = useState<IGroup[]>([]);
  const { pharmacyStore } = useStores();
  const { newPharmacy } = usePharmacy();
  const { getGroups } = useGroup();
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState<IGroup[]>( []);

  useEffect(() => {
    getSettingList().catch();
  }, []);

  const handleChange =  (e: React.ChangeEvent<{ value: string }>) => {
    const { value } = e.target;
    const selectedGroups:IGroup[] = [...groups, { label: value, value }]
    setGroups(selectedGroups)
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, groups: selectedGroups.map((gp: IGroup ) => (gp.label)) });
  };

  const getSettingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await getGroups({
        page: 0,
        perPage: 1000,
        search: ''
      });
      const grpListMapped:IGroup[] = data.map((item: any) => {
        return { value: item._id, label: item.name };
      })
      setGroupsList(grpListMapped)
      setGroups(newPharmacy.groups.map((gp:any ) => ( {value:gp, label:gp} )))
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  const removeGroup = (deleteGroup:IGroup)=>{
    const selectedGroups = groups.filter(grp => grp.value !== deleteGroup.value)
    setGroups(selectedGroups);
    pharmacyStore.set('newPharmacy')({ ...newPharmacy, groups: selectedGroups.map((gp: IGroup ) => (gp.label)) });
  }

  const mapGroup = (group:IGroup)=>{
    // @ts-ignore
    return groupsList.filter(grp => grp.value === group.value)[0].label
  }
  // @ts-ignore
  return (
    <>
      <div>
        {isLoading ? <Loading />:  (
            groupsList.length  && (
              <Select
                label="Select Group"
                value={''}
                onChange={handleChange}
                items={groupsList}
                IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
              />
            )
        )}
        <ul>
          {groups.length === 0 ? null : (groups.map((group: IGroup ) => (
            <li key={group.value} className={styles.groupList}>
              <Typography>{mapGroup(group)}</Typography>
              <button onClick={()=>removeGroup(group)}>x</button>
            </li>
          )))}
        </ul>
      </div>
    </>
  );
};

export default SelectGroup;
