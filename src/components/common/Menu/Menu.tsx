import React, { FC, useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import SVGIcon from '../SVGIcon';
import useAuth from '../../../hooks/useAuth';
import useUser from '../../../hooks/useUser';
import { menuItems } from '../../../constants';
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
        {menuItems.map((item, i) => {
          if (!item.show) {
            return null
          }
          const hasNestedItems = item.nestedItems && item.nestedItems.length > 0;
          return (
            <Fragment key={i}>
              <div
                className={classNames(styles.menuItem, {
                  [styles.active]: hasNestedItems ? false : path === item.path
                })}
                onClick={handleChangeRoute(item.path)}
              >
                <SVGIcon className={styles.sectionIcon} name={item.iconName} />
                {!isHide && <Typography className={styles.titleSection}>{item.label}</Typography>}
              </div>

              {hasNestedItems &&
                (item.nestedItems || []).map((nestedItem, j) => {
                  const activeIcon = nestedItem.iconName;
                  const inactiveIcon = nestedItem.iconName.replace('Active', 'Inactive');
                  // tslint:disable-next-line:no-console
                  console.log('activeIcon', { activeIcon, inactiveIcon });
                  const iconName = path === nestedItem.path ? activeIcon : inactiveIcon;
                  return (
                    <>
                      {!isHide && (
                        <div
                          className={classNames(styles.menuItemNested, {
                            [styles.active]: path === nestedItem.path
                          })}
                          key={j}
                          onClick={handleChangeRoute(nestedItem.path)}
                        >
                          <SVGIcon className={styles.sectionIcon} name={iconName} />
                          {!isHide && <Typography className={styles.titleSection}>{nestedItem.label}</Typography>}
                        </div>
                      )}
                      {isHide && (
                        <div
                          key={j}
                          onClick={handleChangeRoute(nestedItem.path)}
                          className={classNames(styles.menuItemNestedHidden, {
                            [styles.active]: path === nestedItem.path
                          })}
                        >
                          <SVGIcon name={'plus'} />
                        </div>
                      )}
                    </>
                  );
                })}
            </Fragment>
          );
        })}
      </div>
      <div
        className={classNames(styles.menuItem, styles.logout, { [styles.active]: path === '/logout' })}
        onClick={handleChangeRoute('/logout')}
      >
        <SVGIcon className={styles.sectionIcon} name={'logout'} />
        {!isHide && <Typography className={styles.titleSection}>Logout</Typography>}
      </div>
    </>
  );
};
