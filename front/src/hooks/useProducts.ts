import { useCallback, useEffect, useRef, useState } from "react";
import type { Product, ProductFilters, ProductInput } from "@/types/product";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedResult<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  created_at: string;
}

function mapProduct(product: BackendProduct): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: Number(product.quantity),
    createdAt: product.created_at,
  };
}

function buildQuery(filters: ProductFilters, page: number): string {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.minPrice != null) params.set("min_price", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("max_price", String(filters.maxPrice));
  if (filters.minQuantity != null) params.set("min_quantity", String(filters.minQuantity));
  if (filters.maxQuantity != null) params.set("max_quantity", String(filters.maxQuantity));

  params.set("page", String(page));

  return params.toString();
}

export function useProducts() {
  const requestIdRef = useRef(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<ProductFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadProducts = useCallback(async (activeFilters: ProductFilters, page: number, signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const query = buildQuery(activeFilters, page);
      const response = await fetch(`${API_BASE_URL}/products?${query}`, { signal });

      if (!response.ok) {
        throw new Error("Falha ao carregar produtos.");
      }

      const json: ApiResponse<PaginatedResult<BackendProduct>> = await response.json();
      const result = json.data;

      if (requestId !== requestIdRef.current) return;

      setProducts(result.data.map(mapProduct));
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      if (requestId !== requestIdRef.current) return;

      setError("Não foi possível carregar produtos da API.");
      setProducts([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    void loadProducts(debouncedFilters, currentPage, controller.signal);

    return () => controller.abort();
  }, [debouncedFilters, currentPage, loadProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const create = useCallback(async (input: ProductInput) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Falha ao criar produto.");
    }

    await loadProducts(debouncedFilters, currentPage);
  }, [currentPage, debouncedFilters, loadProducts]);

  const update = useCallback(async (id: number, input: ProductInput) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Falha ao atualizar produto.");
    }

    await loadProducts(debouncedFilters, currentPage);
  }, [currentPage, debouncedFilters, loadProducts]);

  const remove = useCallback(async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Falha ao remover produto.");
    }

    await loadProducts(debouncedFilters, currentPage);
  }, [currentPage, debouncedFilters, loadProducts]);

  return {
    products,
    filtered: products,
    filters,
    setFilters,
    loading,
    error,
    create,
    update,
    remove,
    currentPage,
    lastPage,
    total,
    canGoPrev: currentPage > 1,
    canGoNext: currentPage < lastPage,
    goPrev: () => setCurrentPage((page) => Math.max(1, page - 1)),
    goNext: () => setCurrentPage((page) => Math.min(lastPage, page + 1)),
    reload: () => loadProducts(debouncedFilters, currentPage),
  };
}
