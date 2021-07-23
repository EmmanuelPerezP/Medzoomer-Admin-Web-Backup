export const scheduleChecking = (schedule: any) =>
  Object.keys(schedule).every((day) => {
    if (schedule[day].isClosed) return true;
    if (schedule[day].open.period) {
      if (schedule[day].open.hour && schedule[day].close.hour) return true;
    } else {
      if (schedule[day].open && schedule[day].close) return true;
    }
    return false;
  });

export const isValidPharmacy = (newPharmacy: any, err: any, setErr: any) => {
  if (!newPharmacy) return false;
  const resError: any = {};
  const { phone_number, schedule, name, roughAddress, hvPriceHighVolumeDelivery, managers } = newPharmacy;
  const { primaryContact } = managers;

  const errStrEmptyField = ' is not allowed to be empty';

  const addManagersErr = (keyName: string, errStr: string) => {
    if (!resError.managers) {
      resError.managers = {
        primaryContact: {}
      };
    }

    resError.managers = {
      primaryContact: {
        ...resError.managers.primaryContact,
        [keyName]: errStr + errStrEmptyField
      }
    };
  };

  if (!name.trim()) resError.name = 'Pharmacy Name' + errStrEmptyField;
  if (!phone_number.trim()) resError.phone_number = 'Pharmacy Phone Number' + errStrEmptyField;
  if (!roughAddress.trim()) resError.roughAddress = 'Full Address' + errStrEmptyField;
  if (!primaryContact.firstName.trim()) addManagersErr('firstName', 'First Name');
  if (!primaryContact.lastName.trim()) addManagersErr('lastName', 'Last Name');
  if (!primaryContact.email.trim()) addManagersErr('email', 'Contact Email');
  if (!scheduleChecking(schedule)) resError.schedule = 'Please enter all schedule items';

  // was before
  // if (schedule.wholeWeek.isClosed) {
  //   if (
  //     !Object.keys(schedule).every((s) => {
  //       return schedule[s].isClosed || (schedule[s].open.hour && schedule[s].close.hour);
  //     })
  //   ) {
  //     resError.schedule = 'Please enter all schedule items';
  //   }
  // } else {
  //   if (!schedule.wholeWeek.open.hour || !schedule.wholeWeek.close.hour) {
  //     resError.schedule = 'Please enter all schedule items';
  //   }
  // }

  if (newPharmacy.hvDeliveries === 'Yes') {
    if (
      !newPharmacy.hvPriceFirstDelivery ||
      Number(newPharmacy.hvPriceFirstDelivery) < 0 ||
      Number(newPharmacy.hvPriceFirstDelivery) > 100
    ) {
      resError.hvPriceFirstDelivery = 'Must be greater than 0 and no more than 100';
    }
    // if (!newPharmacy.hvPriceFollowingDeliveries ||
    //   Number(newPharmacy.hvPriceFollowingDeliveries) < 1 ||
    //   Number(newPharmacy.hvPriceFollowingDeliveries) > 100
    // ) {
    //   resError.hvPriceFollowingDeliveries = 'Must be greater than 0 and no more than 100';
    // }
    if (
      !hvPriceHighVolumeDelivery ||
      Number(hvPriceHighVolumeDelivery) < 0 ||
      Number(hvPriceHighVolumeDelivery) > 100
    ) {
      resError.hvPriceHighVolumeDelivery = 'Must be greater than 0 and no more than 100';
    }
  }

  if (Object.keys(resError).length > 0) {
    setErr({ ...err, ...resError });
    return false;
  }
  return true;
};
