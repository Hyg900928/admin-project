const envConfig = {
  // 测试环境
  test: {
    API_SERVER: 'your-api-path'
  },

  // 开发环境
  development: {
    API_SERVER: 'your-api-path'
  },

  // 本地
  local: {
    API_SERVER: 'your-api-path'
  }
};

console.log(process.env.API_ENV);

export default envConfig;
