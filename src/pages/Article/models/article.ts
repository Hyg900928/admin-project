import { fetchList, deleteArticle } from '@/services/article';
import { routerRedux } from 'dva/router';
import { Model } from 'dva';
import _debug from 'debug';
import { message } from 'antd';

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
          // dispatch({
          //   type: 'getArticleList',
          //   payload: {}
          // });
        }
      });
    }
  },
  effects: {
    *getArticleList({ payload }, { call, put }) {
      const res = yield call(fetchList);
      debug(res);
      // debug('tagList', tagList)
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            articleList: res.data
          }
        });
      }
    },
    *deleteArticle({ payload }, { call, put }) {
      const res = yield call(deleteArticle, payload.id);
      console.log(res);
      if (res.code === 0) {
        message.info('删除成功', 2);
        yield put({
          type: 'getArticleList'
        });
      }
    },
    *changeArticleType({ payload }, { put }) {
      yield put({
        type: 'createArticle/onChangeState',
        payload: {
          articleData: payload.articleData
        }
      });
      yield put(
        routerRedux.push(`/article/create?id=${payload.articleData._id}`)
      );
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
} as Model;
