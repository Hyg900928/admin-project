import { fetchList, createArticle } from '@/services/article';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import _debug from 'debug';

const debug = _debug('app:models:createArticle');

export default {
  namespace: 'createArticle',
  state: {
    articleData: {}
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/article/list') {
        }
      });
    }
  },
  effects: {
    *getArticleList({ payload }, { call, put }) {
      const res = yield call(fetchList);
      debug(res);
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            articleList: res.data
          }
        });
      }
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
    onChangeState(state, { payload }) {
      return {
        ...state,
        articleList: payload.articleList
      };
    }
  }
};
