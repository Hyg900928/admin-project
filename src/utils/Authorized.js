import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from './authority';

// RenderAuthorized 接收当前权限作为参数，返回一个权限对象
// console.log(getAuthority())
let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
