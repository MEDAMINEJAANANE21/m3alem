import { Observable } from '../utils/observable.util.js';
import { readJson, remove, writeJson } from '../utils/storage.util.js';

const STORAGE_KEY = 'm3alem.session';

class Session extends Observable {
  #state = readJson(STORAGE_KEY);

  get token() {
    return this.#state?.token ?? null;
  }

  get user() {
    return this.#state?.user ?? null;
  }

  isLoggedIn() {
    return Boolean(this.token);
  }

  hasRole(role) {
    return this.user?.role === role;
  }

  save({ token, user }) {
    this.#state = { token, user };
    writeJson(STORAGE_KEY, this.#state);
    this.notify(this.user);
  }

  clear() {
    this.#state = null;
    remove(STORAGE_KEY);
    this.notify(null);
  }
}

// Pattern: Singleton — one session shared by every module of the page.
export const session = new Session();
