import React, { FC } from 'react';
import generalStyles from '../../Delivery.module.sass';
import { IDeliveryNotesBlock } from '../../types';

const NotesBlock: FC<IDeliveryNotesBlock> = ({ notes }) => {
  return (
    <>
      {notes && (
        <div className={generalStyles.row}>
          <p className={generalStyles.title}>Note</p>
          <p className={generalStyles.subTitle}>{notes}</p>
        </div>
      )}
    </>
  );
};

export default NotesBlock;
