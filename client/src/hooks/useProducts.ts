import { useState, useEffect } from 'react';
import { products as initialProducts, Product } from '../data/products';
import { loadAndSanitizeProducts, saveProductsRawJson } from '../utils/catalogStorage';

const normalizeCategory = (value: string) => value.trim().toLowerCase();

const normalizeProducts = (items: Product[]): Product[] => {
  return items.map((item) => ({
    ...item,
    category: normalizeCategory(String(item.category || 'accessories')),
    featured: Boolean(item.featured),
    status: item.status || 'Active',
  }));
};

const seedJson = () => JSON.stringify(initialProducts);

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await loadAndSanitizeProducts(seedJson());
        setProducts(normalizeProducts(list));
      } catch {
        const fallback = normalizeProducts(initialProducts);
        setProducts(fallback);
        try {
          await saveProductsRawJson(JSON.stringify(fallback));
        } catch {
          /* storage full or private mode */
        }
      }
    };

    void loadProducts();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== 'azlik_products') return;
      void (async () => {
        try {
          if (!e.newValue) {
            const fb = normalizeProducts(initialProducts);
            setProducts(fb);
            await saveProductsRawJson(JSON.stringify(fb));
            return;
          }
          await saveProductsRawJson(e.newValue);
          const list = await loadAndSanitizeProducts(seedJson());
          setProducts(normalizeProducts(list));
        } catch {
          const fb = normalizeProducts(initialProducts);
          setProducts(fb);
        }
      })();
    };

    const handleCustomChange = () => void loadProducts();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('products_updated', handleCustomChange);
    const poller = window.setInterval(() => void loadProducts(), 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('products_updated', handleCustomChange);
      window.clearInterval(poller);
    };
  }, []);

  return products;
};
