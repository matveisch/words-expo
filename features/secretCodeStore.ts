import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SecretCodeStore {
  secretCode = '';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'SecretCodeStore',
      storage: AsyncStorage,
      properties: ['secretCode'],
    });
  }

  setSecretCode(secretCode: string) {
    this.secretCode = secretCode;
  }
}

export const secretCodeStore = new SecretCodeStore();
