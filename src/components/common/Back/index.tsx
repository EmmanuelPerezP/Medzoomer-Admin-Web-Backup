import React from 'react';
import { useHistory } from 'react-router';
import SVGIcon from '../SVGIcon';

import styles from './styles.module.sass';

const Back = ({ onClick }: { onClick?: () => void }) => {
  const history = useHistory();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    history.goBack();
  };

  return <SVGIcon name="backArrow" className={styles.backArrowIcon} onClick={handleClick} />;
};

export default Back;
