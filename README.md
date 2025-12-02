# API de Gerenciamento de Pedidos

API REST desenvolvida para o desafio técnico Jitterbit, focada em integração de dados e mapeamento de payloads entre diferentes formatos JSON.

A API permite criar, consultar, listar, atualizar e deletar pedidos, armazenando tudo em um banco relacional SQLite.

## Tecnologias

- Node.js
- Express
- SQLite3
- Nodemon

## Estrutura do projeto

Pasta principal: `order-api`

### Arquivos principais:

**`src/index.js`**  
Servidor Express, sobe a API e registra as rotas.

**`src/config/db.js`**  
Conexão com o SQLite e criação das tabelas Order e Items.

**`src/services/orderService.js`**  
Mapeamento do payload de entrada (numeroPedido, valorTotal, etc.) para o modelo usado no banco (orderId, value, etc.).

**`src/models/orderModel.js`**  
Camada de acesso ao banco de dados, responsável por:
- inserir pedidos e itens
- buscar pedido por id
- listar todos os pedidos
- atualizar pedido
- deletar pedido e itens associados

**`src/controllers/orderController.js`**  
Recebe a requisição HTTP, chama o service/model e retorna a resposta com o status adequado.

**`src/routes/orderRoutes.js`**  
Define as rotas da API (`/order`, `/order/:orderId`, `/order/list`).

**`database.sqlite`**  
Arquivo gerado automaticamente pelo SQLite com os dados.

**`Order_API.postman_collection.json`**  
Collection do Postman com exemplos de requisições para todos os endpoints.

## Instalação

### Pré-requisitos

- Node.js 14 ou superior
- npm

### Passo a passo

1. Clonar o repositório:
```bash
git clone https://github.com/Yas-min176/jitterbit-order-api.git
cd jitterbit-order-api
```

2. Instalar as dependências:
```bash
npm install
```

3. Rodar em modo desenvolvimento:
```bash
npm run dev
```

Ou rodar em modo "produção":
```bash
npm start
```

A API ficará disponível em: `http://localhost:3000`

## Endpoints

### Criar pedido

**`POST /order`**

Cria um novo pedido no banco, mapeando o JSON de entrada para o modelo interno.

**Exemplo de request:**

```json
{
  "numeroPedido": "VEND-2025-0001-01",
  "valorTotal": 4599.90,
  "dataCriacao": "2025-12-02T10:30:00.000Z",
  "items": [
    {
      "idItem": "101",
      "quantidadeItem": 1,
      "valorItem": 3999.90
    },
    {
      "idItem": "202",
      "quantidadeItem": 1,
      "valorItem": 600.00
    }
  ]
}
```

**Resposta (201):**

```json
{
  "message": "Pedido criado com sucesso",
  "orderId": "VEND-2025-0001"
}
```

---

### Buscar pedido por ID

**`GET /order/:orderId`**

**Exemplo:**
```
GET /order/VEND-2025-0001
```

**Resposta (200):**

```json
{
  "orderId": "VEND-2025-0001",
  "value": 4599.9,
  "creationDate": "2025-12-02T10:30:00.000Z",
  "items": [
    {
      "productId": 101,
      "quantity": 1,
      "price": 3999.9
    },
    {
      "productId": 202,
      "quantity": 1,
      "price": 600
    }
  ],
  "itemsTotal": 4599.9
}
```

**Se não encontrar:**

```json
{
  "message": "Pedido não encontrado",
  "orderId": "VEND-2025-0001"
}
```

---

### Listar todos os pedidos

**`GET /order/list`**

**Resposta (200):**

```json
{
  "total": 3,
  "orders": [
    {
      "orderId": "VEND-2025-0001",
      "value": 4599.9,
      "creationDate": "2025-12-02T10:30:00.000Z"
    },
    {
      "orderId": "VEND-2025-0002",
      "value": 150.5,
      "creationDate": "2025-12-02T14:15:00.000Z"
    },
    {
      "orderId": "VEND-2025-0003",
      "value": 820,
      "creationDate": "2025-12-01T09:00:00.000Z"
    }
  ]
}
```

---

### Atualizar pedido

**`PUT /order/:orderId`**

**Exemplo:**
```
PUT /order/VEND-2025-0001
```

**Body:**

```json
{
  "valorTotal": 5000.00,
  "dataCriacao": "2025-12-02T16:00:00.000Z"
}
```

**Resposta (200):**

```json
{
  "message": "Pedido atualizado com sucesso",
  "order": {
    "orderId": "VEND-2025-0001",
    "value": 5000,
    "creationDate": "2025-12-02T16:00:00.000Z"
  }
}
```

---

### Deletar pedido

**`DELETE /order/:orderId`**

**Exemplo:**
```
DELETE /order/VEND-2025-0001
```

**Resposta (200):**

```json
{
  "message": "Pedido deletado com sucesso",
  "orderId": "VEND-2025-0001"
}
```

---

## Mapeamento de dados

A API recebe um JSON de entrada em um formato e converte para o modelo usado no banco.

**Entrada (exemplo):**

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Formato interno:**

```json
{
  "orderId": "v10089015vdb",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

### Regras principais:

- **`numeroPedido`** → **`orderId`**  
  Remove o sufixo depois do último hífen  
  Exemplo: `VEND-2025-0001-01` → `VEND-2025-0001`

- **`valorTotal`** → **`value`**

- **`dataCriacao`** → **`creationDate`** (string ISO)

- **`items[].idItem`** → **`items[].productId`** (número)

- **`items[].quantidadeItem`** → **`items[].quantity`**

- **`items[].valorItem`** → **`items[].price`**

---

## Banco de dados

**Banco:** SQLite  
**Arquivo:** `database.sqlite`

### Tabela Order:

- `orderId` (TEXT, PRIMARY KEY)
- `value` (REAL, NOT NULL)
- `creationDate` (TEXT, NOT NULL)

### Tabela Items:

- `id` (INTEGER, PRIMARY KEY AUTOINCREMENT)
- `orderId` (TEXT, FOREIGN KEY para Order.orderId)
- `productId` (INTEGER, NOT NULL)
- `quantity` (INTEGER, NOT NULL)
- `price` (REAL, NOT NULL)

---

## Tratamento de erros

**Códigos de resposta:**

- **200**: sucesso
- **201**: recurso criado
- **400**: payload inválido ou campos obrigatórios ausentes
- **404**: pedido não encontrado
- **500**: erro interno do servidor

---

## Postman

A collection com todos os endpoints e exemplos de requisições está no arquivo:  
`Order_API.postman_collection.json`

Importe no Postman para testar a API.


