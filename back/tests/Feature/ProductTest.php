<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_products(): void
    {
        Product::factory()->count(3)->create();

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Produtos listados com sucesso.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'current_page',
                    'data' => [
                        '*' => [
                            'id',
                            'name',
                            'quantity',
                            'price',
                            'description',
                            'created_at',
                            'updated_at',
                        ]
                    ],
                    'total',
                    'per_page',
                    'last_page',
                ]
            ]);
    }

    public function test_create_product(): void
    {
        $payload = [
            'name' => 'Mouse Gamer',
            'quantity' => 10,
            'price' => 150.90,
            'description' => 'Mouse RGB de alta precisão',
        ];

        $response = $this->postJson('/api/products', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Produto criado com sucesso.',
                'data' => [
                    'name' => 'Mouse Gamer',
                    'quantity' => 10,
                    'description' => 'Mouse RGB de alta precisão',
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Mouse Gamer',
            'quantity' => 10,
            'description' => 'Mouse RGB de alta precisão',
        ]);
    }

    public function test_search_product_by_id(): void
    {
        $product = Product::factory()->create([
            'name' => 'Teclado Mecânico',
        ]);

        $response = $this->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Produto encontrado com sucesso.',
                'data' => [
                    'id' => $product->id,
                    'name' => 'Teclado Mecânico',
                ],
            ]);
    }

    public function test_update_product(): void
    {
        $product = Product::factory()->create();

        $payload = [
            'name' => 'Produto Atualizado',
            'quantity' => 20,
            'price' => 250.00,
            'description' => 'Descrição atualizada',
        ];

        $response = $this->putJson("/api/products/{$product->id}", $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Produto atualizado com sucesso.',
                'data' => [
                    'id' => $product->id,
                    'name' => 'Produto Atualizado',
                    'quantity' => 20,
                    'description' => 'Descrição atualizada',
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Produto Atualizado',
            'quantity' => 20,
        ]);
    }

    public function test_delete_product(): void
    {
        $product = Product::factory()->create();

        $response = $this->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Produto removido com sucesso.',
                'data' => null,
            ]);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_return_error_to_search_product_does_not_existent(): void
    {
        $response = $this->getJson('/api/products/999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Recurso não encontrado.',
                'data' => null,
            ]);
    }

    public function test_validate_required_fields_when_creating_product(): void
    {
        $response = $this->postJson('/api/products', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'quantity',
                'price',
            ]);
    }

    public function test_filter_products_by_name_and_price(): void
    {
        Product::factory()->create([
            'name' => 'Mouse Gamer',
            'price' => 150.00,
        ]);

        Product::factory()->create([
            'name' => 'Teclado Mecânico',
            'price' => 300.00,
        ]);

        $response = $this->getJson('/api/products?name=mouse&min_price=50&max_price=200');

        $response->assertStatus(200)
            ->assertJsonFragment([
                'name' => 'Mouse Gamer',
            ])
            ->assertJsonMissing([
                'name' => 'Teclado Mecânico',
            ]);
    }
}