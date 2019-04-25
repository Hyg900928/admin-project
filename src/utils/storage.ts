const Storage = {
  getItem(key: any) {
    let value;
    try {
      value = sessionStorage.getItem(key);
    } catch (ex) {
      console.log('sessionStorage.getItem报错, ', ex.message);
    } finally {
      return value;
    }
  },
  setItem(key: any, val: any) {
    try {
      sessionStorage.setItem(key, val);
    } catch (ex) {
      console.log('sessionStorage.setItem报错, ', ex.message);
    }
  },
  removeItem(key: any) {
    sessionStorage.removeItem(key);
  },
  // Reference Data Type
  getItemJson(key: any) {
    return this.getItem(key) != null ? JSON.parse(this.getItem(key)) : {};
  },
  setItemJson(key: any, val: any) {
    this.setItem(key, JSON.stringify(val));
  }
};

export default Storage;
