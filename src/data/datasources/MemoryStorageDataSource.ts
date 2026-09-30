import { IStorageDataSource } from './IStorageDataSource';

/**
 * In-Memory Key-Value Storage
 *
 * Perfect for automated testing (Unit, Integration, BDD) and preview environments.
 */
export class MemoryStorageDataSource implements IStorageDataSource {
  private store: Map<string, string> = new Map();

  public async getItem(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  public async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  public async clear(): Promise<void> {
    this.store.clear();
  }
}
