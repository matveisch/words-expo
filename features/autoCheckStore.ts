import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AutoCheckStore {
  autoCheck = true;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'AutoCheckStore',
      storage: AsyncStorage,
      properties: ['autoCheck'],
    });
  }

  setAutoCheck(isAuto: boolean) {
    this.autoCheck = isAuto;
  }
}

export const autoCheckStore = new AutoCheckStore();
