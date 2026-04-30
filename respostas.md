# 4. Perguntas Teóricas

## 4.1 API Resources no Laravel

**Qual é o objetivo de utilizar API Resources?**  
O objetivo dos API Resources é padronizar e transformar os dados retornados pela API, controlando exatamente quais campos serão expostos e em qual formato. Eles funcionam como uma camada de apresentação da resposta JSON.

**Em quais situações eles são úteis no desenvolvimento de APIs?**  
Eles são úteis quando:
- é necessário manter um padrão de resposta entre endpoints;
- você quer ocultar campos sensíveis do modelo;
- precisa incluir campos calculados ou formatados;
- deseja versionar ou evoluir a API sem acoplar o formato de resposta diretamente ao model;
- trabalha com coleções, relacionamentos e paginação com estrutura consistente.

## 4.2 Organização de Validação em Laravel

Utilizar classes específicas de validação (como **Form Requests**) em vez de validar no controller traz vantagens importantes:

- **Organização do código:**
  - o controller fica mais limpo e focado na regra de negócio;
  - as regras de validação ficam centralizadas em arquivos próprios.

- **Manutenção:**
  - alterações de regras ficam concentradas em um único lugar;
  - reduz duplicação e facilita entender o que é exigido por cada entrada da API.

- **Reutilização:**
  - a mesma classe de validação pode ser reaproveitada em diferentes actions;
  - permite padronizar mensagens de erro e regras comuns entre módulos.

Além disso, os Form Requests permitem separar autorização (`authorize`) da validação (`rules`), melhorando a estrutura da aplicação.

## 4.3 Testes Automatizados no Laravel

### 1. Para que servem testes automatizados em uma aplicação Laravel?

Testes automatizados servem para garantir que funcionalidades continuem corretas ao longo do tempo. Eles ajudam a:
- prevenir regressões;
- validar regras de negócio;
- dar segurança para refatorar código;
- documentar comportamento esperado da aplicação.

### 2. Como testar um endpoint da API com PHPUnit no Laravel?

**Onde o teste seria criado**  
Normalmente em `tests/Feature`, pois teste de endpoint é teste de integração/comportamento HTTP.

Exemplo:

```bash
php artisan make:test ProductTest
```

Isso cria um arquivo como `tests/Feature/ProductTest.php`.

**Como o endpoint seria testado**  
No teste, usamos métodos HTTP fornecidos pelo Laravel (`getJson`, `postJson`, `putJson`, `deleteJson`) e fazemos asserções no status e no JSON retornado.

Exemplo simplificado:

```php
public function test_list_products_return_status_200(): void
{
    $response = $this->getJson('/api/products');

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'data'
             ]);
}
```

Também é comum preparar dados com factories, autenticar usuário (`actingAs`) e validar formato/valores da resposta.

**Como executar os testes no projeto**

Você pode executar:

```bash
php artisan test
```

Ou diretamente com PHPUnit:

```bash
./vendor/bin/phpunit
```

Para rodar apenas uma classe específica:

```bash
php artisan test --filter=ProductTest
```
