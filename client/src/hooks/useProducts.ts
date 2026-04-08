import { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { productService } from '../api/apiService';

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAll({ category: category === 'all' ? undefined : category });
        // Map backend _id to id for frontend compatibility if needed, 
        // but current frontend uses .id. Our model has .id as well or we can use ._id
        const mappedProducts = response.data.map((p: any) => ({
          ...p,
          id: p._id || p.id, // Support both MongoDB _id and existing id
        }));
        setProducts(mappedProducts);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
        // Fallback to empty array or last known good state
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return dynamicProductsSync(products, loading, error);
};

// Helper to maintain existing hook signature or provide extra states
function dynamicProductsSync(products: Product[], loading: boolean, error: string | null) {
  // For now, returning products directly to avoid breaking existing components 
  // that don't expect { products, loading, error }
  return products;
}
