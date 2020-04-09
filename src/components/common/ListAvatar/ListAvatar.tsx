import React, { useEffect, useCallback, useState } from 'react';
import classNames from 'classnames';
import useUser from '../../../hooks/useUser';
import Loading from '../../common/Loading';

import styles from './ListAvatar.module.sass';

export const ListAvatar = ({ className, src, cognitoId }: { src: string; cognitoId: string; className?: string }) => {
  const { getImageLink } = useUser();
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getImage = useCallback(async () => {
    try {
      const { link } = await getImageLink(cognitoId, src);
      setImage(link);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [src, cognitoId, getImageLink]);

  useEffect(() => {
    getImage().catch();
    // eslint-disable-next-line
  }, []);
  return isLoading ? (
    <Loading className={styles.loading} />
  ) : (
    <img className={classNames(styles.avatar, className)} src={image} alt={'No Avatar'} />
  );
};
