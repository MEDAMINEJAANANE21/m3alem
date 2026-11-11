import { Observable } from '../utils/observable.util.js';
import { readJson, writeJson } from '../utils/storage.util.js';

const STORAGE_KEY = 'm3alem.cart';

// Totals shown here are estimates for the user; the server recomputes the real price.
export class Cart extends Observable {
  #items = readJson(STORAGE_KEY) ?? [];

  get items() {
    return [...this.#items];
  }

  get total() {
    return this.#items.reduce((sum, item) => sum + item.total, 0);
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  add(service, quantity = 1) {
    const isQuantityBased = service.pricingUnit !== 'fixed';
    const finalQuantity = isQuantityBased ? quantity : 1;

    this.#items.push({
      id: crypto.randomUUID(),
      serviceId: service._id,
      title: service.title,
      pricingUnit: service.pricingUnit,
      quantity: finalQuantity,
      total: isQuantityBased ? service.price * finalQuantity : service.price,
    });
    this.#commit();
  }

  remove(itemId) {
    this.#items = this.#items.filter((item) => item.id !== itemId);
    this.#commit();
  }

  removeMany(itemIds) {
    const ids = new Set(itemIds);
    this.#items = this.#items.filter((item) => !ids.has(item.id));
    this.#commit();
  }

  #commit() {
    writeJson(STORAGE_KEY, this.#items);
    this.notify(this.items);
  }
}
