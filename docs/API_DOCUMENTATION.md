# 📖 Cloud ETS - Backend API Documentation

Selamat datang di dokumentasi resmi RESTful API **Cloud ETS Backend**.  
Dokumentasi ini mencakup seluruh route endpoints, spesifikasi request/response, autentikasi berbasis role (RBAC), serta contoh payload JSON.

---

## 🌐 Overview & Konfigurasi Dasar

- **Base URL:** `http://localhost:3000/api/v1` (atau sesuaikan dengan environment variable `PORT` / `BASE_URL`)
- **Format Data:** `application/json` (kecuali upload file yang menggunakan `multipart/form-data`)
- **Authentication Scheme:** `Bearer <JWT_TOKEN>` pada Header `Authorization`

### Format Standard Response Envelope

Semua respons API dibungkus dalam format standar (`ApiResponseDTO`):

#### 🟢 Success Response
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve data",
  "data": { ... }
}
```

#### 🔴 Error Response
```json
{
  "code": 400,
  "status": false,
  "message": "Validations error",
  "data": {
    "email": ["Invalid email address"]
  }
}
```

---

## 🔑 Authentication & Role Matrix

| Endpoint Group | Public | USER | MERCHANT | DRIVER | ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|
| `/auth/register` | ✅ | - | - | - | - |
| `/auth/login` | ✅ | - | - | - | - |
| `/auth/login/driver` | ✅ | - | - | - | - |
| `/auth/login/merchant` | ✅ | - | - | - | - |
| `/users/me` | ❌ | ✅ | ❌ | ❌ | ✅ |
| `/users (CRUD)` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `/merchants (GET)` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/merchants (POST/DELETE)` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `/merchants (PUT)` | ❌ | ❌ | ✅ | ❌ | ✅ |
| `/drivers (CRUD)` | ❌ | ❌ | ❌ | ✅ (GET/PUT self) | ✅ |
| `/catalogs (GET)` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/catalogs (CUD)` | ❌ | ❌ | ✅ | ❌ | ✅ |
| `/orders (POST create)` | ❌ | ✅ | ❌ | ❌ | ✅ |
| `/orders (GET list/detail)` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `/orders/:id/status (PATCH)`| ❌ | ❌ | ✅ | ✅ | ✅ |
| `/transactions (GET)` | ❌ | ✅ | ✅ | ❌ | ✅ |
| `/transactions/:id/status` | ❌ | ✅ | ❌ | ❌ | ✅ |

---

## 1. 🔐 Authentication Routes (`/auth`)
File route: `src/routes/auth.route.ts`  
Prefix: `/api/v1/auth`

### 1.1. Register User
Mendaftarkan akun baru pelanggan (default role: `USER`).

- **Method:** `POST`
- **Path:** `/api/v1/auth/register`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "phoneNumber": "08123456789" // opsional
}
```
- **Response (201 Created):**
```json
{
  "code": 201,
  "status": true,
  "message": "Success register user"
}
```

---

### 1.2. Login User / Admin
Login untuk akun role `USER` atau `ADMIN`.

- **Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "USER"
  }
}
```

---

### 1.3. Login Driver
Login khusus armada mitra pengemudi (`DRIVER`).

- **Method:** `POST`
- **Path:** `/api/v1/auth/login/driver`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "driver@example.com",
  "password": "password123"
}
```
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Driver login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "DRIVER"
  }
}
```

---

### 1.4. Login Merchant
Login khusus pemilik toko/restoran mitra (`MERCHANT`). Akun harus dalam status aktif (`status: true`).

- **Method:** `POST`
- **Path:** `/api/v1/auth/login/merchant`
- **Auth:** Public
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "merchant@example.com",
  "password": "password123"
}
```
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Merchant login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "MERCHANT"
  }
}
```

---

## 2. 👤 User Management Routes (`/users`)
File route: `src/routes/users.route.ts`  
Prefix: `/api/v1/users`  
Semua endpoint memerlukan header `Authorization: Bearer <token>`.

### 2.1. Get Current User Profile (`/me`)
Mengambil data profil user yang sedang login.

- **Method:** `GET`
- **Path:** `/api/v1/users/me`
- **Auth:** `USER`, `ADMIN`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success get user profile",
  "data": {
    "id": "c8b417c8-3561-419b-b2fa-5374828b61e2",
    "email": "johndoe@example.com",
    "name": "John Doe",
    "role": "USER",
    "phoneNumber": "08123456789",
    "createdAt": "2026-10-27T10:00:00.000Z",
    "updatedAt": "2026-10-27T10:00:00.000Z"
  }
}
```

