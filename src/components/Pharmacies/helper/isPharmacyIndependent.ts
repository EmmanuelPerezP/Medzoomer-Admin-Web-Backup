export const isPharmacyIndependent = (pharmacy: any) => {
  if(!pharmacy) return false;
  const { hellosign, affiliation } = pharmacy;

  if (affiliation) {
    return affiliation === 'group' ? false : true;
  }
  if (hellosign && hellosign.isAgreementSigned) {
    return false;
  }
 if ((!hellosign && !affiliation) || (hellosign && !affiliation && !hellosign.isAgreementSigned)) {
    return false;
  }

  return false;
};
