import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import SVGIcon from "../../../common/SVGIcon";
import styles from "./AccountHolderHistoryModal.module.sass";
import Modal from "react-modal";

const tableCell = [
  { label: "Field Name" },
  { label: "Previous Value" },
  { label: "New Value" }
];

const history = [
  { fieldName: "Account", previousValue: "CUST-00012", newValue: "CUST-00010" },
  {
    fieldName: "Name",
    previousValue: "Stanley Sanchez",
    newValue: "Stanley's Pharmacy"
  },
  { fieldName: "Attention to", previousValue: "-", newValue: "Stanley Sanchez" },
];

export interface AccountHolderHistoryModalProps {
  typeObject?: string;
  objectId?: string;
  settingsGP?: any;
  isOpen: boolean;
  onClose: any;
}

export const AccountHolderHistoryModal = (
  props: AccountHolderHistoryModalProps
) => {
  const { isOpen, onClose } = props;
  const groupManagerDelimeter = "__delimeter__";
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleToggleAddContactModal = () => {
    console.log("adding entry");
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleViewChanges = () => {
    console.log("changes");
  };

  return (
    <Modal
      shouldFocusAfterRender={false}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      onRequestClose={onClose}
      isOpen={isOpen}
      className={styles.modal}
    >
      <div className={styles.modalHeader}>
        <Typography className={styles.blockTitle}>
          Billing Account Holder Change History
        </Typography>
        <SVGIcon name="close" className={styles.closeIcon} onClick={onClose} />
      </div>

      <div className={styles.content}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                {tableCell.map((item, index) => (
                  <TableCell key={index}>{item.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((entry: any, index: number) => {
                return (
                  <TableRow key={index} className={styles.tableRow}>
                    <TableCell>{entry.fieldName}</TableCell>
                    <TableCell>{entry.previousValue}</TableCell>
                    <TableCell>{entry.newValue}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
};
