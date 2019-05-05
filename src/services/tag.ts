import { GET, POST } from '@/utils/request';

export async function createTag(data: any) {
  return POST('/api/v1/tag', data);
}

export async function getTagList() {
  return GET('/api/v1/tag');
}
