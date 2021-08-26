import React, { Dispatch, FC, useState } from 'react';
import { tShirtSizes } from '../../../../../../constants';
import useUser from '../../../../../../hooks/useUser';
import { getAddressString, getDateWithFormat } from '../../../../../../utils';
import { SummaryItem } from '../../CourierInfo';
import CourierSchedule from '../CourierSchedule';

interface IPersonalInfo {
  courier: any;
  teams: any;
  setNewEmailModal: Dispatch<boolean>;
  setNewPhoneModal: Dispatch<boolean>;
}

const PersonalInfo: FC<IPersonalInfo> = ({ courier, teams, setNewEmailModal, setNewPhoneModal }) => {
  const { getFileLink } = useUser();
  const [agreement, setAgreement] = useState({ link: '', isLoading: false });
  const [fw9, setfw9] = useState({ link: '', isLoading: false });

  const handleGetFileLink = (fileId: string, type: string) => async () => {
    try {
      type === 'fw9' ? setfw9({ ...fw9, isLoading: true }) : setAgreement({ ...agreement, isLoading: true });
      if (type === 'fw9' ? fw9.link : agreement.link) {
        type === 'fw9' ? setfw9({ ...fw9, isLoading: false }) : setAgreement({ ...agreement, isLoading: false });
        (window.open(type === 'fw9' ? fw9.link : agreement.link, '_blank') as any).focus();
      } else {
        const { link } = await getFileLink(process.env.REACT_APP_HELLO_SIGN_KEY as string, `${fileId}.pdf`);
        type === 'fw9'
          ? setfw9({ ...fw9, link, isLoading: false })
          : setAgreement({ ...agreement, link, isLoading: false });

        (window.open(link, '_blank') as any).focus();
      }
    } catch (error) {
      type === 'fw9' ? setfw9({ ...fw9, isLoading: false }) : setAgreement({ ...agreement, isLoading: false });
      console.error(error);
    }
  };

  let teamsNames = '';
  const teamsArr: string[] = [];

  if (courier.teams && courier.teams.length) {
    courier.teams.forEach((teamId: string) => {
      const team = teams && teams.find((t: any) => t.id === teamId);
      if (team) {
        teamsArr.push(team.name);
      }
    });
    if (teamsArr.length) {
      teamsNames = teamsArr.join(', ');
    } else {
      teamsNames = 'Not found';
    }
  } else {
    teamsNames = 'Not choose';
  }

  return (
    <div>
      <SummaryItem title="Full name" value={`${courier.name} ${courier.family_name}`} />
      <SummaryItem
        title="Email"
        value={courier.email}
        icon={'edit'}
        onIconClick={() => setNewEmailModal(true)}
      />
      <SummaryItem
        title="Phone" value={courier.phone_number}
        icon={'edit'}
        onIconClick={() => setNewPhoneModal(true)}
      />
      <SummaryItem
        title="Date of birth"
        value={getDateWithFormat(courier.birthdate, 'MMMM DD, YYYY')}
        subValue={` (${new Date().getFullYear() - new Date(courier.birthdate).getFullYear()} years old)`}
      />
      <SummaryItem title="Full address" value={getAddressString(courier.address, false)} />
      <SummaryItem title="Apartment, suite, etc." value={courier.address && courier.address.apartment} />
      <SummaryItem title="Teams" value={teamsNames} />
      <SummaryItem title="T-shirt size" value={tShirtSizes[courier.tShirt]} />
      <SummaryItem title="Need hat?" value={courier.hatQuestion ? 'Yes' : 'No'} />
      <SummaryItem
        title="Agreement"
        value="agreement.pdf"
        onClick={handleGetFileLink(courier.hellosign.agreement, 'agreement')}
      />
      <SummaryItem title="FW9" value="fw9.pdf" onClick={handleGetFileLink(courier.hellosign.fw9, 'fw9')} />
      <SummaryItem title="How did you hear about Medzoomer?" value={courier.heardFrom} />
      <SummaryItem
        title="Have you ever worked for another delivery service (Instacart, Uber Eats, etc)?"
        value={courier.isWorked ? 'Yes' : 'No'}
      />
      <CourierSchedule schedule={courier.schedule} />
    </div>
  );
};

export default PersonalInfo;
