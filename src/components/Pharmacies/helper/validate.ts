export const isValidPharmacy = (newPharmacy: any, err: any, setErr: any) => {
  const resError: any = {};
  if (!newPharmacy) return false;
  const { managerName, email, phone_number, schedule, name, roughAddress, hvPriceHighVolumeDelivery } = newPharmacy;

  if (!name.trim()) resError.name = 'Pharmacy Name is not allowed to be empty';
  if (!roughAddress.trim()) resError.roughAddress = 'Full Address is not allowed to be empty';
  if (!managerName.trim()) resError.managerName = 'Manager Full Name is not allowed to be empty';
  if (!email.trim()) resError.email = 'Manager Contact Email is not allowed to be empty';
  if (!phone_number.trim()) resError.phone_number = 'Pharmacy Phone Number is not allowed to be empty';
  if (
    !Object.keys(schedule).every((s) => {
      return schedule[s].isClosed || (schedule[s].open.hour && schedule[s].close.hour);
    })
  ) {
    resError.schedule = 'Please enter all schedule items';
  }

  if (newPharmacy.hvDeliveries === 'Yes') {
    if (
      !newPharmacy.hvPriceFirstDelivery ||
      Number(newPharmacy.hvPriceFirstDelivery) < 0 ||
      Number(newPharmacy.hvPriceFirstDelivery) > 100
    ) {
      resError.hvPriceFirstDelivery = 'Must be greater than 0';
    }
    // if (!newPharmacy.hvPriceFollowingDeliveries ||
    //   Number(newPharmacy.hvPriceFollowingDeliveries) < 1 ||
    //   Number(newPharmacy.hvPriceFollowingDeliveries) > 100
    // ) {
    //   resError.hvPriceFollowingDeliveries = 'Must be greater than 0';
    // }
    if (
      !hvPriceHighVolumeDelivery ||
      Number(hvPriceHighVolumeDelivery) < 0 ||
      Number(hvPriceHighVolumeDelivery) > 100
    ) {
      resError.hvPriceHighVolumeDelivery = 'Must be greater than 0';
    }
  }

  if (Object.keys(resError).length > 0) {
    setErr({ ...err, ...resError });
    return false;
  }
  return true;
};
