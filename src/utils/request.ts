import axios, { AxiosRequestConfig } from 'axios';
// import router from 'umi/router';
import { notification } from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { AXIOS_DEFAULT_CONFIG } from '@/config';
import Storage from '@/utils/storage';

axios.defaults.timeout = AXIOS_DEFAULT_CONFIG.timeout;
axios.defaults.baseURL = AXIOS_DEFAULT_CONFIG.baseURL;
axios.defaults.withCredentials = AXIOS_DEFAULT_CONFIG.withCredentials;
axios.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers.put['Content-Type'] =
  'application/x-www-form-urlencoded';

function requestSuccess(config) {
  // 请求开始，开启进度条
  NProgress.start();

  const token = Storage.getItem('token');
  config.headers.common['Authorization'] = `Bearer ${token}`;

  return config;
}

function requestFail(error) {
  return Promise.reject(error);
}

/**
 * 统一的接口的返回数据格式
 * {
 *   data: any
 *   code: number,
 *   message: string,
 * }
 * @param response
 */
function responseSuccess(response) {
  // 请求结束，关闭进度条
  NProgress.done();
  return response.data;
}

function responseFail(error) {
  // 请求失败，也应关闭进度条
  NProgress.done();
  return Promise.reject(error);
}

// 添加拦截器
axios.interceptors.request.use(requestSuccess, requestFail);
axios.interceptors.response.use(responseSuccess, responseFail);

/**
 *
 * @param config
 */
export const request = (config: AxiosRequestConfig) => {
  return axios(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      let code =
        error.response && error.response.status ? error.response.status : 502;
      // token过期, 跳转到登录页
      if (code === 401) {
        notification.error({
          message: '未登录或登录已过期，请重新登录。'
        });
        window.g_app._store.dispatch({
          type: 'login/logout'
        });
        return false;
        // router.push('/user/login');
      }

      // 开发调试
      console.log(
        `【${config.method} ${config.url}】请求失败，响应数据：%o`,
        error.response
      );

      return { code: code, message: '' };
    });
};

export const GET = (
  url: string,
  params?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      params: params,
      method: 'get'
    })
  );
};

export const POST = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'post'
    })
  );
};

export const PUT = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'put'
    })
  );
};

export const PATCH = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'patch'
    })
  );
};

export const DELETE = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
) => {
  return request(
    Object.assign({}, config, {
      url: url,
      data: data,
      method: 'delete'
    })
  );
};
