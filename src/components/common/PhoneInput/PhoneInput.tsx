import React, { FC } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../SVGIcon';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from './PhoneInput.module.sass';
import { PHONE_COUNTRY_CODE } from '../../../constants';

interface IPhoneInputUS {
  onChange: any;
  value: string;
  containerClass?: {};
  inputClass?: {};
  dropdownClass?: {};
  buttonClass?: {};
  isDashedBorder?: boolean;
  fullBorder?: boolean;
  label?: string;
}

export const PhoneInputUS: FC<IPhoneInputUS> = ({
  onChange,
  value,
  containerClass,
  inputClass,
  buttonClass,
  isDashedBorder = false,
  fullBorder = false,
  label = ''
}) => (
  <>
    {label && <div className={styles.label}>{label}</div>}
    <div className={classNames([styles.phoneWrapper, fullBorder && styles.phoneWrapperFullBorder])}>
      <div className={classNames([styles.preInput, fullBorder && styles.preInputFullBorder])}>
        {!label && <Typography className={styles.phoneTitle}>Phone</Typography>}
        <div className={classNames([styles.icons, fullBorder && styles.iconsFullBorder])}>
          <SVGIcon className={styles.iconItem} name={'phone'} />
          <SVGIcon className={styles.iconItem} name={'usaFlag'} />
          <Typography className={styles.iconItem}>{PHONE_COUNTRY_CODE}</Typography>
        </div>
      </div>

      <PhoneInput
        placeholder={'(000)  000  0000'}
        disableCountryCode
        value={value}
        onChange={(value) => onChange({ target: { value } })}
        disableDropdown
        disableSearchIcon
        containerClass={classNames(styles.container, containerClass)}
        inputClass={classNames([styles.input, inputClass, fullBorder && styles.inputFullBorder])}
        buttonClass={classNames(styles.button, buttonClass)}
        masks={{ us: '(...)  ...  ....' }}
        country={'us'}
        onlyCountries={['us']}
      />
      {isDashedBorder && (
        <>
          <div className={classNames(styles.hline, styles.hline1)} />
          <div className={classNames(styles.hline, styles.hline2)} />
          <div className={classNames(styles.hline, styles.hline3)} />
        </>
      )}
      {/* {!isDashedBorder && <div className={classNames(styles.hlineFull)} />} */}
    </div>
  </>
);
