import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
import styles from './Invoicing.module.sass';
import Loading from '../../../common/Loading';
import Select from '../../../common/Select';
import { invoiceFrequency } from '../../../../constants';
import SVGIcon from '../../../common/SVGIcon';

interface Props {
  sectionRef: React.RefObject<HTMLDivElement>;
  newSettingGP: any;
  newSettingsGP: any;
  invoiceFrequencyInfo: any;
  invoiceFrequencyInfoLabel: any;
  notDefaultBilling: any;
  isLoading: boolean;
  handleChange: Function;
}

export const Invoicing: FC<Props> = (props) => {
  const {
    sectionRef,
    isLoading,
    newSettingGP,
    invoiceFrequencyInfoLabel,
    invoiceFrequencyInfo,
    handleChange,
    notDefaultBilling
  } = props;

  return (
    <div className={notDefaultBilling ? styles.groupBlock : styles.systemsWrapper} ref={sectionRef}>
      <Typography className={styles.blockTitle}>Invoicing</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.twoInput}>
          <div className={styles.textField}>
            <Select
              label="Frequency"
              value={newSettingGP.invoiceFrequency}
              onChange={handleChange('invoiceFrequency')}
              items={invoiceFrequency}
              IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
            />
          </div>
          {invoiceFrequencyInfoLabel ? (
            <div className={styles.textField}>
              <Select
                label={invoiceFrequencyInfoLabel}
                value={newSettingGP.invoiceFrequencyInfo}
                onChange={handleChange('invoiceFrequencyInfo')}
                items={invoiceFrequencyInfo}
                IconComponent={() => <SVGIcon name={'downArrow'} style={{ height: '15px', width: '15px' }} />}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
