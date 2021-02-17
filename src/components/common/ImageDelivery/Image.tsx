import React, { useState } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';
import Close from '@material-ui/icons/Close';
// import useUser from '../../../hooks/useUser';
import Loading from '../Loading';
import logo from '../../../assets/img/terms-logo@3x.png';

import styles from './Image.module.sass';

// const prepareSrc = (src: string, width?: number, height?: number) => {
//   if (!src) {
//     return '';
//   }
//   const imageExtension = src.split('.').pop();
//   const imageName = src.split('.').shift();
//   return `${imageName}${width && width > 0 && height && height > 0 ? `_${width}_${height}` : ''}.${imageExtension}`;
// };

export const Image = ({
  className,
  src,
  // cognitoId,
  alt,
  key,
  defaultImg,
  // width,
  // height,
  isPreview = false
}: {
  src: string;
  alt: string;
  key: string;
  className?: string;
  defaultImg?: string;
  width?: number;
  height?: number;
  isPreview?: boolean;
  cognitoId?: string;
}) => {
  const [image] = useState(src);
  const [preview] = useState(src);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading] = useState(false);

  const handleOpenModal = async () => {
    try {
      handleModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <img
        key={key}
        onClick={isPreview ? handleOpenModal : undefined}
        className={classNames(styles.image, className, { [styles.isPreview]: isPreview })}
        src={image || defaultImg || logo}
        alt={alt}
      />
      <Modal
        key={`${key}-modal`}
        shouldFocusAfterRender={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={handleModal}
        isOpen={isOpen}
        style={{ overlay: { zIndex: 20 } }}
      >
        <div className={styles.modal}>
          <Close className={styles.closeIcon} onClick={handleModal} />
          {isLoading ? (
            <Loading className={styles.loading} />
          ) : (
            <img className={classNames(styles.image, className)} src={preview || defaultImg || logo} alt={alt} />
          )}
        </div>
      </Modal>
    </>
  );
};