---

### 2.2. Update Current User Profile (`/me`)
Memperbarui profil diri sendiri.

- **Method:** `PUT`
- **Path:** `/api/v1/users/me`
- **Auth:** `USER`, `ADMIN`
- **Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "phone_number": "081987654321",
  "password": "newpassword123" // opsional
}
```
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Successfully updated user profile",
  "data": {
    "id": "c8b417c8-3561-419b-b2fa-5374828b61e2",
    "name": "John Doe Updated",
    "email": "john.new@example.com",
    "role": "USER",
    "phoneNumber": "081987654321",
    "createdAt": "2026-10-27T10:00:00.000Z",
    "updatedAt": "2026-10-27T10:30:00.000Z"
  }
}
```

---

### 2.3. Get All Users (Admin Paginated)
- **Method:** `GET`
- **Path:** `/api/v1/users`
- **Auth:** `ADMIN`
- **Query Params:**
  - `page` (number, default: 1)
  - `take` (number, default: 10)
  - `sort` (`asc` | `desc`, wajib diisi jika sorting query dipakai)
  - `sort_by` (string, default: `createdAt`)
  - `filter` (opsional: `name`)
  - `filter_by` (kata kunci pencarian)
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve users list",
  "data": {
    "items": [
      {
        "id": "c8b417c8-3561-419b-b2fa-5374828b61e2",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "role": "USER",
        "phoneNumber": "08123456789",
        "createdAt": "2026-10-27T10:00:00.000Z",
        "updatedAt": "2026-10-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "take": 10,
      "total_data": 1,
      "total_page": 1
    }
  }
}
```

---

### 2.4. Create User (Admin)
- **Method:** `POST`
- **Path:** `/api/v1/users`
- **Auth:** `ADMIN`
- **Request Body:**
```json
{
  "name": "Admin Junior",
  "email": "admin.junior@example.com",
  "password": "password123",
  "role": "ADMIN", // "ADMIN" | "USER" (default: "USER")
  "phone_number": "081298765432"
}
```
- **Response (201 Created):**
```json
{
  "code": 201,
  "status": true,
  "message": "Successfully created user",
  "data": {
    "id": "787c8a41-2b1b-4d45-9ec4-3da2bc5d6cb4",
    "name": "Admin Junior",
    "email": "admin.junior@example.com",
    "role": "ADMIN",
    "phoneNumber": "081298765432",
    "createdAt": "2026-10-27T11:00:00.000Z",
    "updatedAt": "2026-10-27T11:00:00.000Z"
  }
}
```

---

### 2.5. Get User by ID (Admin)
- **Method:** `GET`
- **Path:** `/api/v1/users/:id`
- **Auth:** `ADMIN`

---

### 2.6. Update User by ID (Admin)
- **Method:** `PUT`
- **Path:** `/api/v1/users/:id`
- **Auth:** `ADMIN`
- **Request Body:** `{ name?, email?, password?, role?, phone_number? }`

---

### 2.7. Delete User (Admin)
- **Method:** `DELETE`
- **Path:** `/api/v1/users/:id`
- **Auth:** `ADMIN`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Successfully deleted user",
  "data": { "id": "uuid..." }
}
```

---

