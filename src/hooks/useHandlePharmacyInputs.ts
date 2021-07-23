import { useStores } from '../store';

interface IuseHandlePharmacyInputsActions {
  handleRC: (key: string, checked: boolean, value: string) => void;
  handleApartment: (newValue: string) => void;
  handleManagers: (key: string, value: string, setError: any, err: any) => void;
  handleControlledMedications: (key: string, newValue: string, checked: boolean, setError: any, err: any) => void;
  handleItemsWithTwoKeyNames: (key: string, checked: boolean, setError: any, err: any) => void;
  handleTabHvDeliveries: (value: string, setError: any, err: any) => void;
  handleExistingDriversOrAssistedLivingFacilitiesOrGroupHomes: (
    key: string,
    newValue: string,
    setError: any,
    err: any
  ) => void;
  handleStrValue: (key: string, value: string, setError: any, err: any) => void;
  addNewReferrals: () => void;
  removeReferral: (index: number) => void;
  handleReferrals: (key: string, newValue: string, setError: any, err: any) => void;
}

export default function useHandlePharmacyInputs() {
  const { pharmacyStore } = useStores();
  const { newPharmacy } = pharmacyStore.getState();

  const actions: IuseHandlePharmacyInputsActions = {
    handleRC: (key, checked, value) => {
      const keyName = key.split('_')[1] as 'rcEnable' | 'rcFlatFeeForCourier' | 'rcFlatFeeForPharmacy';

      if (keyName === 'rcEnable') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName]: checked
        });
      } else {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName]: value
        });
      }
    },
    handleApartment: (value: string) => {
      const tempRoughAddressObj = newPharmacy.roughAddressObj ? newPharmacy.roughAddressObj : newPharmacy.address;
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        roughAddressObj: {
          ...tempRoughAddressObj,
          apartment: value
        }
      });
    },
    handleManagers: (key, value, setError, err) => {
      const keyName1 = key.split('_')[1] as 'primaryContact' | 'secondaryContact';
      const keyName2 = key.split('_')[2] as 'firstName' | 'lastName' | 'phone' | 'email';

      if (keyName1 === 'primaryContact') {
        let oldKeyName = '';
        let managerName = '';
        let firstName = '';
        let lastName = '';

        if (keyName2 === 'firstName' || keyName2 === 'lastName') {
          oldKeyName = 'managerName';
          firstName = (keyName2 === 'firstName' ? value : '') || newPharmacy.managers.primaryContact.firstName;
          lastName = (keyName2 === 'lastName' ? value : '') || newPharmacy.managers.primaryContact.lastName;
          managerName = (firstName + ' ' + lastName).trim();
        }
        if (keyName2 === 'phone') oldKeyName = 'managerPhoneNumber';
        if (keyName2 === 'email') oldKeyName = 'email';

        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [oldKeyName]: oldKeyName === 'managerName' ? managerName : value,
          managers: {
            ...newPharmacy.managers,

            [keyName1]: {
              ...newPharmacy.managers[keyName1],
              [keyName2]: value
            }
          }
        });
      } else {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          managers: {
            ...newPharmacy.managers,
            [keyName1]: {
              ...newPharmacy.managers[keyName1],
              [keyName2]: value
            }
          }
        });
      }

      setError({
        ...err,
        managers: {
          ...err.managers,

          [keyName1]: {
            ...err.managers[keyName1],
            [keyName2]: ''
          }
        }
      });
    },
    handleControlledMedications: (key, newValue, checked, setError, err) => {
      const keyName = key.split('_')[1];

      if (keyName === 'value' && newValue === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          controlledMedications: {
            value: 'No',
            signature: false,
            photoOfId: false,
            specialRequirements: false,
            specialRequirementsNote: ''
          }
        });
      } else {
        let value: string | boolean = newValue;
        if (['signature', 'photoOfId', 'specialRequirements'].includes(keyName)) {
          value = checked;
        }
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          controlledMedications: {
            ...newPharmacy.controlledMedications,
            [keyName]: value
          }
        });
      }
      setError({
        ...err,
        controlledMedications: {
          value: '',
          signature: '',
          photoOfId: '',
          specialRequirements: '',
          specialRequirementsNote: ''
        }
      });
    },
    handleItemsWithTwoKeyNames: (key, checked, setError, err) => {
      const keyName1 = key.split('_')[0] as 'reportedBackItems' | 'ordersSettings';
      const keyName2 = key.split('_')[1];

      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        [keyName1]: {
          ...newPharmacy[keyName1],
          [keyName2]: checked
        }
      });
      setError({
        ...err,
        [keyName1]: {
          ...err[keyName1],
          [keyName2]: ''
        }
      });
    },
    handleTabHvDeliveries: (value, setError, err) => {
      if (value === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          hvDeliveries: value,
          hvPriceFirstDelivery: '',
          hvPriceHighVolumeDelivery: ''
          // hvPriceFollowingDeliveries: '',
        });
      } else {
        pharmacyStore.set('newPharmacy')({ ...newPharmacy, hvDeliveries: value });
      }
      setError({ ...err, hvDeliveries: '' });
    },
    handleExistingDriversOrAssistedLivingFacilitiesOrGroupHomes: (key, newValue, setError, err) => {
      const keyName1 = key.split('_')[0] as 'existingDrivers' | 'assistedLivingFacilitiesOrGroupHomes';
      const keyName2 = key.split('_')[1];

      if (keyName2 === 'value' && newValue === 'No') {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName1]: {
            ...newPharmacy[keyName1],
            [keyName2]: newValue,
            volume: ''
          }
        });
      } else {
        pharmacyStore.set('newPharmacy')({
          ...newPharmacy,
          [keyName1]: {
            ...newPharmacy[keyName1],
            [keyName2]: newValue
          }
        });
      }

      setError({
        ...err,
        [keyName1]: {
          value: '',
          volume: ''
        }
      });
    },
    handleStrValue: (key, value, setError, err) => {
      pharmacyStore.set('newPharmacy')({ ...newPharmacy, [key]: value });
      setError({ ...err, [key]: '' });
    },
    addNewReferrals: () => {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        referrals: [
          ...newPharmacy.referrals,
          {
            pharmacyName: '',
            managerName: '',
            contactInfo: ''
          }
        ]
      });
    },
    removeReferral: (index: number) => {
      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        referrals: newPharmacy.referrals.filter((el, i) => i !== index)
      });
    },
    handleReferrals: (key, value, setError, err) => {
      const indexOfReferrals = +key.split('_')[1];
      const keyName = key.split('_')[2];

      const newReferrals = [...newPharmacy.referrals];
      const newReferral = {
        ...newPharmacy.referrals[indexOfReferrals],
        [keyName]: value
      };
      newReferrals.splice(indexOfReferrals, 1, newReferral);

      pharmacyStore.set('newPharmacy')({
        ...newPharmacy,
        referrals: newReferrals
      });

      if (err.referrals) {
        const newReferralsErr = [...err.referrals];
        const newReferralErr = {
          ...err.referrals[indexOfReferrals],
          [keyName]: ''
        };
        newReferralsErr.splice(indexOfReferrals, 1, newReferralErr);

        setError({
          ...err,
          referrals: newReferralsErr
        });
      } else {
        setError({
          ...err,
          referrals: [
            {
              pharmacyName: '',
              managerName: '',
              contactInfo: ''
            }
          ]
        });
      }
    }
  };

  return {
    ...pharmacyStore.getState(),
    actions
  };
}
