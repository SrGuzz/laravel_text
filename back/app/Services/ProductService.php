<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
    public function list(array $filters = []) : LengthAwarePaginator
    {
        $query = Product::query();

        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (!empty($filters['min_quantity'])) {
            $query->where('quantity', '>=', $filters['min_quantity']);
        }

        if (!empty($filters['max_quantity'])) {
            $query->where('quantity', '<=', $filters['max_quantity']);
        }

        return $query->paginate(10);
    }

    public function find(int $id) : Product
    {
        return Product::findOrFail($id);
    }

    public function create(array $product) : Product
    {
        return Product::create($product);
    }
    
    public function update(array $data, int $id) : Product
    {
        $product = Product::findOrFail($id);
        $product->update($data);

        return $product;
    }

    public function delete(int $id)
    {
        return Product::findOrFail($id)->delete();
    }
}