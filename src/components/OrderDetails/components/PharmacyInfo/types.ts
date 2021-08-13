import { Pharmacy, PharmacyUser } from '../../../../interfaces';

export interface IPharmacyInfoProps {
  pharmacy: Pharmacy;
  pharmacist: PharmacyUser | string | null | undefined;
}
