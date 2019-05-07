import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import Exception403 from '@/pages/Exception/403';
// import router from 'umi/router';

function AuthComponent({ children, location, routerData, isLogin }) {
  const getRouteAuthority = (path, routeData) => {
    let authorities: any;
    routeData.forEach((route) => {
      // match prefix
      //  console.log(route)
      if (pathToRegexp(`${route.path}(.*)`).test(path)) {
        authorities = route.authority || authorities;

        // get children authority recursively
        if (route.routes) {
          authorities = getRouteAuthority(path, route.routes) || authorities;
        }
      }
    });
    return authorities;
  };
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={isLogin ? <Exception403 /> : <Redirect to="/user/login" />}
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel, user }) => ({
  routerData: menuModel.routerData,
  isLogin: user.isLogin
}))(AuthComponent);
