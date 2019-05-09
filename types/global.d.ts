declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module 'braft-utils';
declare module 'braft-finder';

interface Window {
  g_app: {
    _store: {
      dispatch: Function;
      getState: Function;
    };
  };
}
