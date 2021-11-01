import React from 'react';
import { PharmacyUsers } from '../../../Pharmacies/components/PharmacyInfo/components/PharmacyUsers/PharmacyUsers';
import useGroups from '../../../../hooks/useGroup';
import { useStores } from '../../../../store';
import Loading from '../../../common/Loading';
import Grid from '@material-ui/core/Grid';
import { PharmacyUser } from '../../../../interfaces';
import Typography from '@material-ui/core/Typography';

export type UsersProps = {
  groupId: string | undefined;
  temporalUsers: PharmacyUser[];
  updateTemporalUsers(users: PharmacyUser[]): void;
};

const basePharmacyUser: PharmacyUser = {
  _id: '',
  sub: '',
  name: '',
  family_name: '',
  email: '',
  phone_number: '',
  password: '',
  picture: '',
  createdAt: new Date().toISOString(),
  cognitoId: '',
  jobTitle: '',
  status: 'ACTIVE',
  isAdmin: true
};

export const Users = React.memo<UsersProps>(({ groupId, temporalUsers, updateTemporalUsers }) => {
  const [loading, setLoading] = React.useState(false);
  const { groupStore } = useStores();
  const { users, getGroupUsers } = useGroups();

  const fetchUsers = React.useCallback(
    () => {
      if (groupId) {
        setLoading(true);
        getGroupUsers(groupId)
          .then((users) => {
            groupStore.set('users')(Array.isArray(users) ? users : []);
          })
          .finally(() => setLoading(false));
      }
    },
    // eslint-disable-next-line
    [groupId]
  );

  React.useLayoutEffect(fetchUsers, [fetchUsers]);

  if (loading) {
    return (
      <Grid container justify={'center'}>
        <Grid item>
          <Loading />
        </Grid>
      </Grid>
    );
  }
  const creating = !groupId;
  return (
    <React.Fragment>
      <PharmacyUsers
        mode={creating ? 'create-group' : undefined}
        users={creating ? temporalUsers : users}
        hideRole
        getPharmacyById={fetchUsers}
        pharmacyGroupId={groupId}
        onUsersChanged={(users) => {
          updateTemporalUsers(
            users.map((x) => {
              return {
                ...basePharmacyUser,
                createdAt: new Date().toISOString(),
                ...x
              };
            })
          );
        }}
        title={'Related Admin Users'}
      />
      {creating && (
        <Typography style={{ marginTop: 48 }}>
          The group has not been created yet, users added here will be invited after the group is created.
        </Typography>
      )}
    </React.Fragment>
  );
});

Users.displayName = 'Users';

export default Users;
