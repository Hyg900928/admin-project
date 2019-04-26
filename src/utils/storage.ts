const Storage = {
  getItem(key: any): string {
    let value;
    try {
      value = sessionStorage.getItem(key);
    } catch (ex) {
      console.log('sessionStorage.getItem报错, ', ex.message);
    } finally {
      return value;
    }
  },
  setItem(key: any, val: any): void {
    try {
      sessionStorage.setItem(key, val);
    } catch (ex) {
      console.log('sessionStorage.setItem报错, ', ex.message);
    }
  },
  removeItem(key: any): void {
    sessionStorage.removeItem(key);
  },
  // Reference Data Type
  getItemJson(key: any): string {
    return this.getItem(key) != null ? JSON.parse(this.getItem(key)) : {};
  },
  setItemJson(key: any, val: any): void {
    this.setItem(key, JSON.stringify(val));
  }
};

export default Storage;
