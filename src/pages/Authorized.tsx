import React from 'react';
import Redirect from 'umi/redirect';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import router from 'umi/router';

function AuthComponent({ children, location, routerData, status }) {
  // console.log(location, routerData, status)
  const isLogin = status === 'ok';
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
    console.log(authorities);
    return authorities;
  };
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routerData)}
      noMatch={
        isLogin ? (
          <Redirect to="/exception/403" />
        ) : (
          <Redirect to="/user/login" />
        )
      }
    >
      {children}
    </Authorized>
  );
}
export default connect(({ menu: menuModel }) => ({
  routerData: menuModel.routerData,
  status: 'ok'
}))(AuthComponent);
