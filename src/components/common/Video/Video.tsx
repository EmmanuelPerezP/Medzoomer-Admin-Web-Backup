import React, { useEffect, useCallback, useState } from 'react';
import useUser from '../../../hooks/useUser';
import Loading from '../Loading';

import styles from './Video.module.sass';

export const Video = ({
  className,
  src,
  cognitoId
}: {
  src: string;
  cognitoId: string;
  className?: string;
  width?: number;
  height?: number;
  isPreview?: boolean;
}) => {
  const { getImageLink } = useUser();
  const [videoSrc, setVideoSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getImage = useCallback(async () => {
    try {
      setIsLoading(true);
      const { link } = await getImageLink(cognitoId, src);
      setVideoSrc(link);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  }, [src, cognitoId, getImageLink]);

  useEffect(() => {
    getImage().catch();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={className}>
      {isLoading ? (
        <Loading className={styles.loading} />
      ) : (
        <video src={videoSrc} style={{ width: '100%' }} controls>
          Sorry, your browser doesn't support embedded videos, but don't worry, you can{' '}
          <a href={videoSrc}>download it</a>
          and watch it with your favorite video player!
        </video>
      )}
    </div>
  );
};
