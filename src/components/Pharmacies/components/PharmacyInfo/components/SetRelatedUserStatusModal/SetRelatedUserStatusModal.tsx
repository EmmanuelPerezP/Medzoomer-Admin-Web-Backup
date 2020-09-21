import React, { FC, useState } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { PharmacyUser, PharmacyUserStatus } from '../../../../../../interfaces';
import usePharmacy from '../../../../../../hooks/usePharmacy';
import Loading from '../../../../../common/Loading';

import styles from './SetRelatedUserStatusModal.module.sass';

interface SetRelatedUserStatusModalProps {
  isOpen: boolean;
  handleModal: () => void;
  checkedRelatedUser: PharmacyUser | undefined;
  getPharmacyById: () => void;
}

export const SetRelatedUserStatusModal: FC<SetRelatedUserStatusModalProps> = (props) => {
  const { isOpen, handleModal, checkedRelatedUser, getPharmacyById } = props;

  const { pharmacyUserSetStatus } = usePharmacy();

  const [loading, setLoading] = useState(false);

  const onUpdateUserStatus = (status: PharmacyUserStatus) => {
    setLoading(true);
    pharmacyUserSetStatus({
      user: checkedRelatedUser ? checkedRelatedUser._id : '',
      status
    })
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
      <Typography className={styles.title}>{'Change status for user'}</Typography>

      <div className={styles.content}>{checkedRelatedUser ? checkedRelatedUser.email : ''}</div>

      {loading ? (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      ) : (
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.deny}
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={() => onUpdateUserStatus('DECLINED')}
          >
            <Typography>{'Deny'}</Typography>
          </Button>

          <Button
            className={styles.approve}
            variant="contained"
            color="secondary"
            disabled={loading}
            onClick={() => onUpdateUserStatus('ACTIVE')}
          >
            <Typography>{'Approve'}</Typography>
          </Button>

          <div onClick={handleModal} className={styles.cancelBtn}>
            Cancel
          </div>
        </div>
      )}
    </Modal>
  );
};
