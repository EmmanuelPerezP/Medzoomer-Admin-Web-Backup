import { Button, Typography } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import useUser from '../../hooks/useUser';
import Input from '../common/Input';

import styles from './AdminSettings.module.sass';
import moment from 'moment-timezone';
import useAuth from '../../hooks/useAuth';
import { FormControl } from '@material-ui/core';
import uuid from 'uuid';
import { deleteAdminImage } from '../../store/actions/user';
import Image from '../common/Image';

export const AdminSettings: FC = () => {
  const user = useUser();
  const { logOut } = useAuth();

  const [timezoneValue, setTimezoneValue] = useState<string>('UTC');
  const [name, setName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [picture, setPicture] = useState<{ key: string; preview: string }>({ key: '', preview: '' });
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [deleteImage, setDeleteImage] = useState<boolean>(false);

  const getSetState = (type: string) => {
    if (type === 'name') return setName;
    if (type === 'family_name') return setFamilyName;
    if (type === 'email') return setEmail;
    if (type === 'phone_number') return setPhoneNumber;
  };

  function MySelect() {
    // tslint:disable-next-line:no-shadowed-variable
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTimezoneValue(event.target.value);
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
              // tslint:disable-next-line:jsx-key
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
    const response = await user.getAdminSettings(user.email).catch((error) => {
      return { error };
    });
    if (response.error) {
      alert(response.error);
      return;
    }
    const adminInfo = {
      ...response.data.user
    };
    user.setUser(adminInfo);
    if (adminInfo.name) setName(adminInfo.name);
    if (adminInfo.family_name) setFamilyName(adminInfo.family_name);
    if (adminInfo.email) setEmail(adminInfo.email);
    if (adminInfo.phone_number) setPhoneNumber(adminInfo.phone_number);
    if (adminInfo.timezone) setTimezoneValue(adminInfo.timezone);
    if (adminInfo.picture) setPicture(adminInfo.picture);
  }, [user, setName, setFamilyName, setEmail, setPhoneNumber, setTimezoneValue, setPicture]);

  useEffect(() => {
    handleGetAdminSettings().catch();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const value = event.target.value;
    const state = getSetState(type);
    if (state) {
      state(value);
    }
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      setUploaded(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [uploaded]);

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
    const info = { name, family_name: familyName, email, phone_number: phoneNumber, timezone: timezoneValue, picture };

    const response = await user.updateAdmin(info).catch((error) => {
      return { error };
    });
    if (!response.error) {
      const changedEmail = user.email !== info.email;

      if (deleteImage) {
        // tslint:disable-next-line:handle-callback-err
        const responseDeleteImage = await deleteAdminImage(user.sub, user.picture.key).catch((error) => {
          return { error };
        });
        if (responseDeleteImage.error) alert('There was an error while deleting your image');

        setPicture({ key: '', preview: '' });

        setDeleteImage(false);
      }

      user.setUser(info);
      setUploaded(true);

      if (changedEmail) {
        alert('Please login again!');
        await logOut();
      }
    }
  }, [user, name, familyName, email, phoneNumber, timezoneValue, picture, deleteImage, setDeleteImage, logOut]);

  const handleUploadImage = () => async (evt: any) => {
    if (evt.target.files[0].type === 'image/bmp') {
      return;
    }
    if (evt.target.files[0].type.includes('image')) {
      const size = { width: 90, height: 90 };
      const file = evt.target.files[0];
      if (file) {
        const response = await user.uploadImage(user.sub, file, size).catch((error) => {
          return { error };
        });
        if (response.error) {
          alert('There was an error uploading your photo.\nPlease try again!');
          return;
        }
        if (response.links && response.keys) setPicture({ key: response.keys[0], preview: response.links[0] });
      }
    } else alert('Please upload an image.');
  };

  const handleDeleteAdminImage = useCallback(async () => {
    setDeleteImage(true);
  }, [setDeleteImage]);

  const renderImageWrapper = () => {
    const id = `id-${uuid()}`;
    return (
      <FormControl className={styles.imageWrapper}>
        <input type="file" onChange={handleUploadImage()} id={id} className={styles.imageInput} accept="image/*" />
        <div className={styles.imageHolder}>
          <Image
            cognitoId={user.sub}
            src={!deleteImage ? picture.key : ''}
            width={90}
            height={90}
            className={styles.image}
            alt="Avatar"
          />
        </div>
        <label htmlFor={id} className={styles.uploadLabel}>
          Upload New Picture
        </label>
        {picture.preview && !deleteImage ? (
          <Button className={styles.delete} onClick={handleDeleteAdminImage}>
            Delete Picture
          </Button>
        ) : null}
      </FormControl>
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
          <div className={styles.labelAndButtonWrapper}>
            <div className={styles.labelWrapper}>
              {uploaded ? (
                <label className={styles.successLabel}>The changes have been successfully saved.</label>
              ) : null}
            </div>
            <div className={styles.buttonWrapper}>
              <Button className={styles.updateButton} onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