## 3. 🏪 Merchant Routes (`/merchants`)
File route: `src/routes/merchants.route.ts`  
Prefix: `/api/v1/merchants`

Mendukung upload gambar toko baik melalui upload file biner `multipart/form-data` (field: `imageUrl`) yang otomatis disimpan ke Azure Blob Storage, atau melalui link `imageUrl` string JSON.

### 3.1. Get All Merchants
Mengambil daftar seluruh toko mitra (paginated).

- **Method:** `GET`
- **Path:** `/api/v1/merchants`
- **Auth:** `ADMIN`, `USER`, `MERCHANT`, `DRIVER`
- **Query Params:** `page`, `take`, `sort`, `sort_by`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve merchants list",
  "data": {
    "items": [
      {
        "id": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
        "title": "Ayam Geprek Juara",
        "email": "geprek@example.com",
        "address": "Jl. Teknik Kimia, Keputih, Sukolilo, Surabaya",
        "rating": 5,
        "status": true,
        "imageUrl": "https://<account>.blob.core.windows.net/cloud-items/merchants/...",
        "createdAt": "2026-10-27T08:00:00.000Z",
        "updatedAt": "2026-10-27T08:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "take": 10, "total_data": 1, "total_page": 1 }
  }
}
```

---

### 3.2. Get Specific Merchant Detail
Mengambil detail toko beserta katalog menu yang sedang aktif (`status: true`).

- **Method:** `GET`
- **Path:** `/api/v1/merchants/:id`
- **Auth:** `ADMIN`, `USER`, `MERCHANT`, `DRIVER`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve merchant data",
  "data": {
    "id": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
    "title": "Ayam Geprek Juara",
    "email": "geprek@example.com",
    "address": "Jl. Teknik Kimia, Keputih",
    "rating": 5,
    "status": true,
    "imageUrl": "https://...",
    "catalogs": [
      {
        "id": "c1a01e4a-1111-2222-3333-8fbc4c82b123",
        "title": "Paket Geprek Keju",
        "price": 25000,
        "category": "Makanan",
        "status": true,
        "imageUrl": "https://..."
      }
    ]
  }
}
```

---

### 3.3. Create Merchant (Admin Only)
- **Method:** `POST`
- **Path:** `/api/v1/merchants`
- **Auth:** `ADMIN`
- **Content-Type:** `multipart/form-data` ATAU `application/json`
- **Payload Fields:**
  - `title` (string, min 2 max 100) — *wajib*
  - `email` (string, valid email) — *wajib*
  - `password` (string, min 8) — *wajib*
  - `address` (string, min 5) — *wajib*
  - `rating` (int 0-5, default: 0) — *opsional*
  - `status` (boolean, default: true) — *opsional*
  - `imageUrl` (file binary gambar ATAU string URL) — *opsional*
- **Response (201 Created):**
```json
{
  "code": 201,
  "status": true,
  "message": "Successfully created merchant",
  "data": {
    "id": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
    "title": "Ayam Geprek Juara",
    "email": "geprek@example.com",
    "address": "Jl. Teknik Kimia, Keputih",
    "rating": 5,
    "status": true,
    "imageUrl": "https://..."
  }
}
```

---

### 3.4. Edit Merchant
- **Method:** `PUT`
- **Path:** `/api/v1/merchants/:id`
- **Auth:** `ADMIN`, `MERCHANT` (merchant hanya dapat mengedit toko miliknya sendiri)
- **Content-Type:** `multipart/form-data` ATAU `application/json`
- **Payload Fields:** `title?`, `email?`, `password?`, `address?`, `rating?`, `status?`, `imageUrl?`

---

### 3.5. Delete Merchant
- **Method:** `DELETE`
- **Path:** `/api/v1/merchants/:id`
- **Auth:** `ADMIN`

---

### 3.6. Get Merchant Dashboard Stats
Mengambil ringkasan metrik dashboard resto mitra (pesanan hari ini, antrean masak, pendapatan kotor, dan breakdown volume penjualan per 2 jam).

- **Method:** `GET`
- **Path:** `/api/v1/merchants/stats`
- **Auth:** `ADMIN`, `MERCHANT`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve merchant stats",
  "data": {
    "ordersToday": 38,
    "waitingConfirmation": 4,
    "preparing": 18,
    "completed": 28,
    "grossRevenue": 3840000,
    "hourlySales": [
      { "hour": "08:00", "todayVolume": 4, "averageVolume": 3 }
    ]
  }
}
```

---

## 4. 🛵 Driver Routes (`/drivers`)
File route: `src/routes/drivers.route.ts`  
Prefix: `/api/v1/drivers`

### 4.1. Get All Drivers
- **Method:** `GET`
- **Path:** `/api/v1/drivers`
- **Auth:** `ADMIN`
- **Query Params:** `page`, `take`, `sort`, `sort_by`

---

### 4.2. Get Specific Driver
- **Method:** `GET`
- **Path:** `/api/v1/drivers/:id`
- **Auth:** `ADMIN`, `DRIVER` (driver hanya dapat melihat profilnya sendiri)
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve driver data",
  "data": {
    "id": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999",
    "name": "Budi Santoso",
    "email": "driver.budi@example.com",
    "isAvailable": true,
    "createdAt": "2026-10-27T08:00:00.000Z",
    "updatedAt": "2026-10-27T08:00:00.000Z"
  }
}
```

