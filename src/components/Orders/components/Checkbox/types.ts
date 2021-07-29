export interface ICheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
  showAlternativeCheckedIcon?: boolean;
  disabled?: boolean;
}
