import React, { FC } from 'react';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  IconButton,
  Typography,
  Box
} from '@material-ui/core';
import SVGIcon from '../../../../../common/SVGIcon';
import { useStyles } from './styles1';
import styles2 from './styles2.module.sass';

interface AccordionWrapper {
  onSetEdit: any;
  onChangeAccordion: any;
  expandedAccordion: boolean;
  label: string;
  renderAccordionDetails: any;
  onSetTypeInfo: any;
}

const AccordionWrapper: FC<AccordionWrapper> = ({
  onSetEdit,
  onChangeAccordion,
  expandedAccordion,
  label,
  renderAccordionDetails,
  onSetTypeInfo
}) => {
  const classes = useStyles();

  return (
    <ExpansionPanel
      classes={{ root: classes.root, expanded: classes.expanded }}
      square
      expanded={expandedAccordion}
      onChange={onChangeAccordion}
    >
      <ExpansionPanelSummary classes={{ root: classes.summary }}>
        <div className={styles2.summaryWrapper}>
          <Typography className={styles2.title}>{label}</Typography>
          <div className={styles2.buttonsWrapperInSummary}>
            {
              <div className={styles2.editIcon}>
                <IconButton
                  size="small"
                  onClick={() => {
                    onSetEdit(true);
                    onSetTypeInfo(label);
                  }}
                >
                  <SVGIcon name={'edit'} />
                </IconButton>
              </div>
            }
            <div>{expandedAccordion ? <ExpandLess color="inherit" /> : <ExpandMore color="inherit" />}</div>
          </div>
        </div>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails classes={{ root: classes.details }}>
        <Box width="100%">{renderAccordionDetails()}</Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default AccordionWrapper;
