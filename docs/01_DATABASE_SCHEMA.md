# MaMa Café --- Database Schema

## Purpose

The database supports the Admin Panel, POS/Operations Portal, waitress
order tracking, fixed numbers, payments, refunds, cancellations, payroll
and 15% commission.

## Core entities

### users

-   `id` --- primary key
-   `name`
-   `phone`
-   `username`
-   `password_hash`
-   `role` --- `admin`, `manager`, `operations`, `waitress`
-   `status`
-   `created_at`
-   `updated_at`

### waitresses

-   `id` --- primary key
-   `user_id` --- FK → users.id
-   `commission_rate` --- default `0.15`
-   `status`

### fixed_numbers

-   `id` --- primary key
-   `waitress_id` --- FK → waitresses.id
-   `range_start`
-   `range_end`
-   `current_number`
-   `status`
-   `assigned_at`

A fixed number range belongs to a waitress and is used to identify daily
orders.

### categories

-   `id`
-   `name`
-   `description`
-   `status`

### products

-   `id`
-   `category_id` --- FK → categories.id
-   `name`
-   `description`
-   `price`
-   `image_url`
-   `status`
-   `created_at`
-   `updated_at`

### orders

-   `id`
-   `order_number`
-   `fixed_number`
-   `waitress_id` --- FK → waitresses.id
-   `order_type` --- `dine_in`, `takeaway`
-   `subtotal`
-   `discount`
-   `tax`
-   `total`
-   `status` --- `draft`, `completed`, `cancelled`, `refunded`
-   `created_at`
-   `completed_at`

### order_items

-   `id`
-   `order_id` --- FK → orders.id
-   `product_id` --- FK → products.id
-   `quantity`
-   `unit_price`
-   `line_total`

### payments

-   `id`
-   `order_id` --- FK → orders.id
-   `method` --- `cash`, `mobile_money`, `card`, `credit`
-   `amount`
-   `status` --- `paid`, `partial`, `unpaid`, `refunded`
-   `paid_at`
-   `reference`

### refunds

-   `id`
-   `order_id` --- FK → orders.id
-   `amount`
-   `reason`
-   `processed_by`
-   `created_at`

### cancellations

-   `id`
-   `order_id` --- FK → orders.id
-   `reason`
-   `cancelled_by`
-   `created_at`

### payroll

-   `id`
-   `waitress_id`
-   `period_start`
-   `period_end`
-   `total_sales`
-   `commission_rate`
-   `commission_amount`
-   `adjustments`
-   `net_payout`
-   `status`

### daily_closings

-   `id`
-   `business_date`
-   `total_orders`
-   `total_sales`
-   `total_collected`
-   `total_outstanding`
-   `expected_amount`
-   `received_amount`
-   `difference`
-   `closed_by`
-   `closed_at`

### audit_logs

-   `id`
-   `user_id`
-   `action`
-   `entity_type`
-   `entity_id`
-   `details`
-   `created_at`

## Relationships

``` text
users
  └── waitresses
        └── fixed_numbers

categories
  └── products
        └── order_items
              └── orders
                    ├── payments
                    ├── refunds
                    └── cancellations

waitresses
  └── orders
        └── payroll

orders
  └── daily_closings (through business date)
```

## Business rules

1.  Every completed order must have a waitress and fixed number.
2.  Default waitress commission is **15%**.
3.  A cancelled order does not count as completed sales.
4.  A refunded order must retain its original order history.
5.  Payment status is calculated from total versus amount collected.
6.  Fixed numbers must not be duplicated within an active assignment.
7.  Payroll is calculated from eligible completed sales.
