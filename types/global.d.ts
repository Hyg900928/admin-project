declare module '*.css';
declare module '*.less';
declare module '*.svg';
declare module '*.png';

interface Window {
  g_app: {
    _store: {
      dispatch: Function;
      getState: Function;
    };
  };
}
