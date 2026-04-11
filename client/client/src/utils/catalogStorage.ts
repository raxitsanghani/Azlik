import type { Product } from '../data/products';

const DB_NAME = 'azlik_catalog_v1';
const DB_VERSION = 1;
const STORE = 'kv';
const PRODUCTS_KEY = 'azlik_products_json';
const LEGACY_LS_KEY = 'azlik_products';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** URLs that survive refresh (no blob:). */
function isPersistentImageUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  const u = url.trim();
  if (u.startsWith('blob:')) return false;
  return (
    u.startsWith('data:') ||
    u.startsWith('http://') ||
    u.startsWith('https://') ||
    u.startsWith('/')
  );
}

export function sanitizeProductImages<T extends { image?: string; images?: string[] }>(product: T): T {
  const imagesIn = Array.isArray(product.images) ? product.images : [];
  const persistentImages = imagesIn.filter(isPersistentImageUrl);
  let image = typeof product.image === 'string' ? product.image : '';
  if (!isPersistentImageUrl(image)) {
    image = persistentImages[0] || '';
  }
  const images =
    persistentImages.length > 0
      ? persistentImages
      : image
        ? [image]
        : [];
  return { ...product, image, images };
}

export async function loadProductsRawJson(): Promise<string | null> {
  let raw = await idbGet(PRODUCTS_KEY);
  if (raw) return raw;

  const legacy = localStorage.getItem(LEGACY_LS_KEY);
  if (legacy) {
    try {
      JSON.parse(legacy);
      await idbSet(PRODUCTS_KEY, legacy);
    } catch {
      localStorage.removeItem(LEGACY_LS_KEY);
      return null;
    }
    return legacy;
  }
  return null;
}

export async function saveProductsRawJson(json: string): Promise<void> {
  await idbSet(PRODUCTS_KEY, json);
  try {
    localStorage.setItem(LEGACY_LS_KEY, json);
  } catch {
    try {
      localStorage.setItem('azlik_products_idb_only', '1');
    } catch {
      /* ignore */
    }
  }
}

export async function loadAndSanitizeProducts(fallbackJson: string): Promise<Product[]> {
  let raw = await loadProductsRawJson();
  if (!raw) {
    await saveProductsRawJson(fallbackJson);
    raw = fallbackJson;
  }
  let parsed: Product[];
  try {
    parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) throw new Error('not array');
  } catch {
    parsed = JSON.parse(fallbackJson) as Product[];
    await saveProductsRawJson(fallbackJson);
  }
  return parsed.map((p) => sanitizeProductImages(p)) as Product[];
}

export async function saveProductsList(products: Product[]): Promise<void> {
  const sanitized = products.map((p) => sanitizeProductImages(p));
  const json = JSON.stringify(sanitized);
  await saveProductsRawJson(json);
}
