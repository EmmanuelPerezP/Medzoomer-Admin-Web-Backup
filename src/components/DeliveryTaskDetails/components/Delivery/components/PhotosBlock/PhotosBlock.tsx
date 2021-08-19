import React, { FC, Fragment } from 'react';
import styles from './styles.module.sass';
import generalStyles from '../../Delivery.module.sass';
import { IDeliveryPhotosBlock } from '../../types';
import Image from '../../../../../common/Image';
import ImageDelivery from '../../../../../common/ImageDelivery';
import { URL_TO_ONFLEET_SIGNATURE } from '../../../../../../constants';

const PhotosBlock: FC<IDeliveryPhotosBlock> = ({ deliveryInfo }) => {
  const getSignatureBlock = () => {
    if (deliveryInfo.signature && deliveryInfo.customer && deliveryInfo.customer._id) {
      return (
        <Image
          className={styles.img}
          alt={'Signature'}
          src={deliveryInfo.signature}
          cognitoId={deliveryInfo.customer._id}
          isPreview={true}
        />
      );
    } else if (deliveryInfo.signatureUploadId) {
      return (
        <ImageDelivery
          key={`signature-photo`}
          isPreview={true}
          className={styles.img}
          src={`${URL_TO_ONFLEET_SIGNATURE}/${deliveryInfo.signatureUploadId}/800x.png`}
          alt={'No signature'}
        />
      );
    } else {
      return null;
    }
  };

  const renderPhotos = () => {
    if (!deliveryInfo.photoUploadIds && !deliveryInfo.signatureUploadId) {
      return null;
    }

    return (
      <div className={styles.wrapper}>
        {(!!deliveryInfo.signatureUploadId || !!deliveryInfo.signature) && (
          <div className={generalStyles.row}>
            <p className={generalStyles.title}>Signature</p>
            <div className={styles.imgWrapper}>{getSignatureBlock()}</div>
          </div>
        )}
        {deliveryInfo.photoUploadIds &&
          deliveryInfo.photoUploadIds.map((value: any, index: number) => (
            <Fragment key={index}>
              <div className={generalStyles.row}>
                <p className={generalStyles.title}>{`Photo ${index + 1}`}</p>
                <div className={styles.imgWrapper}>
                  <ImageDelivery
                    key={`${index}-photo`}
                    isPreview={true}
                    className={styles.img}
                    src={`${URL_TO_ONFLEET_SIGNATURE}/${value}/800x.png`}
                    alt={'No signature'}
                  />
                </div>
              </div>
            </Fragment>
          ))}
      </div>
    );
  };

  return renderPhotos();
};

export default PhotosBlock;
