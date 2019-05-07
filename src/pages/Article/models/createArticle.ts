import { createArticle, getArticleInfo } from '@/services/article';
import { getTagList } from '@/services/tag';
import { routerRedux } from 'dva/router';
import { getPageQuery } from '@/utils/utils';
import { Model } from 'dva';
import { ArticleList } from '@/types/article';
import { message } from 'antd';
import _debug from 'debug';

const debug = _debug('app:models:createArticle');

const defaultState: ArticleList.CreateArticleState = {
  articleData: {},
  tagsList: [],
  type: 'create'
};

export default {
  namespace: 'createArticle',
  state: defaultState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const query = getPageQuery();
        console.log(query);
        if (location.pathname === '/article/create') {
          dispatch({
            type: 'query',
            payload: {}
          });
          if (query && query.id) {
            dispatch({
              type: 'onChangeState',
              payload: {
                type: 'edit'
              }
            });
            dispatch({
              type: 'getArticleInfo',
              payload: {
                id: query.id,
                type: 'edit'
              }
            });
          }
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
    *getArticleInfo({ payload }, { call, put }) {
      const res = yield call(getArticleInfo, payload.id);
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            articleData: res.data
          }
        });
      }
      debug(res);
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
        ...payload
      };
    }
  }
} as Model;
