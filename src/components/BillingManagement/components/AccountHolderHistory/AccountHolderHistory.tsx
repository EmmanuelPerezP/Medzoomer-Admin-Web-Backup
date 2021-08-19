import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import useSettingsGP from "../../../../hooks/useSettingsGP";
import useUser from "../../../../hooks/useUser";
import Loading from "../../../common/Loading";
import SVGIcon from "../../../common/SVGIcon";
import AccountHolderHistoryModal from "../AccountHolderHistoryModal";
import styles from "./AccountHolderHistory.module.sass";
import { useStores } from "../../../../store";

const tableCell = [{ label: "Date" }, { label: "From" }, { label: "User" }];

export interface AccountHolderHistoryProps {
  invoicedId?: number | null;
}

export const AccountHolderHistory = (props: AccountHolderHistoryProps) => {
  const { invoicedId } = props;
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const {
    billingAccountHolderHistory,
    billingAccountFilters,
    getEventsForCustomer
  } = useSettingsGP();
  const { settingGPStore } = useStores();
  const [isLastPage, setIsLastPage] = useState(false);

  const handleViewDetails = (entry: any) => {
    setIsModalOpen(!isModalOpen);
    setSelectedEvent(entry);
  };

  const getEventsForCustomerById = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      if (invoicedId) {
        const events = await getEventsForCustomer(
          invoicedId,
          billingAccountFilters
        );
        if (events) {
          setTotalCount(events.totalCount);
          settingGPStore.set("billingAccountHolderHistory")([
            ...billingAccountHolderHistory,
            ...events.data
          ]);
        }
      }
    } catch (error) {
      // TODO: set error message
    }
    setIsLoadingMoreEvents(false);
    setIsLoadingEvents(false);
  }, [invoicedId, billingAccountFilters, getEventsForCustomer]);

  useEffect(() => {
    totalCount !== 0 && billingAccountHolderHistory.length === totalCount
      ? setIsLastPage(true)
      : setIsLastPage(false);
  }, [billingAccountHolderHistory]);

  useEffect(() => {
    if (invoicedId) {
      getEventsForCustomerById()
        .then()
        .catch();
    }
  }, [invoicedId, billingAccountFilters]);

  const handleChangePage = () => {
    settingGPStore.set("billingAccountFilters")({
      ...billingAccountFilters,
      page: billingAccountFilters.page + 1
    });
    setIsLoadingMoreEvents(true);
  };

  const renderHistory = (entry: any, index: number) => {
    return (
      <TableRow key={index} className={styles.tableRow}>
        <TableCell>
          {moment(new Date(entry.timestamp * 1000)).format(
            "MM/DD/YYYY, hh:mm:ss a"
          )}
        </TableCell>
        <TableCell>{entry.user.email ? "Invoiced" : "Medzoomer"}</TableCell>
        <TableCell>
          {entry.user.email || `${user.name} ${user.family_name}`}
        </TableCell>
        <TableCell align="left" size="small">
          <div
            className={styles.actionsCell}
            onClick={() => handleViewDetails(entry)}
          >
            <SVGIcon className={styles.viewDetails} name="details" />
            <Typography className={styles.actionName}>View Details</Typography>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className={styles.historyBlock}>
      {isLoadingEvents && !isLoadingMoreEvents ? (
        <Loading className={styles.loading} />
      ) : (
        <>
          {billingAccountHolderHistory.length > 0 ? (
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
                    {billingAccountHolderHistory.map(
                      (entry: any, index: number) => {
                        return renderHistory(entry, index);
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {!isLastPage &&
                (isLoadingMoreEvents ? (
                  <Loading className={styles.loading} />
                ) : (
                  <Typography
                    className={styles.loadMore}
                    onClick={handleChangePage}
                  >
                    Load more...
                  </Typography>
                ))}
              <AccountHolderHistoryModal
                selectedEvent={selectedEvent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(!isModalOpen)}
              />
            </>
          ) : (
            <Typography className={styles.noHistory}>
              No history found
            </Typography>
          )}
        </>
      )}
    </div>
  );
};
