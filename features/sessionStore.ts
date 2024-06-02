import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';

class SessionStore {
  session: Session | null = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'SessionStore',
      storage: AsyncStorage,
      properties: ['session'],
    });
  }

  setSession(session: Session | null) {
    this.session = session;
  }
}

export const sessionStore = new SessionStore();
