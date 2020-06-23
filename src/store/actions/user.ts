import api from '../../api';

export const getUser = () => {
  return api.getUser();
};

export const uploadImage = (userId: string, imageOptions: any, size: any) => {
  return api.uploadImage(userId, imageOptions, size);
};

export const uploadFile = (userId: string, fileOptions: any) => {
  return api.uploadFile(userId, fileOptions);
};

export const updateProfilePicture = (url: string) => {
  return api.updateProfilePicture(url);
};

export const updateProfile = (options: any) => {
  return api.updateProfile(options);
};

export const getFileLink = (key: string, fileName: string) => {
  return api.getFileLink(key, fileName);
};

export const getImageLink = (key: string, fileName: string) => {
  return api.getImageLink(key, fileName);
};
