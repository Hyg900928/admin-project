import { createArticle, getArticleInfo, editArticle } from '@/services/article';
import { getTagList } from '@/services/tag';
import { routerRedux } from 'dva/router';
import { Model } from 'dva';
import { ArticleList } from '@/types/article';
import { message } from 'antd';
import _debug from 'debug';

const debug = _debug('app:models:createArticle');

const defaultState: ArticleList.CreateArticleState = {
  articleData: {
    content: null,
    title: '',
    tags: []
  },
  tagsList: [],
  type: 'create'
};

export default {
  namespace: 'createArticle',
  state: defaultState,
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/article/create') {
          // 初始化
          dispatch({
            type: 'resetState',
            payload: {
              ...defaultState
            }
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
    },
    *edit({ payload }, { call, put }) {
      const { _id, ...data } = payload;
      const res = yield call(editArticle, _id, data);
      if (res.code === 0) {
        message.info('编辑成功', 2);
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
