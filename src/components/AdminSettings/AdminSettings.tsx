import { Button, Typography } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import { useStores } from '../../store';
import Input from '../common/Input';

import styles from './AdminSettings.module.sass';
import Image from '../common/Image';
import moment from 'moment-timezone';

export const AdminSettings: FC = () => {
  const user = useUser();

  const [timezoneValue, setTimezoneValue] = useState('');
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const getSetState = (type: string) => {
    if (type === 'name') return setName;
    if (type === 'family_name') return setFamilyName;
    if (type === 'email') return setEmail;
    if (type === 'phone_number') return setPhoneNumber;
  };

  function MySelect() {
    const { userStore } = useStores();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTimezoneValue(event.target.value);
      userStore.set('timezone')(timezoneValue);
    };

    const getTimezones = () => {
      const names = moment.tz.names();
      const timezones: Array<{ value: string; label: string }> = [];
      names.forEach((timezone) => {
        const label = `${timezone} (GMT${moment.tz(timezone).format('Z')})`;
        timezones.push({ value: timezone, label });
      });
      return timezones;
    };

    return (
      <div>
        <select className={styles.timezone} id="lang" onChange={handleChange} value={timezoneValue}>
          {getTimezones().map((timezone) => {
            return (
              <option className={styles.option} value={timezone.value}>
                {timezone.label}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  const handleGetAdminSettings = useCallback(async () => {
    const response = await user.getAdminSettings().catch((error) => {
      return { error };
    });
    if (response.error) {
      alert('Something went wrong while getting your data.');
      return;
    }
    const adminInfo = {
      ...response.data.user
    };
    user.setUser(adminInfo);
    setName(adminInfo.name);
    setFamilyName(adminInfo.family_name);
    setEmail(adminInfo.email);
    setPhoneNumber(adminInfo.phone_number);
  }, [user, setName, setFamilyName, setEmail, setPhoneNumber]);

  useEffect(() => {
    handleGetAdminSettings();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const value = event.target.value;
    const state = getSetState(type);
    if (state) {
      state(value);
    }
  };

  const renderInputs = () => {
    return (
      <div className={styles.inputsWrapper}>
        <div className={styles.inputWrapper}>
          <Typography className={styles.inputTitle}>{'Name'}</Typography>
          <Input
            key={'name'}
            className={styles.input}
            value={name}
            placeholder={'Name'}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event, 'name');
            }}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Typography className={styles.inputTitle}>{'Last Name'}</Typography>
          <Input
            key={'family_name'}
            className={styles.input}
            value={familyName}
            placeholder={'Last Name'}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event, 'family_name');
            }}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Typography className={styles.inputTitle}>{'Email'}</Typography>
          <Input
            key={'email'}
            className={styles.input}
            value={email}
            placeholder={'Email'}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event, 'email');
            }}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Typography className={styles.inputTitle}>{'Phone Number'}</Typography>
          <Input
            key={'phone_number'}
            className={styles.input}
            value={phoneNumber}
            placeholder={'Phone Number'}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(event, 'phone_number');
            }}
          />
        </div>
      </div>
    );
  };

  const handleSaveChanges = useCallback(async () => {
    console.log('Pressed Button');

    console.log(user);
  }, []);

  const renderImageWrapper = () => {
    return (
      <div className={styles.imageWrapper}>
        <Image cognitoId={user.sub} src={user.picture.preview} className={styles.image} alt="Avatar" />
        <button className={styles.uploadButton}>Upload New Picture</button>
        <Typography className={styles.delete}>Delete Picture</Typography>
      </div>
    );
  };

  const renderTimeZone = () => {
    return (
      <div className={styles.timezoneWrapper}>
        <div className={styles.lineTop} />
        <div className={styles.titleAndTimezone}>
          <Typography className={styles.title}>Timezone</Typography>
          <MySelect />
        </div>
        <div className={styles.lineDown} />
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
