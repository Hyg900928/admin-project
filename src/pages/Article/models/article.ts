import { fetchList } from '@/services/article';
import _debug from 'debug';

const debug = _debug('app:models:article');

export default {
  namespace: 'article',
  state: {
    articleList: []
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/article/list') {
          dispatch({
            type: 'getArticleList',
            payload: {}
          });
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
