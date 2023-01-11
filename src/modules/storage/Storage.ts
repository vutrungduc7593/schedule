export interface IStorageItem {
  load(data: any): void;
}

export class Storage {
  public contains(key: string): boolean {
    return localStorage.getItem(key) != null;
  }

  public get<T extends IStorageItem>(key: string, type: new () => T): T {
    const result = new type();

    const data = localStorage.getItem(key);

    if (data == null) return result;

    result.load(JSON.parse(data));

    return result;
  }

  public set<T extends IStorageItem>(key: string, value: T): boolean {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  }
}