---

### 4.3. Create Driver (Admin)
- **Method:** `POST`
- **Path:** `/api/v1/drivers`
- **Auth:** `ADMIN`
- **Request Body:**
```json
{
  "name": "Budi Santoso",
  "email": "driver.budi@example.com",
  "password": "password123",
  "isAvailable": true
}
```
- **Response (201 Created):**
```json
{
  "code": 201,
  "status": true,
  "message": "Successfully created driver",
  "data": {
    "id": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999",
    "name": "Budi Santoso",
    "email": "driver.budi@example.com",
    "isAvailable": true
  }
}
```

---

### 4.4. Edit Driver Status & Info
Digunakan oleh Driver untuk toggle status online/offline (`isAvailable`) atau oleh Admin untuk update profil armada.

- **Method:** `PUT`
- **Path:** `/api/v1/drivers/:id`
- **Auth:** `ADMIN`, `DRIVER`
- **Request Body:**
```json
{
  "isAvailable": false // atau true
}
```

---

### 4.5. Delete Driver
- **Method:** `DELETE`
- **Path:** `/api/v1/drivers/:id`
- **Auth:** `ADMIN`

---

### 4.6. Get Driver Dashboard Stats
Mengambil ringkasan statistik operasional dan finansial driver (pendapatan hari ini, total pengantaran selesai, rating rata-rata, persentase performa ketepatan waktu, dan breakdown pendapatan 7 hari terakhir).

