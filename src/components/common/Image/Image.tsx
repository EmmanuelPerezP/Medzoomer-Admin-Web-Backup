import React, { useEffect, useCallback, useState } from 'react';
import classNames from 'classnames';
import useUser from '../../../hooks/useUser';
import logo from '../../../assets/img/terms-logo@3x.png';

import styles from './Image.module.sass';

export const Image = ({
  className,
  src,
  cognitoId,
  alt,
  defaultImg
}: {
  src: string;
  cognitoId: string;
  alt: string;
  className?: string;
  defaultImg?: string;
}) => {
  const { getImageLink } = useUser();
  const [image, setImage] = useState('');

  const getImage = useCallback(async () => {
    try {
      const { link } = await getImageLink(cognitoId, src);
      setImage(link);
    } catch (err) {
      console.error(err);
    }
  }, [src, cognitoId, getImageLink]);

  useEffect(() => {
    getImage().catch();
    // eslint-disable-next-line
  }, []);
  return <img className={classNames(styles.image, className)} src={image || defaultImg || logo} alt={alt} />;
};
