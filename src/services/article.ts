import { GET, POST, PATCH, DELETE } from '@/utils/request';

export async function fetchList() {
  return GET('/api/v1/articles');
}

export async function createArticle(data: any) {
  return POST('/api/v1/article', data);
}

export async function editArticle(id: string, data: any) {
  return PATCH(`/api/v1/article/${id}`, data);
}

export async function deleteArticle(id: string) {
  return DELETE(`/api/v1/article/${id}`);
}

export async function getArticleInfo(id: string) {
  return GET(`/api/v1/article/${id}`);
}
