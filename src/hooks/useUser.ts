import { useStores } from '../store';
import {
  getUser,
  uploadImage,
  updateProfilePicture,
  updateProfile,
  uploadFile,
  getFileLink,
  getImageLink
} from '../store/actions/user';

function isJSON(str: string) {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
}

export default function useUser() {
  const { userStore } = useStores();

  return {
    ...userStore.getState(),
    getUser: () => getUser(),
    setUser: (userInfo: any) => {
      userInfo.name && userStore.set('name')(userInfo.name);
      userInfo.family_name && userStore.set('family_name')(userInfo.family_name);
      userInfo.insurance && userStore.set('insurance')(userInfo.insurance);
      userInfo.license && userStore.set('license')(userInfo.license);
      userInfo.sub && userStore.set('sub')(userInfo.sub);
      userInfo.cognitoId && userStore.set('cognitoId')(userInfo.cognitoId);
      userInfo.picture && userStore.set('picture')(userInfo.picture);
      userInfo.birthdate && userStore.set('birthdate')(userInfo.birthdate);
      userInfo.phone_number && userStore.set('phone_number')(userInfo.phone_number);
      userInfo.email && userStore.set('email')(userInfo.email);
      // For old Users
      if (isJSON(userInfo.address)) {
        const location = JSON.parse(userInfo.address);
        userStore.set('longitude')(location.longitude);
        userStore.set('latitude')(location.latitude);
        userStore.set('address')(location.address);
      } else {
        userInfo.longitude && userStore.set('longitude')(userInfo.longitude);
        userInfo.latitude && userStore.set('latitude')(userInfo.latitude);
        userInfo.address && userStore.set('address')(userInfo.address);
      }
    },
    removeUser: () => {
      userStore.set('name')('');
      userStore.set('family_name')('');
      userStore.set('license')('');
      userStore.set('insurance')('');
      userStore.set('birthdate')('');
      userStore.set('phone_number')('');
      userStore.set('email')('');
      userStore.set('sub')('');
      userStore.set('cognitoId')('');
      userStore.set('picture')('');
      userStore.set('address')('');
      userStore.set('latitude')('');
      userStore.set('longitude')('');
    },
    updateProfile: (options: any) => updateProfile(options),
    uploadImage: (userId: string, options: any, size: any) => uploadImage(userId, options, size),
    uploadFile: (userId: string, options: any) => uploadFile(userId, options),
    updateProfilePicture: (url: string) => updateProfilePicture(url),
    getFileLink: (key: string, fileName: string) => getFileLink(key, fileName),
    getImageLink: (key: string, fileName: string) => getImageLink(key, fileName)
  };
}
