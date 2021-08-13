export interface IBottomDrawerProps {
  selectedItems: number;
  isOpen: boolean;
  onCreate: () => void;
  onUnselectAll: () => void;
}
