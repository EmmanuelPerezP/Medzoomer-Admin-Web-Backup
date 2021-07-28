import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, { useMemo, useState } from "react";
import Loading from "../../../common/Loading";
import SVGIcon from "../../../common/SVGIcon";
import AccountHolderHistoryModal from "../AccountHolderHistoryModal";
import AddContactModal from "../AddContactModal";
import styles from "./AccountHolderHistory.module.sass";

const tableCell = [
  { label: "Date" },
  { label: "From" },
  { label: "User" }
  // { label: "Action" }
];

const history = [
  { date: "07/18/2021, 3:42:12 pm", from: "Medzoomer", user: "Oliver Freen" },
  {
    date: "06/28/2021, 10:57:45 pm",
    from: "Invoiced",
    user: "revstar@consulting.com"
  }
];

export interface AccountHolderHistoryProps {
  notDefaultBilling: any;
  isLoading: boolean;
}

export const AccountHolderHistory = (props: AccountHolderHistoryProps) => {
  const { notDefaultBilling, isLoading } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const groupManagerDelimeter = "__delimeter__";

  return (
    <div className={styles.historyBlock}>
      {isLoading ? (
        <Loading className={styles.loading} />
      ) : (
        <>
          <Typography className={styles.blockSubtitle}>
            Billing Account Holder Change History
          </Typography>
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
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.from}</TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell align="left" size="small">
                        <div
                          className={styles.actionsCell}
                          onClick={() => setIsModalOpen(!isModalOpen)}
                        >
                          <SVGIcon
                            className={styles.viewDetails}
                            name="details"
                          />
                          <Typography className={styles.actionName}>
                            View Details
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <AccountHolderHistoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(!isModalOpen)}
          />
          {/* <AddContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(!isModalOpen)}
          /> */}
        </>
      )}
    </div>
  );
};
