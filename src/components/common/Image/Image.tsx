import React, { useEffect, useCallback, useState } from 'react';
import classNames from 'classnames';
import useUser from '../../../hooks/useUser';
import logo from '../../../assets/img/terms-logo@3x.png';

import styles from './Image.module.sass';

const prepareSrc = (src: string, width?: number, height?: number) => {
  if (!src) {
    return '';
  }
  const imageExtension = src.split('.').pop();
  const imageName = src.split('.').shift();
  return `${imageName}${width && width > 0 && height && height > 0 ? `_${width}_${height}` : ''}.${imageExtension}`;
};

export const Image = ({
  className,
  src,
  cognitoId,
  alt,
  defaultImg,
  width,
  height
}: {
  src: string;
  cognitoId: string;
  alt: string;
  className?: string;
  defaultImg?: string;
  width?: number;
  height?: number;
}) => {
  const { getImageLink } = useUser();
  const [image, setImage] = useState('');

  const getImage = useCallback(async () => {
    try {
      const { link } = await getImageLink(cognitoId, prepareSrc(src, width, height));
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
