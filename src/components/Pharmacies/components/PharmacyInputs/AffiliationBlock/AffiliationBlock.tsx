import React, { FC } from 'react';
import styles from '../PharmacyInputs.module.sass';
import styles2 from './styles.module.sass';
import Typography from '@material-ui/core/Typography';
import SelectButton from '../../../../common/SelectButton';
import SelectBillingAccounts from '../SelectBillingAccounts';
import Button from '@material-ui/core/Button';

interface IAffiliationBlock {
  affiliation: any;
  handleChangeTabSelect: any;
  pharmacy: any;
}

const AffiliationBlock: FC<IAffiliationBlock> = ({ affiliation, handleChangeTabSelect, pharmacy }) => {
  const renderSignedBlock = () => (
    <div className={styles.signedBlock}>
      <Typography className={styles.blockTitle}>Agreement Document</Typography>
      <a
        href={pharmacy.signedAgreementUrl}
        download
        style={{ textDecoration: 'none' }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className={styles.changeStepButton} variant="contained" color="secondary">
          <Typography className={styles.summaryText}>Download PDF</Typography>
        </Button>
      </a>
    </div>
  );

  return (
    <div className={styles2.wrapper}>
      <div className={styles.affiliationWrapper}>
        <Typography className={styles.blockTitle}>Affiliation Settings</Typography>
        <div className={styles.independentInput}>
          <SelectButton
            defItems={[
              { value: 'independent', label: 'Independent' },
              { value: 'group', label: 'Group' }
            ]}
            label=""
            value={affiliation}
            onChange={handleChangeTabSelect('affiliation')}
          />
        </div>
      </div>
      {affiliation === 'independent' && <SelectBillingAccounts />}
      {pharmacy.signedAgreementUrl && renderSignedBlock()}
    </div>
  );
};

export default AffiliationBlock;
