import React from 'react';
import { useHistory } from 'react-router';
import SVGIcon from '../SVGIcon';

import styles from './styles.module.sass';

const Back = ({ onClick, canGoBack = true }: { onClick?: () => void; canGoBack?: boolean }) => {
  const history = useHistory();

  const handleClick = () => {
    if (onClick) onClick();
    if (canGoBack) history.goBack();
  };

  return <SVGIcon name="backArrow" className={styles.backArrowIcon} onClick={handleClick} />;
};

export default Back;
