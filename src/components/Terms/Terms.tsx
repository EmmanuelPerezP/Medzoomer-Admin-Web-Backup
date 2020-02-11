import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import src from '../../assets/img/terms-logo@3x.png';

import styles from './Terms.module.sass';

export const Terms: FC = () => {
  return (
    <div className={styles.termsWrapper}>
      <div className={styles.header}>
        <img src={src} className={styles.logo} />
        <Button className={styles.signIn} variant="outlined" color="secondary">
          <Link className={styles.link} href={'/login'}>
            Sign In
          </Link>
        </Button>
      </div>
      <div className={styles.textWrapper}>
        <Typography className={styles.title}>Terms and Conditions</Typography>
        <div className={styles.article}>
          <Typography variant={'h6'} className={styles.subtitle}>
            Cras quis nulla
          </Typography>
          <Typography variant={'h6'} className={styles.text}>
            Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem
            pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae
            erat. Nulla mollis sapien sollicitudin lacinia lacinia. Vivamus facilisis dolor et massa placerat, at
            vestibulum nisl egestas. Nullam rhoncus lacus non odio luctus, eu condimentum mauris ultrices. Praesent
            blandit, augue a posuere aliquam, arcu tortor feugiat tu.
          </Typography>
        </div>
        <div className={styles.article}>
          <Typography variant={'h6'} className={styles.subtitle}>
            Cras quis nulla commodo, aliquam lectus
          </Typography>
          <Typography variant={'h6'} className={styles.text}>
            Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. Duis
            tincidunt urna non pretium porta. Nam condimentum vitae ligula vel ornare. Phasellus at semper turpis. Nunc
            eu tellus tortor. Etiam at condimentum nisl, vitae sagittis orci. Donec id dignissim nunc. Donec elit ante,
            eleifend a dolor et, venenatis facilisis dolor. In feugiat orci odio, sed lacinia sem elementum quis.
            Aliquam consectetur, eros et vulputate euismod, nunc leo tempor lacus, ac rhoncus neque eros nec lacus. Cras
            lobortis molestie faucibus. Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien
            metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. Ut porta viverra est,
            ut dignissim elit elementum ut. Nunc vel rhoncus nibh, ut tincidunt turpis. Integer ac enim pellentesque,
            adipiscing metus id, pharetra odio. Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet
            mauris. Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie mollis nulla. Etiam lorem
            orci, consequat ac magna quis, facilisis vehicula neque. Nam porttitor blandit accumsan. Ut vel dictum sem,
            a pretium dui. In malesuada enim in dolor euismod, id commodo mi consectetur.
          </Typography>
        </div>
        <div className={styles.article}>
          <Typography variant={'h6'} className={styles.subtitle}>
            Nam porttitor blandit.
          </Typography>
          <Typography variant={'h6'} className={styles.text}>
            Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui. In malesuada enim in dolor euismod, id
            commodo mi consectetur. Curabitur at vestibulum nisi. Nullam vehicula nisi velit. Mauris turpis nisl,
            molestie ut ipsum et, suscipit vehicula odio. Vestibulum interdum vestibulum felis ac molestie. Praesent
            aliquet quam et libero dictum, vitae dignissim leo eleifend. In in turpis turpis. Quisque justo turpis,
            vestibulum non enim nec, tempor mollis mi. Sed vel tristique quam.Mauris non tempor quam, et lacinia sapien.
            Mauris accumsan eros eget libero posuere vulputate.
          </Typography>
        </div>
        <div className={styles.article}>
          <Typography variant={'h6'} className={styles.subtitle}>
            Nam porttitor blandit.
          </Typography>
          <Typography variant={'h6'} className={styles.text}>
            Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui. In malesuada enim in dolor euismod, id
            commodo mi consectetur. Curabitur at vestibulum nisi. Nullam vehicula nisi velit. Mauris turpis nisl,
            molestie ut ipsum et, suscipit vehicula odio. Vestibulum interdum vestibulum felis ac molestie. Praesent
            aliquet quam et libero dictum, vitae dignissim leo eleifend. In in turpis turpis. Quisque justo turpis,
            vestibulum non enim nec, tempor mollis mi. Sed vel tristique quam.Mauris non tempor quam, et lacinia sapien.
            Mauris accumsan eros eget libero posuere vulputate.
          </Typography>
        </div>
        <div className={styles.article}>
          <Typography variant={'h6'} className={styles.subtitle}>
            Cras quis nulla commodo, aliquam lectus
          </Typography>
          <Typography variant={'h6'} className={styles.text}>
            Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. Duis
            tincidunt urna non pretium porta. Nam condimentum vitae ligula vel ornare. Phasellus at semper turpis. Nunc
            eu tellus tortor. Etiam at condimentum nisl, vitae sagittis orci. Donec id dignissim nunc. Donec elit ante,
            eleifend a dolor et, venenatis facilisis dolor. In feugiat orci odio, sed lacinia sem elementum quis.
            Aliquam consectetur, eros et vulputate euismod, nunc leo tempor lacus, ac rhoncus neque eros nec lacus. Cras
            lobortis molestie faucibus. Donec facilisis tortor ut augue lacinia, at viverra est semper. Sed sapien
            metus, scelerisque nec pharetra id, tempor a tortor. Pellentesque non dignissim neque. Ut porta viverra est,
            ut dignissim elit elementum ut. Nunc vel rhoncus nibh, ut tincidunt turpis. Integer ac enim pellentesque,
            adipiscing metus id, pharetra odio. Donec bibendum nunc sit amet tortor scelerisque luctus et sit amet
            mauris. Suspendisse felis sem, condimentum ullamcorper est sit amet, molestie mollis nulla. Etiam lorem
            orci, consequat ac magna quis, facilisis vehicula neque. Nam porttitor blandit accumsan. Ut vel dictum sem,
            a pretium dui. In malesuada enim in dolor euismod, id commodo mi consectetur.
          </Typography>
        </div>
      </div>
      <div className={styles.footer}>
        <Typography className={styles.title}>© Copyright 2020 MedZoomer</Typography>
        <Typography className={styles.title}>Terms and Conditions</Typography>
      </div>
    </div>
  );
};
