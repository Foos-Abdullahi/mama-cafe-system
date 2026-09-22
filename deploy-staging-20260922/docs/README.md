# MaMa Café --- Digital Restaurant Management System

**MaMa Café & Boba Tea**

A simple, professional restaurant management and POS system for orders,
products, waitresses, payments, reports, payroll and daily closing.

## Project vision

Move MaMa Café from paper-based daily records to one connected digital
system.

The goal is not to make the café learn a complicated enterprise system.
The goal is to digitalize the work the café already does.

## Main modules

### 1. Admin Panel / Back Office
 
Full management control organized in 4 core areas:
 
-   **Overview**:
  - `Dashboard`
-   **Management**:
  - `Orders` (with *All Orders*, *Refunds & Cancellations*)
  - `Products`
  - `Categories`
  - `Waitresses`
-   **Finance & Reports**:
  - `Payments`
  - `Payroll` (15% commission)
  - `Reports` (*Sales Report*, *Waitress Report*, *Daily Closing*)
  - `Daily Closing`
-   **System**:
  - `General Settings` (with *Fixed Numbers* configuration)
  - `Users`
  - `Activity Logs`

### 2. Operations Portal / POS

The daily working screen.

-   Login
-   POS
-   Product categories
-   Product selection
-   Current order
-   Waitress assignment
-   Fixed number
-   Payment
-   Receipt
-   Order history
-   Refund
-   Cancellation
-   Daily summary

### 3. Waitress Management

Each waitress can be connected to: - Assigned fixed-number range - Daily
orders - Sales - Collections - Outstanding balances - Performance - 15%
commission

## POS workflow

``` text
SELECT PRODUCT
      ↓
ADD TO CURRENT ORDER
      ↓
ASSIGN WAITRESS + FIXED NUMBER
      ↓
CALCULATE TOTAL
      ↓
SELECT PAYMENT
      ↓
COMPLETE SALE
      ↓
GENERATE RECEIPT
      ↓
UPDATE DAILY TOTALS
      ↓
UPDATE WAITRESS PERFORMANCE
      ↓
UPDATE COMMISSION / PAYROLL
```

## Fixed numbers

Every waitress receives an assigned number range.

Example:

``` text
Amina Ali     1001–2000
Hibo Yusuf    2001–3000
Fatuma Abd    3001–4000
```

The number is used to identify and trace daily orders.

## Commission

The default waitress commission is:

**15%**

Example:

``` text
Sales       $1,000
Commission     15%
Commission    $150
Payout       $850
```

The final payroll implementation should follow the business-approved
commission rules.

## Documentation

-   [Database Schema](01_DATABASE_SCHEMA.md)
-   [Brand & Design System](02_BRAND_DESIGN_SYSTEM.md)
-   [System Overview](03_SYSTEM_OVERVIEW.md)
-   [Roadmap](04_ROADMAP.md)
-   [Changelog](05_CHANGELOG.md)

## UX / presentation

The project includes a presentation showing: - System architecture -
Admin Panel - Operations Portal - POS Sales Terminal - Products
Management - Orders Management - Payroll & Commission - Reports -
Waitress workflow

## Current design principle

**One order creates one connected record.**

The system connects:

``` text
Waitress
   +
Fixed Number
   +
Products
   +
Order
   +
Payment
   +
Receipt
   +
Daily Total
   +
Commission
   +
Payroll
```

## Product direction

The first version focuses on daily restaurant operations.

Future modules can include: - Inventory - Kitchen Display System -
Online ordering - Customer loyalty - Delivery - Multi-branch management

## Status

**Design / UX stage**

The next step is to approve the system design, database schema and POS
workflow before beginning implementation.
