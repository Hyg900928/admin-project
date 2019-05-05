import { createArticle } from '@/services/article';
import { getTagList } from '@/services/tag';
import { routerRedux } from 'dva/router';
import { Model } from 'dva';
import { message } from 'antd';
import _debug from 'debug';

const debug = _debug('app:models:createArticle');

// const defaultState = {
//   articleData: {},
//   tagsList: []
// }

export default {
  namespace: 'createArticle',
  state: {
    articleData: {},
    tagsList: []
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/article/create') {
          dispatch({
            type: 'query',
            payload: {}
          });
        }
      });
    }
  },
  effects: {
    *query({ payload }, { call, put }) {
      const res = yield call(getTagList);
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            tagsList: res.data
          }
        });
      }
      // debug(res.data)
    },
    *create({ payload }, { call, put }) {
      const res = yield call(createArticle, payload);
      if (res.code === 0) {
        message.info('创建成功', 2);
        yield put(routerRedux.push('/article/list'));
      }
      debug(res);
    }
  },

  reducers: {
    resetState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    onChangeState(state, { payload }) {
      return {
        ...state,
        tagsList: payload.tagsList
      };
    }
  }
} as Model;
