# API Contract — Autoflex Inventory API

---

# Authentication

## Login

POST `/auth/login`

### Request

```json
{
  "email": "admin@autoflex.com",
  "password": "123456"
}
```

### Response (200)

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "Autoflex Admin",
    "email": "admin@autoflex.com",
    "role": "ADMIN"
  }
}
```

---

## Authentication (JWT)

Para endpoints protegidos, inclua o token no cabeçalho da requisição:

```
Authorization: Bearer <jwt-token>
```

---

## Unauthorized (401)

```json
{
  "timestamp": "2026-02-15T00:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or missing token",
  "path": "/products",
  "fieldErrors": null
}
```

---

## Forbidden (403)

```json
{
  "timestamp": "2026-02-15T00:00:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied",
  "path": "/products",
  "fieldErrors": null
}
```

## User Registration (Sign Up)

POST `/auth/register`

### Request

```json
{
  "name": "John Doe",
  "email": "john@doe.com",
  "password": "123456"
}
```

### Response (201)

```json
{
  "id": 2,
  "name": "John Doe",
  "email": "john@doe.com",
  "role": "USER",
  "active": true
}
```

## Validation Error (400)

```json
{
  "timestamp": "2026-02-15T00:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/auth/register",
  "fieldErrors": [
    { "field": "email", "message": "must be a well-formed email address" }
  ]
}
```

## Email Already Exists (409)

```json
{
  "timestamp": "2026-02-15T00:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "Email already exists: john@doe.com",
  "path": "/auth/register",
  "fieldErrors": null
}
```

---

# Product

## Endpoints

- POST `/products`
- GET `/products?name=&code=`
- GET `/products/{id}`
- PUT `/products/{id}`
- PUT `/products/{id}/materials`
- DELETE `/products/{id}`

---

## ProductRequest

```json
{
  "code": "P-001",
  "name": "Product A",
  "price": 50.0,
  "materials": [
    {
      "rawMaterialId": 1,
      "quantity": 2.5
    }
  ]
}
```

---

## ProductResponse

```json
{
  "id": 1,
  "code": "P-001",
  "name": "Product A",
  "price": 50.0,
  "materials": [
    {
      "rawMaterialId": 1,
      "rawMaterialCode": "RM-001",
      "rawMaterialName": "Steel",
      "unit": "KG",
      "quantity": 2.5
    }
  ]
}
```

---

## Update Product Materials Only (Optional)

PUT `/products/{id}/materials`

### ProductMaterialsRequest

```json
[
  { "rawMaterialId": 1, "quantity": 2.5 },
  { "rawMaterialId": 3, "quantity": 1.0 }
]
```

### Response (200)

```json
{
  "id": 1,
  "code": "P-001",
  "name": "Product A",
  "price": 50.0,
  "materials": [
    {
      "rawMaterialId": 1,
      "rawMaterialCode": "RM-001",
      "rawMaterialName": "Steel",
      "unit": "KG",
      "quantity": 2.5
    },
    {
      "rawMaterialId": 3,
      "rawMaterialCode": "RM-003",
      "rawMaterialName": "Screw",
      "unit": "UNIT",
      "quantity": 1.0
    }
  ]
}
```

---

# Raw Material

## Endpoints

- POST `/raw-materials`
- GET `/raw-materials?name=&code=`
- GET `/raw-materials/{id}`
- PUT `/raw-materials/{id}`
- DELETE `/raw-materials/{id}`

---

## RawMaterialRequest

```json
{
  "code": "RM-001",
  "name": "Steel",
  "unit": "KG",
  "stockQuantity": 100
}
```

---

## RawMaterialResponse

```json
{
  "id": 1,
  "code": "RM-001",
  "name": "Steel",
  "unit": "KG",
  "stockQuantity": 100
}
```

---

## Delete Conflict (409)

Ocorre quando tenta deletar uma matéria-prima associado com um ou mais produtos.

```json
{
  "timestamp": "2026-02-15T00:00:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "This raw material is associated with a product.",
  "path": "/raw-materials/3",
  "fieldErrors": null
}
```

---

# 🏭 Production Capacity

GET `/production`

---

## Notas

- **Não** considera concorrência de matérias-primas entre produtos.
- `maxQuantity` é calculado dinamicamente com base no estoque atual.
- `totalValue = unitPrice × maxQuantity`
- Os resultados são priorizados pelos produtos de `maior preço`.

Parâmetros opcionais de consulta:

- `name` (contém)
- `code` (contém)
- Exemplo:

```
GET /production?name=table&code=P-0
```

---

## Response (200)

```json
[
  {
    "productId": 1,
    "productCode": "P-001",
    "productName": "Product A",
    "unitPrice": 50.0,
    "maxQuantity": 16,
    "totalValue": 800.0,
    "materials": [
      {
        "rawMaterialId": 10,
        "rawMaterialCode": "RM-010",
        "rawMaterialName": "Steel",
        "unit": "KG",
        "requiredPerUnit": 2.5,
        "stockQuantity": 100
      }
    ]
  }
]
```
