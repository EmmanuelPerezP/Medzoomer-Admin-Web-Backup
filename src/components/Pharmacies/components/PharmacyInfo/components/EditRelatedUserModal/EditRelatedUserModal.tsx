import React, { FC, useState } from 'react';
import Modal from 'react-modal';

import styles from './EditRelatedUserModal.module.sass';
import SVGIcon from '../../../../../common/SVGIcon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { PharmacyUser } from '../../../../../../interfaces';
import TextField from '../../../../../common/TextField';

interface EditRelatedUserModalProps {
  isOpen: boolean;
  handleModal: () => void;
  handleSubmit: () => void;
  checkedRelatedUser: PharmacyUser | undefined;
}

export const EditRelatedUserModal: FC<EditRelatedUserModalProps> = (props) => {
  const { isOpen, handleModal, handleSubmit, checkedRelatedUser } = props;

  const [userData, setUserData] = useState({
    firstName: checkedRelatedUser ? checkedRelatedUser.firstName : '',
    lastName: checkedRelatedUser ? checkedRelatedUser.lastName : '',
    email: checkedRelatedUser ? checkedRelatedUser.email : '',
    phoneNumber: checkedRelatedUser ? checkedRelatedUser.phoneNumber : ''
  });
  const [err, setErr] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', global: '' });

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
    setUserData({ ...userData, [key]: e.target.value });
    setErr({ ...err, [key]: '', global: '' });
  };

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={handleModal}
      isOpen={isOpen}
      className={styles.modal}
    >
      <div className={styles.header}>
        <div />
        <Typography className={styles.title}>
          {checkedRelatedUser ? 'Edit Related User' : 'Add Related User'}
        </Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={handleModal} />
      </div>

      <div className={styles.content}>
        <div className={styles.inputWrapper}>
          <TextField
            label={''}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'First Name'
            }}
            value={userData.firstName}
            onChange={handleChange('firstName')}
          />
        </div>
        <div className={styles.inputWrapper}>
          <TextField
            label={''}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Last Name'
            }}
            value={userData.lastName}
            onChange={handleChange('lastName')}
          />
        </div>
        <div className={styles.inputWrapper}>
          <TextField
            label={''}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Email'
            }}
            value={userData.email}
            onChange={handleChange('email')}
          />
        </div>
        <div className={styles.inputWrapper}>
          <TextField
            label={''}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Phone Number'
            }}
            value={userData.phoneNumber}
            onChange={handleChange('phoneNumber')}
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          // disabled={isRequestLoading}
          onClick={handleSubmit}
        >
          <Typography>{checkedRelatedUser ? 'Save' : 'Add'}</Typography>
        </Button>
      </div>
    </Modal>
  );
};
