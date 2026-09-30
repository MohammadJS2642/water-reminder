import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageDataSource } from './IStorageDataSource';

/**
 * Concrete storage data source using React Native's AsyncStorage.
 */
export class AsyncStorageDataSource implements IStorageDataSource {
  public async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`[AsyncStorageDataSource] Error reading key "${key}":`, error);
      return null;
    }
  }

  public async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[AsyncStorageDataSource] Error writing key "${key}":`, error);
      throw error;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[AsyncStorageDataSource] Error removing key "${key}":`, error);
      throw error;
    }
  }

  public async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[AsyncStorageDataSource] Error clearing storage:', error);
      throw error;
    }
  }
}
