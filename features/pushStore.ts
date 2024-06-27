import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PushStore {
  push = true;
  time = 90;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'PushStore',
      storage: AsyncStorage,
      properties: ['push', 'time'],
    });
  }

  setPush(hasPush: boolean) {
    this.push = hasPush;
  }

  setTime(time: number) {
    this.time = time;
  }
}

export const pushStore = new PushStore();
