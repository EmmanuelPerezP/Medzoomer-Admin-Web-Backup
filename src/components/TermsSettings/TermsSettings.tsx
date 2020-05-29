import React, { FC, useCallback, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import styles from './TermsSettings.module.sass';
import useSetting from '../../hooks/useSetting';
import { SETTINGS } from '../../constants';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export const TermsSettings: FC = () => {
  const { getSetting, updateSetting } = useSetting();
  const [content = '', setContent] = useState('');
  const [loading = '', setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSetting([SETTINGS.TERMS])
      .then((d) => {
        if (d && d.data && d.data[SETTINGS.TERMS]) {
          setContent(d.data[SETTINGS.TERMS] || '');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []); // eslint-disable-line

  const handleUpdateTerms = useCallback(
    (e) => {
      setLoading(true);
      updateSetting(SETTINGS.TERMS, content)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    },
    [content] // eslint-disable-line
  );
  const handleEdit = useCallback(
    (c) => {
      setContent(c);
    },
    [content] // eslint-disable-line
  );

  return (
    <div className={styles.termsWrapper}>
      <div className={styles.textWrapper}>
        <Editor
          apiKey="n6z5xcae9txjc1zs3oz00u76ufys1drxxjpo7yas5xxh3w2x"
          initialValue={content}
          init={{
            height: 500,
            menubar: false,
            plugins: [],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat'
          }}
          onEditorChange={handleEdit}
          value={content}
        />
        <div className={styles.navigation}>
          <Button variant="contained" color="secondary" disabled={!!loading} onClick={handleUpdateTerms}>
            <Typography>Update Terms and Conditions</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};
