import { parse, stringify } from 'qs';

export function getPageQuery(data?: string) {
  let url = data || window.location.href.split('?')[1];
  return parse(url);
}
