// use localStorage to store the authority info, which might be sent from server in actual project.
import Storage from '@/utils/storage';

export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  // console.log(typeof str)
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('app-authority') : str;
  // authorityString could be admin, "admin", ["admin"]

  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  // console.log(typeof authority);
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['user'];
}

// 设置用户权限(用在登录成功时)
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return Storage.setItem('app-authority', JSON.stringify(proAuthority));
}
