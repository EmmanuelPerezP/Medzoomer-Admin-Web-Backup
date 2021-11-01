import styles from './PatientsMedicationsInfo.module.sass';
import React, { FC } from 'react';
import classNames from 'classnames';

import { IPatientsMedicationsInfoProps } from './types';
import { Wrapper } from '../Wrapper';
import { emptyChar } from '../../utils';
import { getDateFromTimezone } from '../../../../utils';
import useUser from '../../../../hooks/useUser';
import { IconButton, Tooltip } from '@material-ui/core';
import SVGIcon from '../../../common/SVGIcon';

export const PatientsMedicationsInfo : FC<IPatientsMedicationsInfoProps> = ({ customers = [] }) => {
  const user = useUser();

  const renderHeader = () => (
    <div className={styles.headerContainer}>
      <div className={classNames(styles.columnRxNumber, styles.label)}>Patient</div>
      <div className={classNames(styles.columnRxFillDate, styles.label)}>Medication Count</div>
      {/*<div className={classNames(styles.columnCopay, styles.label)}>Details</div>*/}
    </div>
  );

  const renderItems = () => {
    return customers.map((item, index) => {

      let patient = item.customer.fullName || emptyChar;
      let quantity = item.prescriptions.length || emptyChar;

      return (
        <div className={styles.itemContainer} key={index}>
          <div className={classNames(styles.columnRxNumber, styles.columnMedication)}>{patient}</div>

          <div className={classNames(styles.columnQty, styles.value)}>{quantity}</div>

          {/*<div className={classNames(styles.columnCopay, styles.value)}><Tooltip title='Details' placement='top' arrow>
            <IconButton size='small'>
              <SVGIcon name={'details'} />
            </IconButton>
          </Tooltip></div>*/}
        </div>
      );
    });
  };

  const renderEmptyMessage = () => <div className={styles.emptyMessage}>Medications list is empty</div>;
  return (
    <Wrapper
      title="Patients & Medications"
      subTitle={'Medications'}
      iconName="medications"

    >
      <div className={styles.content}>
        {renderHeader()}
        {customers.length ? renderItems() : renderEmptyMessage()}
      </div>
    </Wrapper>
  );
};
