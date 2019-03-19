// use localStorage to store the authority info, which might be sent from server in actual project.
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
  console.log(typeof authority);
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['user'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('app-authority', JSON.stringify(proAuthority));
}
