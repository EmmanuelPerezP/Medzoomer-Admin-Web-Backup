import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../../../common/SVGIcon';
import styles from './AccountHolderHistoryModal.module.sass';
import Modal from 'react-modal';

export interface ModalProps {
  selectedEvent: any;
  isOpen: boolean;
  onClose: any;
}

export const AccountHolderHistoryModal = (props: ModalProps) => {
  const { selectedEvent, isOpen, onClose } = props;
  const tableCell = [
    { label: 'Field Name' },
    { label: 'Previous Value' },
    { label: 'New Value' }
  ];

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
                    return (
                      <TableRow key={index} className={styles.tableRow}>
                        <TableCell>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </TableCell>
                        <TableCell>{selectedEvent.previous[field]}</TableCell>
                        <TableCell>{selectedEvent.object[field]}</TableCell>
                      </TableRow>
                    );
                  }
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
};
