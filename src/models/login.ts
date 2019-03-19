import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fetchLogin } from '@/services/user.service';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',
  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fetchLogin, payload);
      console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response
      });
      // Login successfully
      if (response.code === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        console.log('urlParams', urlParams);
        const params = getPageQuery();
        console.log('params', params);
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          console.log('redirectUrlParams', redirectUrlParams);
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
      yield put(
        routerRedux.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href
          })
        })
      );
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        status: payload.code
      };
    }
  }
};
