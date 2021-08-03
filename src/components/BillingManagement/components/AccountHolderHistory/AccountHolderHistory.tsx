import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import useSettingsGP from '../../../../hooks/useSettingsGP';
import useUser from '../../../../hooks/useUser';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';
import AccountHolderHistoryModal from '../AccountHolderHistoryModal';
import styles from './AccountHolderHistory.module.sass';

const tableCell = [
  { label: 'Date' },
  { label: 'From' },
  { label: 'User' }
];

export interface AccountHolderHistoryProps {
  invoicedId: number | null;
}

export const AccountHolderHistory = (props: AccountHolderHistoryProps) => {
  const { invoicedId } = props;
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const { getEventsForCustomer } = useSettingsGP();

  const handleViewDetails = (entry: any) => {
    setIsModalOpen(!isModalOpen);
    setSelectedEvent(entry);
  };

  const getEventsForCustomerById = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      if (invoicedId) {
        const events = await getEventsForCustomer(invoicedId);
        setEventsData(events);
      }
    } catch (error) {
      // TODO: set error message
    }
    setIsLoadingEvents(false);
  }, [invoicedId, getEventsForCustomer]);

  useEffect(() => {
    if (invoicedId) {
      getEventsForCustomerById()
        .then()
        .catch();
    }
  }, [invoicedId]);

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
      {isLoadingEvents ? (
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
                {eventsData.map((entry: any, index: number) => {
                  return renderHistory(entry, index);
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <AccountHolderHistoryModal
            selectedEvent={selectedEvent}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(!isModalOpen)}
          />
        </>
      )}
    </div>
  );
};