- **Method:** `GET`
- **Path:** `/api/v1/drivers/stats`
- **Auth:** `ADMIN`, `DRIVER`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve driver stats",
  "data": {
    "todayEarnings": 185000,
    "completedDeliveries": 12,
    "rating": 4.9,
    "onTimeRate": 98,
    "dailyEarnings": [
      { "day": "Sen", "amount": 140000 },
      { "day": "Sel", "amount": 165000 },
      { "day": "Rab", "amount": 190000 },
      { "day": "Kam", "amount": 155000 },
      { "day": "Jum", "amount": 210000 },
      { "day": "Sab", "amount": 240000 },
      { "day": "Min", "amount": 185000 }
    ]
  }
}
```

---

## 5. 🍔 Catalog Routes (`/catalogs`)
File route: `src/routes/catalogs.route.ts`  
Prefix: `/api/v1/catalogs`

Mengelola item menu/makanan yang dijual oleh Merchant.

### 5.1. Get All Catalogs
Mengambil list seluruh menu katalog makanan (bisa difilter per merchant).

- **Method:** `GET`
- **Path:** `/api/v1/catalogs`
- **Auth:** `ADMIN`, `USER`, `MERCHANT`, `DRIVER`
- **Query Params:**
  - `merchantId` (opsional: filter menu milik merchant tertentu)
  - `page`, `take`, `sort`, `sort_by`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve catalogs list",
  "data": {
    "items": [
      {
        "id": "c1a01e4a-1111-2222-3333-8fbc4c82b123",
        "merchantId": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
        "title": "Nasi Goreng Spesial",
        "price": 20000,
        "category": "Makanan",
        "status": true,
        "imageUrl": "https://...",
        "merchant": {
          "id": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
          "title": "Warung Barokah",
          "address": "Jl. Gebang Wetan"
        }
      }
    ],
    "pagination": { "page": 1, "take": 10, "total_data": 1, "total_page": 1 }
  }
}
```

---

### 5.2. Get Catalog Item Detail
- **Method:** `GET`
- **Path:** `/api/v1/catalogs/:id`
- **Auth:** `ADMIN`, `USER`, `MERCHANT`, `DRIVER`

---

### 5.3. Create Catalog Item
Menambah menu baru. Jika pembuat ber-role `MERCHANT`, `merchantId` otomatis diambil dari session token.

- **Method:** `POST`
- **Path:** `/api/v1/catalogs`
- **Auth:** `ADMIN`, `MERCHANT`
- **Content-Type:** `multipart/form-data` ATAU `application/json`
- **Payload Fields:**
  - `title` (string, min 2 max 100) — *wajib*
  - `price` (number, positive integer) — *wajib*
  - `category` (string, min 1) — *wajib*
  - `merchantId` (UUID string, wajib jika dibuat oleh ADMIN) — *kondisional*
  - `status` (boolean, default: true) — *opsional*
  - `imageUrl` (file binary atau URL string) — *opsional*
- **Response (201 Created):**
```json
{
  "code": 201,
  "status": true,
  "message": "Successfully created catalog item",
  "data": {
    "id": "c1a01e4a-1111-2222-3333-8fbc4c82b123",
    "merchantId": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
    "title": "Nasi Goreng Spesial",
    "price": 20000,
    "category": "Makanan",
    "status": true,
    "imageUrl": "https://..."
  }
}
```

---

### 5.4. Edit Catalog Item
- **Method:** `PUT`
- **Path:** `/api/v1/catalogs/:id`
- **Auth:** `ADMIN`, `MERCHANT` (merchant hanya boleh mengedit menu miliknya)
- **Payload Fields:** `title?`, `price?`, `category?`, `status?`, `imageUrl?`

---

### 5.5. Delete Catalog Item
- **Method:** `DELETE`
- **Path:** `/api/v1/catalogs/:id`
- **Auth:** `ADMIN`, `MERCHANT`

---

## 6. 📦 Order Routes (`/orders`)
File route: `src/routes/orders.route.ts`  
Prefix: `/api/v1/orders`

Alur pemesanan makanan terintegrasi dengan Apache Kafka event stream (`order-created-events`) serta pencatatan otomatis transaksi keuangan.

### 6.1. Create Order (Checkout)
Pelanggan melakukan checkout pesanan dari merchant.  
- Driver yang tersedia akan dialokasikan (baik via Kafka Worker atau automatic fallback).
- Transaksi otomatis dibuat dengan status `pending`.

