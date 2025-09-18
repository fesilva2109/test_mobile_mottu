# Mock API Specification for Mottu Mobile App

## Base URL
`http://localhost:3001`

---

## Endpoints

### 1. Authentication

#### POST /auth/login
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- Response 200:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
  ```
- Response 401 Unauthorized:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

#### POST /auth/register
- Request Body:
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- Response 201:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
  ```
- Response 400 Bad Request:
  ```json
  {
    "message": "Email already in use"
  }
  ```

#### POST /auth/logout
- Request Headers:
  - Authorization: Bearer token
- Response 204 No Content

---

### 2. Motorcycles

#### GET /motorcycles
- Response 200:
  ```json
  [
    {
      "id": "string",
      "placa": "string",
      "modelo": "string",
      "cor": "string",
      "status": "string",
      "timestampEntrada": number,
      "reservada": boolean,
      "posicao": {
        "x": number,
        "y": number
      }
    }
  ]
  ```

#### GET /motorcycles/:id
- Response 200:
  ```json
  {
    "id": "string",
    "placa": "string",
    "modelo": "string",
    "cor": "string",
    "status": "string",
    "timestampEntrada": number,
    "reservada": boolean,
    "posicao": {
      "x": number,
      "y": number
    }
  }
  ```
- Response 404 Not Found:
  ```json
  {
    "message": "Motorcycle not found"
  }
  ```

#### POST /motorcycles
- Request Body:
  ```json
  {
    "placa": "string",
    "modelo": "string",
    "cor": "string",
    "status": "string",
    "timestampEntrada": number,
    "reservada": boolean,
    "posicao": {
      "x": number,
      "y": number
    }
  }
  ```
- Response 201 Created:
  ```json
  {
    "id": "string",
    "placa": "string",
    "modelo": "string",
    "cor": "string",
    "status": "string",
    "timestampEntrada": number,
    "reservada": boolean,
    "posicao": {
      "x": number,
      "y": number
    }
  }
  ```

#### PUT /motorcycles/:id
- Request Body: Same as POST /motorcycles
- Response 200: Updated motorcycle object
- Response 404 Not Found:
  ```json
  {
    "message": "Motorcycle not found"
  }
  ```

#### DELETE /motorcycles/:id
- Response 204 No Content
- Response 404 Not Found:
  ```json
  {
    "message": "Motorcycle not found"
  }
  ```

---

## Example Error Responses

- 401 Unauthorized:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

- 404 Not Found:
  ```json
  {
    "message": "Resource not found"
  }
  ```

- 500 Internal Server Error:
  ```json
  {
    "message": "Internal server error"
  }
  ```

---

## Notes

- Use the provided `db.json` file with JSON Server to simulate the backend.
- Run JSON Server with:
  ```
  npx json-server --watch db.json --port 3001
  ```
- Authentication tokens can be mocked as static strings for testing.
