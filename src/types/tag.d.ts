import { Data } from 'unist';

// export interface TagType {
//   title: string;
//   value: string;
//   _id: string;
//   createAt: Date
// }

export namespace TagList {
  export type AsObject = {
    title: string;
    value: string;
    _id: string;
    createAt: Date;
  };
}
