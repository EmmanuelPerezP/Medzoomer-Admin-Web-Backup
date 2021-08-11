import React, { FC } from 'react';
import styles from '../PharmacyInputs.module.sass';
import styles2 from './styles.module.sass';
import Typography from '@material-ui/core/Typography';
import SelectButton from '../../../../common/SelectButton';
import SelectBillingAccounts from './SelectBillingAccounts';

interface IAffiliationBlock {
  affiliation: any;
  handleChangeTabSelect: any;
  pharmacy: any;
  isCreate: boolean;
}

const AffiliationBlock: FC<IAffiliationBlock> = ({ affiliation, handleChangeTabSelect, pharmacy, isCreate }) => {
  const renderSignedBlock = () => (
    <div className={styles2.signedBlock}>
      <Typography className={styles2.placeholder}>Agreement Document</Typography>
      {pharmacy.signedAgreementUrl && (
        <a
          href={pharmacy.signedAgreementUrl}
          download
          className={styles2.downloadLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download PDF
        </a>
      )}
      {!pharmacy.signedAgreementUrl && <div>Not assign</div>}
    </div>
  );

  return (
    <div className={styles2.wrapper}>
      <div className={styles.affiliationWrapper}>
        <Typography className={styles.blockTitle}>Affiliation Settings</Typography>
        <div className={styles2.typeOfAffiliationWrapper}>
          <div className={styles.independentInput}>
            <SelectButton
              disabled={!isCreate}
              label={'Affiliation type'}
              defItems={[
                { value: 'independent', label: 'Independent' },
                { value: 'group', label: 'Group' }
              ]}
              value={affiliation}
              onChange={handleChangeTabSelect('affiliation')}
            />
          </div>
          {affiliation === 'independent' && !isCreate && (
            <div className={styles.independentInput}>
              <SelectBillingAccounts />
            </div>
          )}
        </div>
      </div>

      {affiliation === 'independent' && !isCreate && renderSignedBlock()}
    </div>
  );
};

export default AffiliationBlock;
