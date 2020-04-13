import React, { useEffect, useCallback, useState } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';
import Close from '@material-ui/icons/Close';
import useUser from '../../../hooks/useUser';
import Loading from '../Loading';
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
  height,
  isPreview = false
}: {
  src: string;
  cognitoId: string;
  alt: string;
  className?: string;
  defaultImg?: string;
  width?: number;
  height?: number;
  isPreview?: boolean;
}) => {
  const { getImageLink } = useUser();
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getImage = useCallback(async () => {
    try {
      const { link } = await getImageLink(cognitoId, prepareSrc(src, width, height));
      setImage(link);
    } catch (err) {
      console.error(err);
    }
  }, [src, cognitoId, getImageLink, width, height]);

  const handleOpenModal = async () => {
    try {
      handleModal();
      setIsLoading(true);
      const { link } = await getImageLink(cognitoId, src);
      setPreview(link);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getImage().catch();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <img
        onClick={isPreview ? handleOpenModal : undefined}
        className={classNames(styles.image, className, { [styles.isPreview]: isPreview })}
        src={image || defaultImg || logo}
        alt={alt}
      />
      <Modal
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleModal}
        className={styles.modal}
        isOpen={isOpen}
      >
        <>
          <Close className={styles.closeIcon} onClick={handleModal}>
            Close
          </Close>
          {isLoading ? (
            <Loading className={styles.loading} />
          ) : (
            <img className={classNames(styles.image, className)} src={preview} alt={alt} />
          )}
        </>
      </Modal>
    </>
  );
};
