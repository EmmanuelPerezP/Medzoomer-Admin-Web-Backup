
export const isValidate = (newPharmacy: any, err: any, setErr: any) => {
  let resError = null

  if (newPharmacy.hvDeliveries === 'Yes') {
    if (!newPharmacy.hvPriceFirstDelivery || Number(newPharmacy.hvPriceFirstDelivery) < 1 || Number(newPharmacy.hvPriceFirstDelivery) > 100) {
      resError = {
        hvPriceFirstDelivery: 'Must be greater than 0'
      }
    }
    if (!newPharmacy.hvPriceFollowingDeliveries || Number(newPharmacy.hvPriceFollowingDeliveries) < 1 || Number(newPharmacy.hvPriceFollowingDeliveries) > 100) {
      resError = {
        ...resError,
        hvPriceFollowingDeliveries: 'Must be greater than 0'
      }
    }
    if (!newPharmacy.hvPriceHighVolumeDelivery || Number(newPharmacy.hvPriceHighVolumeDelivery) < 1 || Number(newPharmacy.hvPriceHighVolumeDelivery) > 100) {
      resError = {
        ...resError,
        hvPriceHighVolumeDelivery: 'Must be greater than 0'
      }
    }

  }

  if (resError && Object.keys(resError).length > 0) {
    setErr({...err, ...resError})
    return false
  }

  return true
};
