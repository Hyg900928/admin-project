import { getTagList, createTag } from '@/services/tag';
import _debug from 'debug';

const debug = _debug('app:models:tag');

export default {
  namespace: 'tag',
  state: {
    tagList: [],
    modalVisible: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tags/tagList') {
          dispatch({
            type: 'getTagList',
            payload: {}
          });
        }
      });
    }
  },
  effects: {
    *getTagList({ payload }, { call, put }) {
      const res = yield call(getTagList);
      debug(res);
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            tagList: res.data
          }
        });
      }
    },
    *createTag({ payload, callback }, { call, put }) {
      const res = yield call(createTag, payload);
      console.log(res);
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            modalVisible: false
          }
        });
        yield put({
          type: 'getTagList'
        });
        callback && callback();
      }
    }
  },

  reducers: {
    onChangeState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
