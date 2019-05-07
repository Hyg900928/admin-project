import React from 'react';
import H from 'history';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { MenuMode } from 'antd/es/menu';
import { CollapseType } from 'antd/es/layout/Sider';
import { isUrl } from '@/utils/regexp';
import { urlToList } from '@/utils/pathTools';
import { MenuTheme } from '@/types/settings';
import { getMenuMatches } from './utils';
import { settingsModelState } from '@/types/settings';
import styles from './index.less';

// 获取Icon图标
function getIcon(icon) {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
}

const { SubMenu } = Menu;

export interface BaseMenuProps {
  openKeys?: any;
  theme?: MenuTheme;
  mode?: MenuMode;
  flatMenuKeys?: any[];
  location: H.Location;
  collapsed?: boolean;
  style?: React.CSSProperties;
  handleOpenChange?: (openKeys: any[]) => void;
  menuData: any[];
  isMobile: boolean;
  onCollapse?: (collapsed: boolean, type?: CollapseType) => void;
  onOpenChange?: (openKeys: string[]) => void;
  setting: settingsModelState;
}

class BaseMenu extends React.PureComponent<BaseMenuProps, any> {
  public wrap: any;
  constructor(props) {
    super(props);
  }

  // 获取菜单子节点
  getNavMenuItems = (menusData) => {
    if (!menusData) return [];
    return menusData
      .filter((item) => item.name && !item.hideInMenu)
      .map((item) => this.getSubMenuOrItem(item))
      .filter((item) => item);
  };

  //
  getSubMenuOrItem = (item) => {
    if (
      item.children &&
      !item.hideChildrenInMenu &&
      item.children.some((child) => child.name)
    ) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  getMenuItemPath = (item) => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };
  getPopupContainer = (fixedHeader, layout) => {
    if (fixedHeader && layout === 'topmenu') {
      return this.wrap;
    }
    return document.body;
  };
  getRef = (ref) => {
    this.wrap = ref;
  };

  getSelectedMenuKeys = (pathname) => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map((itemPath) =>
      getMenuMatches(flatMenuKeys, itemPath).pop()
    );
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      collapsed,
      location: { pathname },
      handleOpenChange,
      style,
      menuData,
      setting: { fixedHeader, layout }
    } = this.props;
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys
      };
    }

    return (
      <>
        <Menu
          key="Menu"
          mode={mode}
          theme={theme}
          onOpenChange={handleOpenChange}
          selectedKeys={selectedKeys}
          style={style}
          className={mode === 'horizontal' ? 'top-nav-menu' : ''}
          {...props}
          getPopupContainer={() => this.getPopupContainer(fixedHeader, layout)}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
        <div ref={this.getRef} />
      </>
    );
  }
}

export default BaseMenu;
