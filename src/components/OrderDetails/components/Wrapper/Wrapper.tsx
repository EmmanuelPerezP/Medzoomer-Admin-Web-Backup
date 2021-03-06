import React, { FC } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import { IWrapperProps } from './types';
import SVGIcon from '../../../common/SVGIcon';

import styles from './Wrapper.module.sass';

const isExist = (value: any) => !(value === undefined);

export const Wrapper: FC<IWrapperProps> = ({
  children = null,
  HeaderRightComponent = null,
  BottomRightComponent = null,
  HeaderCenterComponent = null,
  ContentLeftComponent = null,
  title,
  subTitle,
  iconName,
  biggerIcon = false,
  subTitleLink = null,
  isContentLeft = true
}) => {
  const { path } = useRouteMatch();

  return (
    <div className={styles.container} style={BottomRightComponent ? { paddingBottom: 0 } : {}}>
      <div className={styles.header}>
        <div className={styles.leftPart}>
          <div className={classNames(styles.iconContainer, { [styles.withoutContentLeft]: !isContentLeft })}>
            <SVGIcon className={classNames(styles.icon, { [styles.biggerIcon]: biggerIcon })} name={iconName} />
          </div>
          <div className={styles.descriptionContainer}>
            {isExist(title) && <Typography className={styles.title}>{title}</Typography>}
            {!isExist(subTitle) ? null : subTitleLink ? (
              <Link to={subTitleLink || path} className={styles.link}>
                <Typography className={styles.subtitle}>{subTitle}</Typography>
              </Link>
            ) : (
              <Typography className={styles.subtitle}>{subTitle}</Typography>
            )}
          </div>
        </div>
        {HeaderCenterComponent && <div className={styles.centerPart}>{HeaderCenterComponent}</div>}
        <div className={styles.rightPart}>{HeaderRightComponent}</div>
      </div>
      <div className={isContentLeft ? styles.content : styles.contentWithoutLeft}>
        {isContentLeft && <div>{ContentLeftComponent}</div>}
        <div>
          {children && <div className={styles.underline} />}
          {children}
        </div>
      </div>
      <div className={styles.footer}>{BottomRightComponent}</div>
    </div>
  );
};
