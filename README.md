## Acknowledgments

Special thanks to [Roitai-Dev's ecom-2024] for the initial reference points in:
- Database schema fundamentals
- Frontend architecture patterns

While these elements provided a valuable starting foundation, this project has evolved into its own distinct implementation with unique features, optimizations, and architectural decisions.

# API Endpoints Summary

## Authentication

| Endpoint                            | Method | Description        | Body                                                 |
|-------------------------------------|--------|--------------------|------------------------------------------------------|
| `/api/login`                        | POST   | Login user/admin         | `{ "email": "admin@gmail.com", "password": "123admin" }`         |
| `/api/register`                     | POST   | Register user      | `{ "email":"tinapat@gmail.com","password":"1234" }`         |
| `/api/current-user`                 | POST   | Get current user   | None                                                 |
| `/api/current-admin`                | POST   | Get current admin  | None                                                 |

## Category

| Endpoint                            | Method | Description            | Body                        |
|-------------------------------------|--------|------------------------|-----------------------------|
| `/api/category`                     | POST   | Create category         | `{ "name":"Sneakers" }`       |
| `/api/category`                     | GET    | Get categories          | None                        |
| `/api/category/:id`                 | DELETE | Delete category by ID   | None                        |

## Product

| Endpoint                            | Method | Description            | Body                                                                                  |
|-------------------------------------|--------|------------------------|---------------------------------------------------------------------------------------|
| `/api/product`                      | POST   | Create product          | `{ "title":"ขาหมูเยอรมัน","description":"desc","price":250,"quantity":100,"categoryId":3,"images":[] }` |
| `/api/product/:id`                  | GET    | Get product by ID       | None                                                                                  |
| `/api/product/:id`                  | DELETE | Delete product by ID    | None                                                                                  |
| `/api/productby`                    | POST   | Get products by filters | `{ "sort": "price", "order": "asc", "limit": 2 }` or `{ "sort": "quantity", "order": "desc", "limit": 2 }` |
| `/api/search/filters`               | POST   | Search with filters     | `{ "query": "mouse" }`, `{ "price": [100, 600] }`, or `{ "category": [1, 2] }`        |
| `/api/bulk-discount`               | POST   | Manage product promotion for Admin     | `{ products:[ {id:1, title:test ,... images:[]}, {..} ], amount:0, startDate:"2025-01-17T21:58:44.063Z", endDate: "2025-01-17T21:58:44.063Z",description: "", isPromotion: true }`        |

## User Management

| Endpoint                            | Method | Description               | Body                                                       |
|-------------------------------------|--------|---------------------------|------------------------------------------------------------|
| `/api/users`                        | GET    | Get all users             | None                                                       |
| `/api/change-status`                | POST   | Change user status        | `{ "id": 1, "enabled": false }`                            |
| `/api/change-role`                  | POST   | Change user role          | `{ "id": 1, "role": "user" }`                              |
| `/api/user/cart`                    | POST   | Add to cart               | `{ "cart": [{ "id": 1, "count": 2, "price": 100 }, { "id": 5, "count": 1, "price": 200 }] }` |
| `/api/user/cart`                    | GET    | Get cart                  | None                                                       |
| `/api/user/cart`                    | DELETE | Delete cart               | None                                                       |
| `/api/user/address`                 | POST   | Add user address          | `{ "address": "kku" }`                                   |
| `/api/user/order`                   | POST   | Place an order            | None                                                       |
| `/api/user/order`                   | GET    | Get user orders           | None                                                       |

## Admin

| Endpoint                            | Method | Description               | Body                              |
|-------------------------------------|--------|---------------------------|-----------------------------------|
| `/api/user/order`                   | PATCH    | Update order status        | `{ "orderId": 35, "orderStatus": "Completed" }` |
| `/api/admin/orders`                 | GET    | Get all orders             | None                              |
<<<<<<< HEAD:README.md


## Acknowledgments

Special thanks to [Roitai-Dev's ecom-2024] for the initial reference points in:
- Database schema fundamentals
- Frontend architecture patterns

While these elements provided a valuable starting foundation, this project has evolved into its own distinct implementation with unique features, optimizations, and architectural decisions.
=======
>>>>>>> origin/main:server/README.md
