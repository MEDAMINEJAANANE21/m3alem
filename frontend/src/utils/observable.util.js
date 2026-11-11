// Pattern: Observer — lets the header, cart widget, etc. react when shared state changes.
export class Observable {
  #listeners = new Set();

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  notify(value) {
    this.#listeners.forEach((listener) => listener(value));
  }
}
