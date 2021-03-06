import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import SVGIcon from '../../../../../common/SVGIcon';
import ConfirmationModal from '../../../../../common/ConfirmationModal';
import EditRelatedUserModal from '../EditRelatedUserModal';
import SetRelatedUserStatusModal from '../SetRelatedUserStatusModal';
import { PharmacyUser, PharmacyUserStatus } from '../../../../../../interfaces';
import usePharmacy from '../../../../../../hooks/usePharmacy';

import styles from '../../PharmacyInfo.module.sass';
import Grid from '@material-ui/core/Grid';

export interface PharmacyUsersProps {
  getPharmacyById: () => void;
  pharmacyId?: string;
  pharmacyGroupId?: string;
  title?: string;
  users: PharmacyUser[] | undefined;
  // Only on create-group mode
  onUsersChanged?(users: Partial<PharmacyUser>[]): void;
  mode?: 'list' | 'create-group';
  hideRole?: boolean;
}

export const getStatusColor = (status: PharmacyUserStatus) => {
  switch (status) {
    case 'PENDING':
      return '#72ccff';
    case 'DECLINED':
      return '#ff7272';
    case 'ACTIVE':
      return '#83e363';
    default:
      return '#000000';
  }
};

export const PharmacyUsers: FC<PharmacyUsersProps> = ({
  mode = 'list',
  hideRole,
  title,
  users = [],
  getPharmacyById,
  pharmacyId,
  pharmacyGroupId: groupId,
  onUsersChanged
}) => {
  const { removePharmacyAdmin, pharmacyAdminForgotPassword } = usePharmacy();

  const [loading, setLoading] = useState<boolean>(false);
  const [forgotPasswordUserModal, setForgotPasswordUserModal] = useState<boolean>(false);
  const [relatedUserModal, setRelatedUserModal] = useState<boolean>(false);
  const [removeRelatedUserModal, setRemoveRelatedUserModal] = useState<boolean>(false);
  const [updateUserStatusModal, setUpdateUserStatusModal] = useState<boolean>(false);
  const [checkedRelatedUser, setCheckedRelatedUser] = useState<undefined | PharmacyUser>(undefined);

  const toggleRelatedUserModal = () => {
    setCheckedRelatedUser(undefined);
    setRelatedUserModal(!relatedUserModal);
  };

  const onSetUserStatusModal = (user: PharmacyUser) => {
    setCheckedRelatedUser(user);
    setUpdateUserStatusModal(true);
  };

  const toggleSetUserStatusModal = () => {
    setUpdateUserStatusModal(!updateUserStatusModal);
  };

  const onForgotUserPasswordModal = (user: PharmacyUser) => {
    setCheckedRelatedUser(user);
    setForgotPasswordUserModal(true);
  };

  const toggleForgotUserPasswordModal = () => {
    setForgotPasswordUserModal(!forgotPasswordUserModal);
  };

  const onEditRelatedUserModal = (user: PharmacyUser) => {
    setCheckedRelatedUser(user);
    setRelatedUserModal(true);
  };

  const toggleRemoveRelatedUserModal = () => {
    setRemoveRelatedUserModal(!removeRelatedUserModal);
  };

  const onRemoveRelatedUserModal = (user: PharmacyUser) => {
    setCheckedRelatedUser(user);
    setRemoveRelatedUserModal(true);
  };

  const onRemoveRelatedUser = () => {
    if (mode === 'create-group') {
      if (!onUsersChanged) return;
      onUsersChanged(users.filter((u) => checkedRelatedUser !== u));
      toggleRemoveRelatedUserModal();
      return;
    }
    setLoading(true);
    removePharmacyAdmin(checkedRelatedUser ? checkedRelatedUser.email : '')
      .then(() => {
        setLoading(false);
        toggleRemoveRelatedUserModal();
        getPharmacyById();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSendForgotPasswordEmail = () => {
    setLoading(true);
    pharmacyAdminForgotPassword(checkedRelatedUser ? checkedRelatedUser.email : '')
      .then(() => {
        setLoading(false);
        toggleForgotUserPasswordModal();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={styles.lastBlock}>
        <div className={styles.nextBlock}>
          <Grid container justify={'space-between'} alignItems={'center'}>
            <Grid item>
              <Typography style={{ fontSize: 18, fontWeight: 500, paddingBottom: 0 }}>
                {title || 'Related Users'}
              </Typography>
            </Grid>
            <Grid item>
              <Button className={styles.addUserBtn} variant="contained" onClick={toggleRelatedUserModal}>
                <Typography className={styles.summaryText}>Add User</Typography>
              </Button>
            </Grid>
          </Grid>
          {users && users.length ? (
            <Table className={styles.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Full name</TableCell>
                  {!hideRole && <TableCell>Role</TableCell>}
                  {mode !== 'create-group' && <TableCell>Status</TableCell>}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user: PharmacyUser, key: string | number | undefined) => {
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        {user.name} {user.family_name}
                      </TableCell>
                      {!hideRole && <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>}
                      {mode !== 'create-group' && (
                        <TableCell style={{ color: getStatusColor(user.status) }}>
                          {user.status ? user.status.toLowerCase() : '-'}
                        </TableCell>
                      )}
                      <TableCell align="right">
                        {mode !== 'create-group' && (
                          <React.Fragment>
                            <Tooltip title="Set status" placement="top" arrow>
                              <IconButton>
                                <SVGIcon
                                  onClick={() => onSetUserStatusModal(user)}
                                  className={styles.userActionIcon}
                                  name={'reset'}
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset password" placement="top" arrow>
                              <IconButton>
                                <SVGIcon
                                  onClick={() => onForgotUserPasswordModal(user)}
                                  className={styles.userActionIcon}
                                  name={'passwordActive'}
                                />
                              </IconButton>
                            </Tooltip>
                          </React.Fragment>
                        )}
                        <Tooltip title="Edit user" placement="top" arrow>
                          <IconButton>
                            <SVGIcon
                              onClick={() => onEditRelatedUserModal(user)}
                              className={styles.userActionIcon}
                              name={'edit'}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete user" placement="top" arrow>
                          <IconButton>
                            <SVGIcon
                              onClick={() => onRemoveRelatedUserModal(user)}
                              className={styles.userActionIcon}
                              name={'remove'}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className={styles.usersEmptyList}>No related users added yet</div>
          )}
        </div>
      </div>

      <SetRelatedUserStatusModal
        checkedRelatedUser={checkedRelatedUser}
        handleModal={toggleSetUserStatusModal}
        isOpen={updateUserStatusModal}
        getPharmacyById={getPharmacyById}
      />

      <ConfirmationModal
        title={'Restore password'}
        subtitle={`Send restore email to ${checkedRelatedUser ? checkedRelatedUser.email : ''}`}
        isOpen={forgotPasswordUserModal}
        handleModal={toggleForgotUserPasswordModal}
        loading={loading}
        onConfirm={onSendForgotPasswordEmail}
      />

      <EditRelatedUserModal
        isOpen={relatedUserModal}
        handleModal={toggleRelatedUserModal}
        checkedRelatedUser={checkedRelatedUser}
        getPharmacyById={getPharmacyById}
        pharmacyId={pharmacyId}
        pharmacyGroupId={groupId}
        allowChangeEmail={mode === 'create-group'}
        handleSubmit={
          mode === 'create-group'
            ? async (user) => {
                if (!onUsersChanged) return;
                if (checkedRelatedUser) {
                  // Edit
                  onUsersChanged(
                    users.map((u) => {
                      if (u === checkedRelatedUser) {
                        return { ...u, ...user };
                      }
                      return u;
                    })
                  );
                } else {
                  // Create
                  onUsersChanged([...users, user]);
                }
              }
            : undefined
        }
      />

      <ConfirmationModal
        title={'Remove the related user?'}
        subtitle={checkedRelatedUser ? checkedRelatedUser.email : ''}
        isOpen={removeRelatedUserModal}
        handleModal={toggleRemoveRelatedUserModal}
        loading={loading}
        onConfirm={onRemoveRelatedUser}
      />
    </>
  );
};
