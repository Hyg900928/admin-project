import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fetchLogin } from '@/services/user.service';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',
  state: {},
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user/login') {
          // console.log('lll')
          // dispatch({
          //   type: 'getUserInfo',
          //   payload: '',
          // })
        }
      });
    }
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fetchLogin, payload);
      if (response.data) {
        window.sessionStorage.setItem('token', response.data);
      }
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: {
      //     ...response,
      //     isLogin: true
      //   }
      // });
      if (response.code === 0) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        // console.log('urlParams', urlParams);
        const params = getPageQuery();
        // console.log('params', params);
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          // console.log('redirectUrlParams', redirectUrlParams);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *getCaptcha({ payload }, { call }) {
      // yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest'
        }
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href
            })
          })
        );
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.data.roles);
      return {
        ...state,
        isLogin: payload.isLogin
      };
    }
  }
};
