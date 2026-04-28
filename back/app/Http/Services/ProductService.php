<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductService
{
    public function list()
    {
        return Product::all()->paginate(10);
    }

    public function find(int $id) : Product
    {
        return Product::findOrFail($id);
    }

    public function create(array $product) : Product
    {
        return Product::create($product);
    }
    
    public function update(array $product, int $id) : Product
    {
        return Product::findOrFail($id)->update($product);
    }

    public function delete(int $id)
    {
        return Product::findOrFail($id)->delete();
    }
}