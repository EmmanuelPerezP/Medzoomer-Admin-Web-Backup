import { Button, Typography } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState, Component } from 'react';
import useUser from '../../hooks/useUser';
import { User } from '../../interfaces';
import { useStores } from '../../store';
import Input from '../common/Input';

import styles from './AdminSettings.module.sass';
import Image from '../common/Image';
import moment from 'moment-timezone';

class MySelect extends Component<{}, { value: string }> {
  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      value: ''
    };
    this.change = this.change.bind(this);
  }

  public change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ value: event.target.value });
  };

  public getTimezones() {
    const names = moment.tz.names();
    const timezones: Array<{ value: string; label: string }> = [];
    names.forEach((timezone) => {
      const label = `${timezone} (GMT${moment.tz(timezone).format('Z')})`;
      timezones.push({ value: timezone, label });
    });
    return timezones;
  }

  public render() {
    return (
      <div>
        <select className={styles.timezone} id="lang" onChange={this.change} value={this.state.value}>
          {this.getTimezones().map((timezone) => {
            return <option value={timezone.value}>{timezone.label}</option>;
          })}
        </select>
      </div>
    );
  }
}

export const AdminSettings: FC = () => {
  const { userStore, timezoneStore } = useStores();
  const { getAdminSettings } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTimezone, setSelectedTimezone] = useState({ value: '', label: '' });

  const handleGetAdminSettings = useCallback(async () => {
    // if (!userStore.get('updated')) {
    setIsLoading(true);
    const response = await getAdminSettings().catch((error) => {
      return { error };
    });
    if (response.error) {
      setIsLoading(false);
      alert('Something went wrong while getting your data.');
      return;
    }
    const adminInfo = {
      ...response.data.user,
      picture:
        typeof response.data.user.picture !== 'string' ? response.data.user.picture.key : response.data.user.picture
    };
    for (const [key, value] of Object.entries(adminInfo)) {
      userStore.set(key as keyof User)(value);
    }
    console.log(adminInfo);
    setIsLoading(false);
    // userStore.set('updated')(true);
    // }
  }, [userStore, getAdminSettings]);

  const handleSaveChanges = useCallback(async () => {
    console.log('Pressed Button');
  }, []);

  useEffect(() => {
    handleGetAdminSettings();
  }, []);

  const renderInputs = () => {
    const fields = [
      { name: 'Name', value: 'name' },
      { name: 'Last Name', value: 'family_name' },
      { name: 'Email', value: 'email' },
      { name: 'Phone Number', value: 'phone_number' }
    ];
    return (
      <div className={styles.inputsWrapper}>
        {fields.map((element) => {
          return (
            <div className={styles.inputWrapper}>
              <Typography className={styles.inputTitle} key={`Typography ${element.name}`}>
                {element.name}
              </Typography>
              <Input
                key={`Input ${element.name}`}
                className={styles.input}
                value={userStore.get(element.value as keyof User) ? userStore.get(element.value as keyof User) : ''}
                placeholder={element.name}
                onChange={() => {}}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderImageWrapper = () => {
    return (
      <div className={styles.imageWrapper}>
        <Image
          cognitoId={userStore.get('cognitoId')}
          src={userStore.get('picture')}
          className={styles.image}
          alt="Avatar"
        />
        <button className={styles.uploadButton}>Upload New Picture</button>
        <Typography className={styles.delete}>Delete Picture</Typography>
      </div>
    );
  };

  useEffect(() => {
    console.log(selectedTimezone);
  }, [selectedTimezone]);

  const renderTimeZone = () => {
    return (
      <div className={styles.timezoneWrapper}>
        <div className={styles.lineTop}/>
        <div className={styles.titleAndTimezone}>
          <Typography className={styles.title}>Timezone</Typography>
          <MySelect />
        </div>
        <div className={styles.lineDown}/>
      </div>
    );
  };

  return (
    <div className={styles.adminSettingsWrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.upperWrapper}>
          <div className={styles.leftWrapper}>
            <Typography className={styles.profile}>Profile</Typography>
            {renderImageWrapper()}
          </div>
          {renderInputs()}
        </div>
        <div className={styles.lowerWrapper}>
          {renderTimeZone()}
          <Button className={styles.updateButton} onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
