import React from 'react';
import { Layout } from 'antd';
import H from 'history';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import PathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import classNames from 'classnames';
import { formatMessage } from 'umi/locale';
import Media from 'react-media';
import { Dispatch } from 'redux';
import SideMenu from '@/components/SideMenu';
import { settingsModelState } from '@/types/settings';
import getPageTitle from '@/utils/getPageTitle';
import Context from './MenuContext';
import Header from './Header';
import Footer from './Footer';
import logo from '../assets/logo.svg';
// import AuthBasicLayout from './AuthBasicLayout'

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

export interface BasicLayoutProps {
  // 通过umi注入 https://github.com/umijs/umi/blob/master/packages/umi/src/renderRoutes.js
  route: {
    routes: any[];
    path: string;
    authority: string | string[];
    component: React.ReactNode;
  };
  dispatch: Dispatch<any>;
  location: H.Location;
  setting: settingsModelState;
  collapsed: boolean;
  fixSliderBar: boolean;
  menuData: any[];
  breadcrumbNameMap: any[];
  isMobile: boolean;
}

interface State {
  rendering: boolean;
}

class BasicLayout extends React.PureComponent<BasicLayoutProps, State> {
  // private readonly breadcrumbNameMap: object;
  readonly state: State = {
    rendering: true
  };

  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority }
    } = this.props;
    // // 获取当前用户信息
    // dispatch({
    //   type: 'user/fetchCurrent'
    // });
    dispatch({
      type: 'setting/getSetting'
    });
    // 获取菜单数据
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, authority }
    });
  }
  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap
    };
  }

  handleMenuCollapse = (collapsed) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  };

  getLayoutStyle = () => {
    const { isMobile } = this.props;
    const {
      collapsed,
      setting: { layout, fixSideBar }
    } = this.props;
    if (fixSideBar && layout !== 'topMenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px'
      };
    }
    return null;
  };

  getContentStyle = () => {
    const {
      setting: { fixedHeader }
    } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0
    };
  };

  render() {
    const {
      setting: { navTheme, layout: PropsLayout },
      children,
      menuData,
      breadcrumbNameMap,
      isMobile,
      setting,
      collapsed,
      location: { pathname }
    } = this.props;
    const isTop = PropsLayout === 'topMenu';
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <div>
            <SideMenu
              logo={logo}
              theme={navTheme}
              onCollapse={this.handleMenuCollapse}
              menuData={menuData}
              isMobile={isMobile}
              {...this.props}
            />
          </div>
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh'
          }}
        >
          <Header
            logo={logo}
            setting={setting}
            collapsed={collapsed}
            isMobile={isMobile}
            handleMenuCollapse={this.handleMenuCollapse}
          />
          <Content style={this.getContentStyle()}>{children}</Content>
          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {(params) => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
          {/* <Context.Provider value={this.getContext()}>
            <div>{layout}</div>
          </Context.Provider> */}
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  setting
}))((props) => (
  <Media query="(max-width: 599px)">
    {(isMobile) => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
{
  /* <BasicLayout {...props} isMobile={isMobile} /> */
}
// const NewCom = wrapperBasicLayout(Com)

// export default  NewCom
