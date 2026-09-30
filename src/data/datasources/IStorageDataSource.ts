/**
 * Key-Value Storage Interface
 *
 * Abstraction layer over persistent storage (AsyncStorage, SQLite, SecureStore, or In-Memory).
 */
export interface IStorageDataSource {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
