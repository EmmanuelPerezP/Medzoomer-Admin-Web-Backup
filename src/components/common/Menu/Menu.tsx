import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../SVGIcon';
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser';
import { menuItems, newItems } from '../../../constants';
import styles from './Menu.module.sass';

export const Menu: FC<{ isHide: boolean }> = (props) => {
  const { isHide } = props;
  const { logOut, setToken } = useAuth();
  const { removeUser } = useUser();
  const history = useHistory();
  const [path, setPath] = useState(history.location.pathname);

  const handleChangeRoute = (currentPath: string) => async () => {
    setPath(currentPath);
    if (currentPath === '/logout') {
      try {
        await logOut();
        setToken('');
        removeUser();
      } catch (err) {
        console.error(err);
      }
    } else {
      history.push(currentPath);
    }
  };

  useEffect(() => {
    setPath(history.location.pathname);
  }, [history.location.pathname]);

  return (
    <>
      <div className={classNames(styles.menuWrapper)}>
        {menuItems.map((item) => {
          const hasNestedItems = item.path.includes('new');

          return (
            <>
              <div
                className={classNames(styles.menuItem, { [styles.active]: path === item.path })}
                key={item.path}
                onClick={handleChangeRoute(item.path)}
              >
                <SVGIcon className={styles.sectionIcon} name={item.iconName} />
                {!isHide && <Typography className={styles.titleSection}>{item.label}</Typography>}
              </div>

              {hasNestedItems &&
                newItems.map((nestedItem) => {
                  return (
                    <div
                      className={classNames(styles.menuItemNested, { [styles.active]: path === nestedItem.path })}
                      key={nestedItem.path}
                      onClick={handleChangeRoute(nestedItem.path)}
                    >
                      {nestedItem.label}
                    </div>
                  );
                })}
            </>
          );
        })}
      </div>
      <div
        className={classNames(styles.menuItem, styles.logout, { [styles.active]: path === '/logout' })}
        onClick={handleChangeRoute('/logout')}
      >
        <SVGIcon className={styles.sectionIcon} name={'logout'} />
        {!isHide ? <Typography className={styles.titleSection}>Logout</Typography> : null}
      </div>
    </>
  );
};
