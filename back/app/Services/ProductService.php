<?php

namespace App\Services;

use App\Models\Product;

class ProductService
{
    public function list()
    {
        return Product::paginate(10);
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