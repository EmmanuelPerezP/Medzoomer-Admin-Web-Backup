export interface Prescriptions {
  name: string;
  dose: string;
  quantity: number;
  rxNumber: number | null;
  rxFillDate: Date | null;
  rxCopay: number | null;
}
