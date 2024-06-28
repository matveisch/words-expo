import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialDate = new Date();
initialDate.setHours(9, 0, 0, 0);

class PushStore {
  push = true;
  time = initialDate.toString();

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

  setTime(time: string) {
    this.time = time;
  }
}

export const pushStore = new PushStore();
