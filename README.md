# laravel_text

API desenvolvida em Laravel para gerenciamento de produtos (CRUD), com listagem paginada, filtros e cache.

## Tecnologias

- PHP 8.3+
- Laravel 13
- MySQL
- Node.js 20+ e npm

## Estrutura do projeto

- `back/`: aplicação Laravel (backend da API)
- `front/`: aplicação React + Vite (frontend)
- `collection_insomnia.json`: coleção de requisições para teste da API no Insomnia
- `respostas.md`: respostas teóricas solicitadas no desafio

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd laravel_text
```

### 2. Instalar dependências do backend

Entre na pasta do backend e instale as dependências PHP e JS:

```bash
cd back
composer install
```

### 3. Configurar ambiente

Copie o arquivo de exemplo e gere a chave da aplicação:

```bash
cp .env.example .env
php artisan key:generate
```

No arquivo `.env`, configure principalmente o banco de dados:

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=back
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Executar as migrations

Com o banco criado e configurado, rode:

```bash
php artisan migrate
```

Isso criará as tabelas padrão do Laravel e a tabela de produtos.

### 5. Inicializar o backend

Em um terminal, inicie o servidor da API:

```bash
php artisan serve
```

### 6. Rodar o frontend

Em outro terminal, entre na pasta `front`, instale as dependências e inicie o servidor:

```bash
cd front
npm install
npm run dev
```

A API ficará disponível em:

- `http://127.0.0.1:8000`
- Endpoints de produto: `http://127.0.0.1:8000/api/products`

O frontend ficará disponível em:

- `http://127.0.0.1:8080`

Observação:

- O frontend já está configurado para usar proxy em `/api`, então ele se comunica com o backend Laravel em `http://127.0.0.1:8000`.

## Rotas principais da API

- `GET /api/products`: lista produtos (com paginação e filtros)
- `GET /api/products/{id}`: busca produto por ID
- `POST /api/products`: cria produto
- `PUT /api/products/{id}`: atualiza produto
- `DELETE /api/products/{id}`: remove produto

## Filtros disponíveis na listagem

Os seguintes parâmetros podem ser enviados em `GET /api/products`:

- `name`
- `min_price`
- `max_price`
- `min_quantity`
- `max_quantity`
- `page`

## Testes automatizados

O projeto possui testes com PHPUnit/Laravel para validar comportamento da aplicação e dos endpoints.

### Onde ficam os testes

- `back/tests/Unit`: testes unitários
- `back/tests/Feature`: testes de integração/HTTP (endpoints da API)

### Como executar os testes

Na pasta `back`, execute:

```bash
php artisan test
```

Ou com PHPUnit diretamente:

```bash
./vendor/bin/phpunit
```

### Executar testes específicos

Por classe:

```bash
php artisan test --filter=ProductTest
```

Por método:

```bash
php artisan test --filter=test_nome_do_metodo
```

## Testando com Insomnia

Importe o arquivo `collection_insomnia.json` no Insomnia para testar os endpoints rapidamente.
