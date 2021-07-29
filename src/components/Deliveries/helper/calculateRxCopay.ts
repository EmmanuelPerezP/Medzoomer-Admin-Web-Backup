const calculateRxCopay = (prescriptions: object[]) => {
  const sumRxCopay = prescriptions.reduce((acc: any, prescription: any) => acc + (+prescription.rxCopay || 0), 0);
  return sumRxCopay;
};

export default calculateRxCopay;