- **Method:** `POST`
- **Path:** `/api/v1/orders`
- **Auth:** `ADMIN`, `USER`
- **Request Body:**
```json
{
  "merchantId": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
  "deliveryAddress": "Asrama Mahasiswa ITS Blok A No. 12, Sukolilo",
  "driverId": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999", // opsional (bila kosong, sistem auto-assign driver)
  "items": [
    {
      "catalogId": "c1a01e4a-1111-2222-3333-8fbc4c82b123",
      "quantity": 2
    }
  ]
}
```
- **Response (201 Created):**
```json
{
  "code": 201,
  "status": true,
  "message": "Successfully created order and published to event stream",
  "data": {
    "id": "e2a01e4a-1111-4444-5555-8fbc4c82b999",
    "userId": "c8b417c8-3561-419b-b2fa-5374828b61e2",
    "merchantId": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
    "driverId": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999",
    "status": "waiting",
    "deliveryAddress": "Asrama Mahasiswa ITS Blok A No. 12, Sukolilo",
    "createdAt": "2026-10-27T12:00:00.000Z",
    "updatedAt": "2026-10-27T12:00:00.000Z"
  }
}
```

---

### 6.2. Get All Orders (Filtered by Role)
Mengambil daftar pesanan. Filter otomatis disesuaikan dengan role:
- **USER:** hanya melihat pesanan miliknya.
- **DRIVER:** hanya melihat pesanan yang ditugaskan kepadanya.
- **MERCHANT:** hanya melihat pesanan yang masuk ke restorannya.
- **ADMIN:** melihat seluruh pesanan sistem.

- **Method:** `GET`
- **Path:** `/api/v1/orders`
- **Auth:** `ADMIN`, `USER`, `DRIVER`, `MERCHANT`
- **Query Params:** `page`, `take`, `sort`, `sort_by`

---

### 6.3. Get Order Detail
Mengambil informasi lengkap pesanan beserta data relasi `user`, `driver`, `merchant`, `orderItems` (beserta detail menu), dan `transaction`.

- **Method:** `GET`
- **Path:** `/api/v1/orders/:id`
- **Auth:** `ADMIN`, `USER`, `DRIVER`, `MERCHANT` (dengan akses validasi kepemilikan)
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve order detail",
  "data": {
    "id": "e2a01e4a-1111-4444-5555-8fbc4c82b999",
    "status": "waiting",
    "deliveryAddress": "Asrama Mahasiswa ITS Blok A No. 12",
    "user": {
      "id": "c8b417c8-3561-419b-b2fa-5374828b61e2",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phoneNumber": "08123456789"
    },
    "driver": {
      "id": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999",
      "name": "Budi Santoso",
      "isAvailable": false
    },
    "merchant": {
      "id": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
      "title": "Ayam Geprek Juara",
      "address": "Jl. Teknik Kimia"
    },
    "orderItems": [
      {
        "id": "item-uuid-1",
        "quantity": 2,
        "priceSnapshot": 20000,
        "catalog": {
          "title": "Paket Geprek",
          "price": 20000
        }
      }
    ],
    "transaction": {
      "id": "tx-uuid-1",
      "status": "pending",
      "grossAmount": 40000,
      "paidAt": null
    }
  }
}
```

---

### 6.4. Update Order Status
Mengubah alur status pemesanan. Saat status diubah menjadi `delivered` atau `cancelled`, ketersediaan Driver (`isAvailable`) otomatis dipulihkan menjadi `true`.

- **Method:** `PATCH`
- **Path:** `/api/v1/orders/:id/status`
- **Auth:** `ADMIN`, `DRIVER`, `MERCHANT`
- **Request Body:**
```json
{
  "status": "picked", // "waiting" | "picked" | "delivered" | "cancelled"
  "driverId": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999" // opsional
}
```
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Successfully updated order status",
  "data": { ... }
}
```

---

### 6.5. Update Order Info (Admin)
- **Method:** `PUT`
- **Path:** `/api/v1/orders/:id`
- **Auth:** `ADMIN`
- **Request Body:** `{ status?, driverId?, deliveryAddress? }`

---

### 6.6. Delete Order (Admin)
- **Method:** `DELETE`
- **Path:** `/api/v1/orders/:id`
- **Auth:** `ADMIN`

---

