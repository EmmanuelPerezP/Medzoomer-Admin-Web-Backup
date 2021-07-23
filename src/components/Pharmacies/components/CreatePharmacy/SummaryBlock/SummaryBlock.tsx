import React, { FC, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import usePharmacy from '../../../../../hooks/usePharmacy';
import { days } from '../../../../../constants';
import SVGIcon from '../../../../common/SVGIcon';
import styles from '../CreatePharmacy.module.sass';
import styles2 from './styles.module.sass';
import { addPhoneCounryCode } from '../../../../../utils';
import moment from 'moment';
// import useUser from '../../../../../hooks/useUser';

interface ISummaryBlock {
  setReference: any;
  handleChangeStep: any;
}

const SummaryBlock: FC<ISummaryBlock> = ({ setReference, handleChangeStep }) => {
  const { newPharmacy } = usePharmacy();
  // const { getFileLink, sub } = useUser();

  const handleScrollTo = (ref: string) => () => {
    setReference(ref);
    handleChangeStep(1)();
  };

  // const handleGetFileLink = (fileId: string) => async () => {
  //   try {
  //     const { link } = await getFileLink(sub, `${fileId}`);
  //     (window.open(link, '_blank') as any).focus();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const valueOfManagers = (keyName: string) => {
    const key = keyName as 'primaryContact' | 'secondaryContact';
    return (
      <>
        {newPharmacy.managers[key] && (
          <div>
            {(newPharmacy.managers[key].firstName ? newPharmacy.managers[key].firstName + ' ' : '') +
              (newPharmacy.managers[key].lastName ? newPharmacy.managers[key].lastName + ', ' : '') +
              (newPharmacy.managers[key].phone ? `${addPhoneCounryCode(newPharmacy.managers[key].phone)}, ` : '') +
              (newPharmacy.managers[key].email ? newPharmacy.managers[key].email + ', ' : '')}
          </div>
        )}
      </>
    );
  };

  const valueOfOrdersSettings = () => {
    let value1 = '';
    let value2 = '';

    if (newPharmacy.ordersSettings.medicationDetails) {
      value1 = 'Medication Details (Name, Route, Milligrams and Dosage, Quantity)';
    }
    if (newPharmacy.ordersSettings.rxCopay) {
      value2 = 'Rx Copay';
    }

    return (
      (value1 ? value1 + ', ' : '') + (value2 ? value2 + ', ' : '') + 'RX Number (required), Rx Fill Date (required)'
    );
  };

  const renderBasicInfo = () => (
    <div className={styles.basicInfo}>
      <div className={styles2.titleBlock}>
        <Typography className={styles.blockTitle}>Basic Information</Typography>
        <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refBasicInfo')} />
      </div>
      {renderSummaryItem('Pharmacy Name', newPharmacy.name)}
      {renderSummaryItem('Pharmacy Phone Number', addPhoneCounryCode(newPharmacy.phone_number))}
      {renderSummaryItem(
        'Full Address',
        newPharmacy.roughAddressObj.apartment
          ? newPharmacy.roughAddress + ', ' + newPharmacy.roughAddressObj.apartment
          : newPharmacy.roughAddress
      )}
    </div>
  );

  const renderWorkingHours = () => {
    const daysOffFromMondayToFriday: string[] = [];

    return (
      <div className={styles.hoursBlock}>
        <div className={styles2.titleBlock}>
          <Typography className={styles.blockTitle}>Working Hours</Typography>
          <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refWorkingHours')} />
        </div>

        {newPharmacy.schedule.wholeWeek.isClosed &&
          days.map((day, i) => {
            let time;
            const open = newPharmacy.schedule[day.value].open;
            const close = newPharmacy.schedule[day.value].close;
            const isFromMondayToFriday =
              day.value === 'monday' ||
              day.value === 'tuesday' ||
              day.value === 'wednesday' ||
              day.value === 'thursday' ||
              day.value === 'friday';

            if (open.hour) {
              time = `${open.hour}:${open.minutes || '00'}
                    ${open.period} -
                    ${close.hour}:${close.minutes || '00'}
                    ${close.period}`;
            } else {
              time = `${moment(open).format('LT')} -
                      ${moment(close).format('LT')}`;
            }

            if (isFromMondayToFriday && newPharmacy.schedule[day.value].isClosed) {
              daysOffFromMondayToFriday.push(day.label);
            }

            if (day.value === 'friday') {
              return (
                <Fragment key={i}>
                  {renderSummaryItem(
                    'Monday — Friday',
                    daysOffFromMondayToFriday.length > 0 && daysOffFromMondayToFriday.length !== 5
                      ? time + ' closed at: ' + daysOffFromMondayToFriday.join(', ')
                      : daysOffFromMondayToFriday.length === 5
                      ? 'closed'
                      : time
                  )}
                </Fragment>
              );
            } else if (!isFromMondayToFriday) {
              return (
                <Fragment key={i}>
                  {newPharmacy.schedule[day.value].isClosed
                    ? renderSummaryItem(day.label, `Day Off`)
                    : renderSummaryItem(day.label, time)}
                </Fragment>
              );
            } else {
              return null;
            }
          })}

        {!newPharmacy.schedule.wholeWeek.isClosed &&
          renderSummaryItem('Monday — Friday, Saturday, Sunday', 'Open 24/7')}
      </div>
    );
  };

  const renderManagerProfile = () => (
    <div className={styles.managerBlock}>
      <div className={styles2.titleBlock}>
        <Typography className={styles.blockTitle}>Manager Profile</Typography>
        <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refManagerInfo')} />
      </div>

      {renderSummaryItem('Primary Contact', '', 'primaryContact')}
      {renderSummaryItem('Secondary Contact', '', 'secondaryContact')}
    </div>
  );

  const renderOrdersSettings = () => (
    <div className={styles.managerBlock}>
      <div className={styles2.titleBlock}>
        <Typography className={styles.blockTitle}>Orders Settings</Typography>
        <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refOrdersSettings')} />
      </div>
      {renderSummaryItem(
        'Please check all the fields you would like to fill in during order creation',
        valueOfOrdersSettings()
      )}
    </div>
  );

  const renderHighVolumeDeliveries = () => (
    <div className={styles.managerBlock}>
      <div className={styles2.titleBlock}>
        <Typography className={styles.blockTitle}>High Volume Deliveries</Typography>
        <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refHVDelideries')} />
      </div>
      {renderSummaryItem('High Volume Deliveries', newPharmacy.hvDeliveries === 'No' ? 'Off' : 'On')}
      {newPharmacy.hvDeliveries === 'Yes' &&
        renderSummaryItem(
          'Price for Delivery (Pharmacy)',
          newPharmacy.hvPriceFirstDelivery ? `$${(+newPharmacy.hvPriceFirstDelivery).toFixed(2)}` : '0.00'
        )}
      {newPharmacy.hvDeliveries === 'Yes' &&
        renderSummaryItem(
          'Price for Delivery (Courier)',
          newPharmacy.hvPriceHighVolumeDelivery ? `$${(+newPharmacy.hvPriceHighVolumeDelivery).toFixed(2)}` : '0.00'
        )}
    </div>
  );

  const renderReturnCopay = () => (
    <div className={styles.managerBlock}>
      <div className={styles2.titleBlock}>
        <Typography className={styles.blockTitle}>Return Copay Configuration</Typography>
        <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refReturnCopay')} />
      </div>
      {renderSummaryItem('Ability to enable return Сopay for orders', newPharmacy.rcEnable ? 'On' : 'Off')}
      {newPharmacy.rcEnable &&
        renderSummaryItem(
          'Flat Fee for Paying Courier',
          newPharmacy.rcFlatFeeForCourier ? `$${(+newPharmacy.rcFlatFeeForCourier).toFixed(2)}` : '0.00'
        )}
      {newPharmacy.rcEnable &&
        renderSummaryItem(
          'Flat Fee for Charge Pharmacy',
          newPharmacy.rcFlatFeeForPharmacy ? `$${(+newPharmacy.rcFlatFeeForPharmacy).toFixed(2)}` : '0.00'
        )}
    </div>
  );

  const renderAffiliation = () => (
    <div className={styles.managerBlock}>
      <div className={styles2.titleBlock}>
        <Typography className={styles.blockTitle}>Affiliation Settings</Typography>
        <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refAffiliation')} />
      </div>
      {renderSummaryItem(
        'Affiliation Type',
        newPharmacy.affiliation
          ? `${newPharmacy.affiliation[0].toUpperCase()}${newPharmacy.affiliation.slice(
              1,
              newPharmacy.affiliation.length
            )}`
          : ''
      )}
    </div>
  );

  // const renderViewSignedBlock = () => {
  //   return (
  //     <div className={styles.signedBlock}>
  //       <div className={styles.titleBlock}>
  //         <Typography className={styles.blockTitle}>Signed Agreement</Typography>
  //         <SVGIcon name="edit" className={styles.iconLink} onClick={handleScrollTo('refSignedBlock')} />
  //       </div>
  //       {renderSummaryItem('Uploaded File', newPharmacy.agreement.name)}
  //     </div>
  //   );
  // };

  const renderSummaryItem = (name: string, value: string, manager: string = '') => (
    <div className={styles.summaryItem}>
      <Typography className={styles.field}>{name}</Typography>
      {/* {name === 'Uploaded File' && (
          <div onClick={handleGetFileLink(newPharmacy.agreement.fileKey)} className={styles.document}>
            {value}
          </div>
        )} */}
      {manager && <div>{valueOfManagers(manager)}</div>}
      {!manager && <Typography>{value}</Typography>}
      {!value && !manager && (
        <Typography
          style={{
            color: '#798c9e'
          }}
        >
          Not provided
        </Typography>
      )}
    </div>
  );

  return (
    <div className={styles2.wrapper}>
      <Typography className={styles2.title}>Summary</Typography>
      {renderBasicInfo()}
      {renderWorkingHours()}
      {renderManagerProfile()}
      {renderOrdersSettings()}
      {renderHighVolumeDeliveries()}
      {renderReturnCopay()}
      {renderAffiliation()}
      {/* {renderViewSignedBlock()} */}
    </div>
  );
};

export default SummaryBlock;
