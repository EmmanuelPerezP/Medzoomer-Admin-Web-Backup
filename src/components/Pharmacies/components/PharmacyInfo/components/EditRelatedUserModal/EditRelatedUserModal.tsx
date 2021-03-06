import React, { FC, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useRouteMatch } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SVGIcon from '../../../../../common/SVGIcon';
import { PharmacyUser } from '../../../../../../interfaces';
import TextField from '../../../../../common/TextField';
import Error from '../../../../../common/Error';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import { decodeErrors } from '../../../../../../utils';

import styles from './EditRelatedUserModal.module.sass';

interface EditRelatedUserModalProps {
  isOpen: boolean;
  handleModal: () => void;
  checkedRelatedUser: PharmacyUser | undefined;
  getPharmacyById: () => void;
  pharmacyId?: string;
  pharmacyGroupId?: string;
  allowChangeEmail?: boolean;
  handleSubmit?(user: Partial<PharmacyUser>): Promise<any>;
}

export const EditRelatedUserModal: FC<EditRelatedUserModalProps> = (props) => {
  const { isOpen, handleModal, checkedRelatedUser, getPharmacyById, handleSubmit, allowChangeEmail } = props;

  const { createPharmacyAdmin, updatePharmacyAdmin } = usePharmacy();

  const [userData, setUserData] = useState({
    name: '',
    family_name: '',
    email: '',
    phone_number: ''
  });
  const [err, setErr] = useState({ name: '', family_name: '', email: '', phone_number: '', global: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserData({
      name: checkedRelatedUser ? checkedRelatedUser.name : '',
      family_name: checkedRelatedUser ? checkedRelatedUser.family_name : '',
      email: checkedRelatedUser ? checkedRelatedUser.email : '',
      phone_number: checkedRelatedUser ? checkedRelatedUser.phone_number : ''
    });
  }, [checkedRelatedUser]);

  const handleChange = (key: string) => (e: React.ChangeEvent<{ value: unknown }>) => {
    setUserData({ ...userData, [key]: e.target.value });
    setErr({ ...err, [key]: '', global: '' });
  };

  const validation = (): boolean => {
    const errors: any = {};
    if (!userData.name) {
      errors.name = 'Required field';
    }
    if (!userData.family_name) {
      errors.family_name = 'Required field';
    }
    if (!userData.phone_number) {
      errors.phone_number = 'Required field';
    }
    if (!userData.email) {
      errors.email = 'Required field';
    }

    if (Object.keys(errors).length) {
      setErr({ ...errors });
      return false;
    }

    return true;
  };

  const onSubmitRelatedUser = () => {
    if (!validation()) {
      return;
    }
    setErr({ name: '', family_name: '', email: '', phone_number: '', global: '' });
    setLoading(true);
    const method = handleSubmit ? handleSubmit : checkedRelatedUser ? updatePharmacyAdmin : createPharmacyAdmin;
    const data: Partial<PharmacyUser> = { ...userData };
    if (props.pharmacyId) {
      data.pharmacy = props.pharmacyId;
    } else if (props.pharmacyGroupId) {
      data.pharmacyGroup = props.pharmacyGroupId;
    }
    method(data)
      .then(() => {
        setLoading(false);
        handleModal();
        setUserData({
          name: '',
          family_name: '',
          email: '',
          phone_number: ''
        });
        getPharmacyById();
      })
      .catch((error: any) => {
        setLoading(false);
        const errors = error.response && error.response.data;
        if (!errors) {
          setErr({ ...err, global: 'Something went wrong' });
        } else if (errors.message !== 'validation error' && errors.message !== 'Invalid phone number format.') {
          setErr({ ...err, global: errors.message });
        } else {
          setErr({ ...err, ...decodeErrors(errors.details) });
          if (errors.message === 'Invalid phone number format.') {
            setErr({ ...err, phone_number: 'Phone number is not valid' });
          }
        }
      });
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
            label={'First Name'}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Required'
            }}
            value={userData.name}
            onChange={handleChange('name')}
          />
          {err.name ? <Error className={styles.error} value={err.name} /> : null}
        </div>
        <div className={styles.inputWrapper}>
          <TextField
            label={'Last Name'}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Required'
            }}
            value={userData.family_name}
            onChange={handleChange('family_name')}
          />
          {err.family_name ? <Error className={styles.error} value={err.family_name} /> : null}
        </div>
        <div className={styles.inputWrapper}>
          <TextField
            label={'Email'}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Required'
            }}
            value={userData.email}
            onChange={handleChange('email')}
            disabled={!!checkedRelatedUser && !allowChangeEmail}
          />
          {err.email ? <Error className={styles.error} value={err.email} /> : null}
        </div>
        <div className={styles.inputWrapper}>
          <TextField
            label={'Phone Number'}
            classes={{
              root: styles.textField
            }}
            inputProps={{
              placeholder: 'Required'
            }}
            value={userData.phone_number}
            onChange={handleChange('phone_number')}
          />
          {err.phone_number ? <Error className={styles.error} value={err.phone_number} /> : null}
        </div>
      </div>

      {err.global ? <Error className={styles.globalError} value={err.global} /> : null}

      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          disabled={loading}
          onClick={onSubmitRelatedUser}
        >
          <Typography>{checkedRelatedUser ? 'Save' : 'Add'}</Typography>
        </Button>
      </div>
    </Modal>
  );
};
