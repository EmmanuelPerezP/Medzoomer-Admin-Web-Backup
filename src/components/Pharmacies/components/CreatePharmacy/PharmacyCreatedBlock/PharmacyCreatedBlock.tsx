import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../../../../common/SVGIcon';
import styles from './styles.module.sass';
import Button from '@material-ui/core/Button';

interface IPharmacyCreatedBlock {
  namePharmacy: string;
  handleChangeStep: any;
  handleGoToPharmacies: any;
}

const PharmacyCreatedBlock: FC<IPharmacyCreatedBlock> = ({ namePharmacy, handleChangeStep, handleGoToPharmacies }) => (
  <>
    <div className={styles.successWrapper}>
      <div className={styles.successCreateBlock}>
        <SVGIcon name={'successCreate'} />
        <Typography className={styles.successTitle}>Pharmacy Created</Typography>
        <Typography className={styles.successSubTitle}>{`${namePharmacy} Pharmacy`} </Typography>
        <Button className={styles.okButton} variant="contained" color="secondary" onClick={handleGoToPharmacies}>
          <Typography className={styles.summaryText}>Ok</Typography>
        </Button>

        <Typography onClick={handleChangeStep(1)} className={styles.createNew}>
          Create One More
        </Typography>
      </div>
    </div>
  </>
);

export default PharmacyCreatedBlock;
