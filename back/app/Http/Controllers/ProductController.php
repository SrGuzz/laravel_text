<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductFilterRequest;
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
    public function index(ProductFilterRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Produtos listados com sucesso.',
            'data' => $this->productService->list($request->validated()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Produto criado com sucesso.',
            'data' => $this->productService->create($request->validated()),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Produto encontrado com sucesso.',
            'data' => $this->productService->find($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Produto atualizado com sucesso.',
            'data' => $this->productService->update($request->validated(), $id),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->productService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Produto removido com sucesso.',
            'data' => null,
        ]);
    }
}
