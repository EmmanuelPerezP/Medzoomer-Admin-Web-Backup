import api from '../../api';

export const getUser = () => {
  return api.getUser();
};

export const completeProfile = (options: any) => {
  return api.completeProfile(options);
};

export const uploadImage = (userId: string, imageOptions: any, size: any) => {
  return api.uploadImage(userId, imageOptions, size);
};

export const updateProfilePicture = (url: string) => {
  return api.updateProfilePicture(url);
};

export const updateProfile = (options: any) => {
  return api.updateProfile(options);
};
