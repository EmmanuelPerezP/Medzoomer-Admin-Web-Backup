import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { contactTypes } from '../../../../constants';
import usePharmacy from '../../../../hooks/usePharmacy';
import { decodeErrors } from '../../../../utils';
import Loading from '../../../common/Loading';
import SVGIcon from '../../../common/SVGIcon';
import styles from '../Settings.module.sass';
import useSettingsGP from '../../../../hooks/useSettingsGP';

const tableCell = [
  { label: 'Full Name' },
  { label: 'Company Name' },
  { label: 'Title' },
  { label: 'Email' },
  { label: 'Phone' },
  { label: 'Type' },
  { label: 'Action' }
];

export const ContactsTable = ({ selectedContacts, selectedManagers, isContactLoading, handleRemoveContact }: any) => {
  const groupManagerDelimeter = '__delimeter__';

  const computedContacts = useMemo(() => {
    return selectedContacts.concat(selectedManagers);
  }, [selectedContacts, selectedManagers]);

  return (
    <div className={styles.groupBlock}>
      {isContactLoading ? (
        <Loading className={styles.loading} />
      ) : (
        <>
          <Typography className={styles.blockTitle}>Contacts</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className={styles.tableHeade}>
                  {tableCell.map((item, index) => (
                    <TableCell key={index}>{item.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {computedContacts.map((contact: any, index: number) => {
                  const isGroupManager = !!contact.cognitoId;
                  const [companyName, title] = isGroupManager
                    ? contact.jobTitle.split(groupManagerDelimeter)
                    : ['', ''];
                  const removeContactIdentifier = isGroupManager ? contact.email : contact._id;

                  return (
                    <TableRow key={index} className={styles.tableRow}>
                      <TableCell>
                        {isGroupManager ? `${contact.name} ${contact.family_name}` : contact.fullName}
                      </TableCell>
                      <TableCell>{isGroupManager ? companyName : contact.companyName}</TableCell>
                      <TableCell>{isGroupManager ? title : contact.title}</TableCell>
                      <TableCell size="small">{contact.email}</TableCell>
                      <TableCell>{isGroupManager ? contact.phone_number : contact.phone}</TableCell>
                      <TableCell size="small">
                        {isGroupManager ? contactTypes['GROUP-MANAGER'] : contactTypes[contact.type]}
                      </TableCell>
                      <TableCell align="right" size="small">
                        <SVGIcon
                          className={styles.closeIcon}
                          name="remove"
                          onClick={() => handleRemoveContact(removeContactIdentifier, isGroupManager).catch()}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};
