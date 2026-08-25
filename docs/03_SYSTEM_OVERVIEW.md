# MaMa Café --- System Overview

## Purpose

MaMa Café needs a digital management system that converts the existing
paper workflow into a connected POS and management platform.

The original workflow already records waiters, invoice/receipt numbers,
orders, amounts, payment status, daily totals and end-of-day collection.
The system digitizes those activities while keeping the workflow simple.

## High-level architecture

``` text
                         ┌──────────────────────┐
                         │     ADMIN PANEL      │
                         │      Back Office     │
                         └──────────┬───────────┘
                                    │
                                    ▼
┌──────────────────┐      ┌──────────────────────┐      ┌──────────────────┐
│ OPERATIONS / POS │ ───► │   APPLICATION CORE   │ ◄─── │ REPORTING / BI   │
│                  │      │                      │      │                  │
│ Orders           │      │ Orders               │      │ Sales            │
│ Payments         │      │ Products             │      │ Waitress totals  │
│ Refunds          │      │ Users                │      │ Payroll          │
│ Cancellations    │      │ Payments             │      │ Daily closing    │
└──────────────────┘      └──────────┬───────────┘      └──────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       DATABASE       │
                         │ Orders • Products    │
                         │ Users • Payments     │
                         │ Payroll • Audit      │
                         └──────────────────────┘
```

## Admin Panel

Admin has full control organized in 4 structured areas matching the sidebar navigation:

- **Overview**:
  - `Dashboard`
- **Management**:
  - `Orders` (including *All Orders*, *Refunds & Cancellations*)
  - `Products`
  - `Categories`
  - `Waitresses`
- **Finance & Reports**:
  - `Payments`
  - `Payroll` (with 15% commission)
  - `Reports` (*Sales Report*, *Waitress Report*, *Daily Closing*)
  - `Daily Closing`
- **System**:
  - `General Settings` (including *Fixed Numbers* configuration)
  - `Users`
  - `Activity Logs`

## Operations Portal / POS

Operations staff can: - Login - Create orders - Select products - Assign
waitress - Use fixed numbers - View current orders - Process payment -
Mark paid/partial/unpaid - Refund - Cancel - View daily totals - View
waitress performance - Manage profile

## Waitress workflow

``` text
Login
  ↓
Receive assigned fixed-number range
  ↓
Create/record order
  ↓
Select products + quantities
  ↓
Confirm amount
  ↓
Payment
  ↓
Receipt/order saved
  ↓
Daily sales updated
  ↓
Commission included in performance/payroll
```

## POS behavior

The POS screen is the operational heart of the system.

``` text
Product selection
      ↓
Current order
      ↓
Total calculation
      ↓
Payment method
      ↓
Complete Sale
      ↓
Receipt
      ↓
Database update
      ↓
Reports + waitress totals + payroll
```

## Key design principle

**One order creates one connected record.**

The order should remain connected to its: - waitress - fixed number -
products - amount - payment - receipt - status - date/time - reporting
totals
