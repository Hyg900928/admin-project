import { fetchCurrentUser } from '@/services/user.service';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import Storage from '@/utils/storage';
import { setAuthority } from '@/utils/authority';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    isLogin: false,
    isSuperAdmin: false
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(fetchCurrentUser);
      // console.log(response)
      if (response && response.code === 0) {
        const userInfo = response.data;
        yield put({
          type: 'saveCurrentUser',
          payload: {
            id: userInfo.id,
            account: userInfo.account,
            avatar:
              userInfo.avatar ||
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            roles: userInfo.roles,
            isLogin: true
          }
        });
        yield put({
          type: 'changeLoginStatus',
          payload: {
            isLogin: true
          }
        });
      }
    },
    *fetchLogout(_, { call, put }) {
      Storage.removeItem('token');
      Storage.removeItem('app-authority');
      yield put({
        type: 'saveCurrentUser',
        payload: {}
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href
          })
        })
      );
    }
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      setAuthority(payload.roles);
      return {
        ...state,
        currentUser: payload
      };
    },
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        isLogin: payload.isLogin
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount
        }
      };
    }
  }
};
