import { GET, POST } from '@/utils/request';

export function fetchCurrentUser() {
  return GET('api/v1/user');
}

export function fetchLogin(data) {
  return POST('api/v1/user/login', data);
}

// export function fetchLogout() {
//   return GET('/user/logout');
// }
