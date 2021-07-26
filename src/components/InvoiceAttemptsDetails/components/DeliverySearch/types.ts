export interface IDeliverySearch {
  amount: string | number;
  searchValue: string;
  onChangeSearchValue: (v: string) => void;
}
