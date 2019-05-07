import React from 'react';
import { Layout } from 'antd';
import ClassNames from 'classnames';
import { BaseMenuProps } from './BaseMenu';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './utils';
import styles from './index.less';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

export interface SideMenuProps extends BaseMenuProps {
  logo: string;
  collapsed?: boolean;
  fixSideBar?: boolean;
}

interface State {
  readonly openKeys: string[];
  flatMenuKeysLen?: Number;
  pathname?: String;
}
let firstMount = true;

class SideMenu extends React.PureComponent<SideMenuProps, State> {
  constructor(props: SideMenuProps) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(this.props)
    };
  }
  static getDerivedStateFromProps(props: SideMenuProps, state: State): State {
    const { pathname, flatMenuKeysLen } = state;
    if (
      props.location.pathname !== pathname ||
      props.flatMenuKeys.length !== flatMenuKeysLen
    ) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props)
      };
    }
    return null;
  }
  componentDidMount() {
    firstMount = false;
  }
  //
  isMainMenu = (key) => {
    const { menuData } = this.props;
    return menuData.some((item) => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  // 菜单打开的回调
  handleOpenChange = (openKeys) => {
    const moreThanOne =
      openKeys.filter((openKey) => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys]
    });
  };

  render() {
    const { theme, collapsed, onCollapse, fixSideBar, isMobile } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={(collapse) => {
          if (firstMount || !isMobile) {
            onCollapse(collapse);
          }
        }}
        breakpoint="lg"
        width={256}
        className={ClassNames(styles.sideMenu, {
          [styles.fixSideBar]: fixSideBar,
          [styles.light]: theme === 'light'
        })}
      >
        <React.Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          />
        </React.Suspense>
      </Sider>
    );
  }
}

export default SideMenu;