## 7. 💳 Transaction Routes (`/transactions`)
File route: `src/routes/transactions.route.ts`  
Prefix: `/api/v1/transactions`

Mengelola pencatatan invoice dan status pembayaran pesanan pelanggan.

### 7.1. Get All Transactions
Mendapatkan daftar transaksi pembayaran.
- **USER:** hanya melihat transaksi pesanan miliknya.
- **MERCHANT:** hanya melihat transaksi penjualan restorannya.
- **ADMIN:** melihat semua transaksi.

- **Method:** `GET`
- **Path:** `/api/v1/transactions`
- **Auth:** `ADMIN`, `USER`, `MERCHANT`
- **Query Params:** `page`, `take`, `sort`, `sort_by`
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Success retrieve transactions list",
  "data": {
    "items": [
      {
        "id": "tx-1234-5678",
        "orderId": "e2a01e4a-1111-4444-5555-8fbc4c82b999",
        "status": "pending",
        "grossAmount": 40000,
        "paidAt": null,
        "createdAt": "2026-10-27T12:00:00.000Z",
        "order": {
          "id": "e2a01e4a-1111-4444-5555-8fbc4c82b999",
          "userId": "c8b417c8-3561-419b-b2fa-5374828b61e2",
          "merchantId": "b1b01e4a-4a67-4e6c-9c7a-8fbc4c82b123",
          "driverId": "d1a01e4a-4a67-4e6c-9c7a-8fbc4c82b999",
          "status": "waiting",
          "deliveryAddress": "Asrama Mahasiswa ITS",
          "createdAt": "2026-10-27T12:00:00.000Z"
        }
      }
    ],
    "pagination": { "page": 1, "take": 10, "total_data": 1, "total_page": 1 }
  }
}
```

---

### 7.2. Get Specific Transaction Detail
- **Method:** `GET`
- **Path:** `/api/v1/transactions/:id`
- **Auth:** `ADMIN`, `USER`, `MERCHANT` (dengan validasi kepemilikan order terkait)

---

### 7.3. Update Transaction Status (Payment Simulation)
Digunakan untuk simulasi konfirmasi pembayaran atau integrasi payment gateway. Jika status diubah menjadi `success`, kolom `paidAt` otomatis tercatat ke timestamp saat ini.

- **Method:** `PATCH`
- **Path:** `/api/v1/transactions/:id/status`
- **Auth:** `ADMIN`, `USER`
- **Request Body:**
```json
{
  "status": "success" // "pending" | "failed" | "success"
}
```
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Successfully updated transaction status",
  "data": {
    "id": "tx-1234-5678",
    "orderId": "e2a01e4a-1111-4444-5555-8fbc4c82b999",
    "status": "success",
    "grossAmount": 40000,
    "paidAt": "2026-10-27T12:05:00.000Z",
    "createdAt": "2026-10-27T12:00:00.000Z",
    "updatedAt": "2026-10-27T12:05:00.000Z"
  }
}
```

---

## 8. ☁️ File Upload Routes (`/upload`) *(Bonus Reference)*
File route: `src/routes/upload.route.ts`  
Prefix: `/api/v1/upload`

- `POST /api/v1/upload`: Upload single image (`file`, `image`, atau `imageUrl`) ke Azure Blob Storage.
- `POST /api/v1/upload/multiple`: Upload multiple images (maks 10 files, form field: `files`).
- `DELETE /api/v1/upload`: Menghapus file dari Azure Blob Storage (body: `{ "url": "..." }` atau `{ "blobName": "..." }`).

---

## 9. 🩺 Health Check (`/health`)
- **Method:** `GET`
- **Path:** `/api/v1/health`
- **Auth:** Public
- **Response (200 OK):**
```json
{
  "code": 200,
  "status": true,
  "message": "Server is healthy",
  "data": {
    "uptime": 124.5,
    "timestamp": "2026-10-27T12:00:00.000Z"
  }
}
```
