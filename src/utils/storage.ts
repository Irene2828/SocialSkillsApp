import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

export const safeStorage = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
      return defaultValue;
    } catch (e) {
      logger.error(`Storage read failed for ${key}, returning default`, e);
      return defaultValue;
    }
  },

  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      logger.error(`Storage write failed for ${key}`, e);
      return false;
    }
  },

  async multiSet(keyValuePairs: [string, any][]): Promise<boolean> {
    try {
      const stringifiedPairs: [string, string][] = keyValuePairs.map(([k, v]) => [k, JSON.stringify(v)]);
      await AsyncStorage.multiSet(stringifiedPairs);
      return true;
    } catch (e) {
      logger.error(`Storage multiSet failed`, e);
      return false;
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      logger.error(`Storage remove failed for ${key}`, e);
      return false;
    }
  }
};
