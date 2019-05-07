export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        component: './404'
      }
    ]
  },
  // app
  // {
  //   path: '/',
  //   component:'../layouts/BlackLayout',
  //   Routes: ['src/pages/Authorized']
  //   routes: []
  // },
  {
    path: '/',
    component: '../layouts/AuthBasicLayout',
    Routes: ['src/pages/Authorized'], // 权限路由
    // authority: ['admin', 'user'], // 准入权限
    routes: [
      { path: '/', redirect: '/system/userInfo', authority: ['admin', 'user'] },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        // hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403'
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404'
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500'
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException'
          }
        ]
      },
      // 系统管理模块
      {
        name: 'system',
        icon: 'desktop',
        path: '/system',
        routes: [
          {
            path: '/system/userInfo',
            name: 'userInfo',
            component: './System/userInfo/userInfo'
          }
        ]
      },
      // 权限管理模块
      {
        name: 'permission',
        icon: 'desktop',
        path: '/permission',
        component: '../layouts/BlankLayout',
        routes: [
          {
            path: '/permission/serach',
            name: 'search',
            component: './Permission/search'
          },
          {
            path: '/permission/allocation',
            name: 'allocation',
            component: './Permission/allocation'
          },
          {
            path: '/permission/log',
            name: 'log',
            component: './Permission/log'
          }
        ]
      },
      // 用户管理
      {
        name: 'userManagement',
        icon: 'user',
        path: '/userManagement',
        routes: [
          {
            path: '/userManagement/userList',
            name: 'userList',
            component: './UserManagement/UserList'
          },
          {
            path: '/userManagement/addUser',
            name: 'addUser',
            component: './UserManagement/AddUser'
          }
        ]
      },
      // 文章管理
      {
        name: 'article',
        icon: 'book',
        path: '/article',
        routes: [
          {
            path: '/article/list',
            name: 'articleList',
            component: './Article/ArticleList'
          },
          {
            path: '/article/create',
            name: 'articleCreate',
            hideInMenu: true,
            component: './Article/CreateArticle'
          }
        ]
      },
      // 标签
      {
        name: 'tags',
        icon: 'book',
        path: '/tags',
        routes: [
          {
            path: '/tags/tagList',
            name: 'tagList',
            component: './Tags/TagList'
          }
        ]
      },
      {
        component: './404'
      }
    ]
  }
];
