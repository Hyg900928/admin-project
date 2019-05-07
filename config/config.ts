import { resolve } from 'path';
import pageRoutes from './router.config';
import themeConfig from './theme.config';
const { APP_TYPE, API_ENV } = process.env;
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        immer: true
      },
      locale: {
        enable: true,
        default: 'zh-CN',
        baseNavigator: true
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3
      },
      dll: {
        exclude: [],
        include: ['dva', 'dva/router', 'dva/saga']
      }
    }
  ]
];

export default {
  plugins,
  targets: {
    ie: 11
  },
  define: {
    APP_TYPE: 'Gavin',
    'process.env': {
      API_ENV: process.env.API_ENV,
      NODE_ENV: process.env.NODE_ENV
    }
  },
  treeShaking: true,
  // 路由配置
  routes: pageRoutes,
  theme: themeConfig,
  ignoreMomentLocale: true,
  disableRedirectHoist: true,
  urlLoaderExcludes: [resolve(__dirname, '../src/icons/svg')],
  chainWebpack(config) {
    config.module
      .rule('svg')
      .test(/\.svg$/i)
      .include.add(resolve(__dirname, '../src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader(require.resolve('svg-sprite-loader'));
  }
};
