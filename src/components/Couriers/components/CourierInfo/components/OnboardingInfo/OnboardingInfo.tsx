import React, { FC } from 'react';
import { SummaryItem } from '../../CourierInfo';

interface IOnboardingInfo {
  courier: any;
  handleUpdateOnboard: () => void;
}

const OnboardingInfo: FC<IOnboardingInfo> = ({ courier, handleUpdateOnboard }) => {
  return (
    <div>
      <SummaryItem
        title="Welcome Package"
        value={courier.onboarded ? 'Yes' : 'Mark as sent'}
        onClick={!courier.onboarded ? handleUpdateOnboard : undefined}
      />
      <SummaryItem title="HIPAA Training Completed?" value={courier.completedHIPAATraining ? 'Yes' : 'No'} />
      <SummaryItem title="Registered for Onfleet?" value={courier.isOnFleet ? 'Yes' : 'No'} />
      <SummaryItem
        title="Set Billing Account?"
        value={courier.dwolla && courier.dwolla.bankAccountType ? 'Yes' : 'No'}
      />
    </div>
  );
};

export default OnboardingInfo;
