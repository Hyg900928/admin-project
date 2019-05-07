import { GET, POST } from '@/utils/request';

export async function fetchList() {
  return GET('/api/v1/articles');
}

export async function createArticle(data: any) {
  return POST('/api/v1/article', data);
}

export async function getArticleInfo(id: string) {
  return GET(`/api/v1/article/${id}`);
}
