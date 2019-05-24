// axios 相关配置
export const AXIOS_DEFAULT_CONFIG = {
  timeout: 20000,
  withCredentials: false, // 配置是否带cookie请求, axios 默认是发送请求的时候不带上cookie的, 需要设置widthCredentials: true, 如果设置为true , 后端的 Access-Control-Allow-Origin 不可以为"*", 需要配置指定的地址. 设置为false ,就可以了.
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:9001'
      : 'https://api.heyungao.com'
};
// 项目相关配置
export const PROJECT_DEFAULT_CONFIG = {
  companyName: '炫踪网络股份有限公司 '
};

// 项目默认设置
export const SETTING_DEFAULT_CONFIG = {
  navTheme: 'dark',
  layout: 'sideMenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSideBar: false
};
