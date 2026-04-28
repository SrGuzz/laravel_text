<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductService
{
    private const CACHE_TTL = 300;

    private const CACHE_PREFIX = 'products:list:';

    public function list(array $filters = []): array
    {
        $cacheKey = $this->makeListCacheKey($filters);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($filters) {

            $query = Product::query();

            if (! empty($filters['name'])) {
                $query->where('name', 'like', '%'.$filters['name'].'%');
            }

            if (! empty($filters['min_price'])) {
                $query->where('price', '>=', $filters['min_price']);
            }

            if (! empty($filters['max_price'])) {
                $query->where('price', '<=', $filters['max_price']);
            }

            if (! empty($filters['min_quantity'])) {
                $query->where('quantity', '>=', $filters['min_quantity']);
            }

            if (! empty($filters['max_quantity'])) {
                $query->where('quantity', '<=', $filters['max_quantity']);
            }

            return $query
                ->orderBy('name')
                ->paginate(10)
                ->toArray();
        });
    }

    public function find(int $id): array
    {
        return Cache::remember("products:show:{$id}", self::CACHE_TTL, function () use ($id) {
            return Product::findOrFail($id)->toArray();
        });
    }

    public function create(array $product): Product
    {
        $data = Product::create($product);

        $this->clearProductCache();

        return $data;
    }

    public function update(array $data, int $id): Product
    {
        $product = Product::findOrFail($id);
        $product->update($data);

        $this->clearProductCache();

        return $product;
    }

    public function delete(int $id)
    {
        $deleted = Product::findOrFail($id)->delete();

        $this->clearProductCache();

        return $deleted;
    }

    private function makeListCacheKey(array $filters): string
    {
        ksort($filters);

        $page = request()->query('page', 1);

        return self::CACHE_PREFIX.md5(json_encode($filters).'|page='.$page);
    }

    private function clearProductCache(): void
    {
        Cache::flush();
    }
}
