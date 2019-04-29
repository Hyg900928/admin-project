import Storage from '@/utils/storage';

/**
 * 检查 `value` 是否为承诺（Promise）
 *
 * @since 0.1.0
 * @param {*} value The value to check
 * @return {boolean} Return `true` is a Promise, else `false`
 * @example
 *
 * isPromise(new Promise((resolve, reject) => { // code }))
 * // => true
 *
 * isPromise(3)
 * // => false
 *
 * isPromise('tom')
 * // => false
 *
 */
export function isPromise(value: any): value is Promise<any> {
  return !!value && typeof value.then === 'function';
}

/**
 * 判断值是否已定义
 * @param value
 */
export function isDefined(value: any): boolean {
  return value !== null && value !== undefined;
}

/**
 *
 * 获取用户ID
 * @export
 */
export function getUserId(): string {
  return Storage.getItem('userId');
}
/**
 * 获取用户名
 * @export
 * @returns {string}
 */
export function getAccount(): string {
  return Storage.getItem('userAccount');
}
