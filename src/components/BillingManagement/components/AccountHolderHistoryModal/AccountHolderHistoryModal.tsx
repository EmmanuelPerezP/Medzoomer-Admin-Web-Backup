import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SVGIcon from "../../../common/SVGIcon";
import styles from "./AccountHolderHistoryModal.module.sass";
import Modal from "react-modal";

export interface ModalProps {
  selectedEvent: any;
  isOpen: boolean;
  onClose: any;
}

export const AccountHolderHistoryModal = (props: ModalProps) => {
  const { selectedEvent, isOpen, onClose } = props;
  const tableCell = [
    { label: "Field Name" },
    { label: "Previous Value" },
    { label: "New Value" }
  ];

  const parseFieldName = (field: string) => {
    let parsedFieldName = '-';
    if (field) {
      const capitalized = field.charAt(0).toUpperCase() + field.slice(1);
      parsedFieldName = capitalized.replace('_', ' ');
    }
    return parsedFieldName;
  };

  const renderChanges = (field: any, index: number) => {
    return (
      <TableRow key={index} className={styles.tableRow}>
        <TableCell>{parseFieldName(field)}</TableCell>
        <TableCell>{selectedEvent.previous[field] || '-'}</TableCell>
        <TableCell>
          {field === "payment_source"
            ? selectedEvent.object[field].brand
            : selectedEvent.object[field] || '-'}
        </TableCell>
      </TableRow>
    );
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
              {selectedEvent.object &&
                Object.keys(selectedEvent.object).map(
                  (field: string, index: number) => {
                    return renderChanges(field, index);
                  }
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
};
