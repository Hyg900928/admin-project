import { EditorState } from 'braft-editor';
export namespace ArticleList {
  export type AsObject = {
    author?: Object;
    content?: string | any;
    tags?: any[];
    _id?: string;
    title?: string;
    html?: string;
    toc?: any[];
    createAt?: Date;
  };
  export interface CreateArticleState {
    articleData: AsObject;
    tagsList: any[];
    type: string;
    editorContent: EditorState;
  }
}
