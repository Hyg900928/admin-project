import React from 'react';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import H from 'history';
import SelectLang from '@/components/SelectLang';
import { copyright } from './Footer';
import getPageTitle from '@/utils/getPageTitle';
import styles from './UserLayout.less';

interface UserLayoutProps {
  dispatch: Dispatch<any>;
  route: {
    routes: any[];
    path: string;
    authority: string | string[];
    component: React.ReactNode;
  };
  location: H.Location;
  menuData: any[];
  breadcrumbNameMap: any[];
  children?: React.ReactNode;
}

class UserLayout extends React.PureComponent<UserLayoutProps, any> {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority }
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority }
    });
  }
  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>

          <div className={styles.content}>{children}</div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap
}))(UserLayout);
