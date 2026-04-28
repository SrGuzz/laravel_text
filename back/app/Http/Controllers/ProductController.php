<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index() : JsonResponse
    {
        return response()->json($this->productService->list());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request) : JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return response()->json([
            'message' => 'Produto criado com sucesso.',
            'data' => $product
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $product = $this->productService->find($id);

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->update($request->validated(), $id);

        return response()->json([
            'message' => 'Produto atualizado com sucesso.',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->productService->delete($id);

        return response()->json([
            'message' => 'Produto removido com sucesso.'
        ]);
    }
}
