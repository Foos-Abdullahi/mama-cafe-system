# MaMa Café --- Changelog

All notable changes to the system design are documented here.

## \[0.3.0\] --- System Startup & Brand Implementation

### Added

-   Brand design system colors in `app.css`: Primary Caffeine Brown (`#823d21`), Deep Dark Roasted Coffee sidebar background (`#231008`), and Latte Cream typography (`#FAF4EE`).
-   Branded coffee cup SVG logo component and SVG favicon.
-   Collapsible multi-section admin sidebar navigation (Overview, Management, Finance & Reports, System).
-   User `role` database migration (`admin`, `manager`, `operations`, `waitress`).
-   `AdminSeeder` for default administrator account (`admin@mamacafe.test` / `password`).
-   Application name configuration (`APP_NAME="MaMa Café"`).

### Updated

-   Sidebar styled with fixed solid dark coffee color in both light and dark modes.
-   Refunds integrated directly under the Orders module (`All Orders`, `Refunds & Cancellations`).
-   Fixed Numbers management located under System Settings.
-   Removed redundant scrollbar from sidebar navigation.

## \[0.2.0\] --- POS + System Documentation

### Added

-   POS-style Operations screen.
-   Product/category selection interface.
-   Current-order panel.
-   Payment method actions.
-   Complete Sale workflow.
-   POS workflow documentation.
-   Database schema.
-   Brand and design system.
-   System overview.
-   Product/operations/admin architecture.
-   Project roadmap.
-   Changelog.

### Updated

-   Operations Portal is now explicitly designed as a POS-style
    interface.
-   Order workflow connects waitress, fixed number, products, payment
    and reporting.
-   Documentation now separates Admin Panel responsibilities from
    Operations/POS responsibilities.

## \[0.1.0\] --- Initial System Design

### Added

-   Admin Panel concept.
-   Operations Portal concept.
-   Waitress workflow.
-   Fixed-number concept.
-   Payroll and 15% commission concept.
-   Reports and daily closing concept.
-   Initial UX presentation.
