function getCurrentUser(req, res) {
  res.json({
    status: 200,
    data: {
      name: 'Tom',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      unreadCount: 11,
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        { key: '0', label: '很有想法的' },
        { key: '1', label: '专注设计' },
        { key: '2', label: '辣~' },
        { key: '3', label: '大长腿' },
        { key: '4', label: '川妹子' },
        { key: '5', label: '海纳百川' },
      ],
    },
    message: 'success'
  });
  res.status(200).end();
}

// 用户登录
function login(req, res) {
  const { username, password } = req.body;
  if (password === '123456' && username === 'admin') {
    res.send({
      status: 'ok',
      data: {
        currentAuthority: 'admin',
      },
      message: 'success'
    });
    return;
  }
  if (password === '123456' && username === 'user') {
    res.send({
      status: 'ok',
      data: {
        currentAuthority: 'user',
      },
      message: 'success'
    });
    return;
  }
  res.send({
    status: 'error',
    data: {
      currentAuthority: 'guest',
    },
    message: '用户不存在'
  });
}

function logout(req, res) {
  res.json({
    status: 200,
    message: 'success'
  });
  res.status(200).end();
}

export default {
  'GET /user/current': getCurrentUser,
  'POST /user/login': login,
  'GET /user/logout': logout
};
