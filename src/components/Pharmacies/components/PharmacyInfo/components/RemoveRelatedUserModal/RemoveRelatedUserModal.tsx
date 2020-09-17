import React, { FC, useState } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import { PharmacyUser } from '../../../../../../interfaces';
import usePharmacy from '../../../../../../hooks/usePharmacy';

import styles from './RemoveRelatedUserModal.module.sass';

interface RemoveRelatedUserModalProps {
  isOpen: boolean;
  handleModal: () => void;
  checkedRelatedUser: PharmacyUser | undefined;
  getPharmacyById: () => void;
}

export const RemoveRelatedUserModal: FC<RemoveRelatedUserModalProps> = (props) => {
  const { isOpen, handleModal, checkedRelatedUser, getPharmacyById } = props;

  const { removePharmacyAdmin } = usePharmacy();

  const [loading, setLoading] = useState(false);

  const onRemoveRelatedUser = () => {
    setLoading(true);
    removePharmacyAdmin(checkedRelatedUser ? checkedRelatedUser.email : '')
      .then(() => {
        setLoading(false);
        handleModal();
        getPharmacyById();
      })
      .catch(() => {
        setLoading(false);
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
      <Typography className={styles.title}>{'Remove the related user?'}</Typography>

      <div className={styles.content}>{checkedRelatedUser ? checkedRelatedUser.email : ''}</div>

      <div className={styles.buttonWrapper}>
        <Button
          className={styles.apply}
          variant="contained"
          color="secondary"
          disabled={loading}
          onClick={onRemoveRelatedUser}
        >
          <Typography>{'Confirm'}</Typography>
        </Button>

        <div onClick={handleModal} className={styles.cancelBtn}>
          Cancel
        </div>
      </div>
    </Modal>
  );
};
