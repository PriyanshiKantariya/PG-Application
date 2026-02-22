# PG Management System Class Diagram

```mermaid
classDiagram
    %% ===== USER CLASSES =====
    class Admin {
        +String id
        +String email
        +String name
        +Timestamp created_at
    }

    class Tenant {
        +String id
        +String tenant_code
        +String name
        +String phone
        +String email
        +String auth_uid
        +String property_id
        +Number rent
        +Number deposit
        +String start_date
        +String status
        +String vacated_date
        +String docs_link
        +Timestamp created_at
        +Timestamp updated_at
    }

    %% ===== PROPERTY CLASS =====
    class Property {
        +String id
        +String name
        +String address
        +String area
        +Number total_beds
        +Number default_rent
        +String[] images
        +Timestamp created_at
        +Timestamp updated_at
    }

    %% ===== TRANSACTION CLASSES =====
    class Bill {
        +String id
        +String tenant_id
        +String property_id
        +Number month
        +Number year
        +Number rent_amount
        +Number electricity_share
        +Number gas_share
        +Number late_fee
        +Number total_amount
        +String status
        +Date due_date
        +Timestamp paid_at
        +Timestamp created_at
        +Timestamp updated_at
    }

    %% ===== SUPPORT CLASSES =====
    class Complaint {
        +String id
        +String tenant_id
        +String property_id
        +String title
        +String description
        +String category
        +String image_url
        +String status
        +String admin_notes
        +Timestamp created_at
        +Timestamp resolved_at
        +Timestamp updated_at
    }

    class VisitRequest {
        +String id
        +String name
        +String phone
        +String email
        +String property_id
        +Date preferred_date
        +String preferred_time
        +String status
        +String admin_notes
        +Timestamp created_at
        +Timestamp updated_at
    }

    %% ===== RELATIONSHIPS =====
    Property "1" o-- "0..*" Tenant : houses
    Tenant "1" *-- "0..*" Bill : pays
    Tenant "1" *-- "0..*" Complaint : raises
    Property "1" o-- "0..*" VisitRequest : receives
    Property "1" o-- "0..*" Bill : generates
    Property "1" o-- "0..*" Complaint : has
    Admin "1" -- "0..*" Tenant : manages
    Admin "1" -- "0..*" Property : manages
    Admin "1" -- "0..*" Bill : manages
    Admin "1" -- "0..*" Complaint : resolves
    Admin "1" -- "0..*" VisitRequest : handles
```

---

## Class Descriptions

| Class | Description | Firebase Collection |
|-------|-------------|---------------------|
| **Admin** | System administrator with full access to manage properties, tenants, and billing | `admins` |
| **Tenant** | Registered tenant living in a PG property | `tenants` |
| **Property** | PG accommodation with multiple beds | `properties` |
| **Bill** | Monthly bill generated for each tenant | `bills` |
| **Complaint** | Issue/complaint raised by tenant | `complaints` |
| **VisitRequest** | Visit request from potential tenant | `visit_requests` |

---

## Attribute Details

### Tenant Status Values
- `Pending` - Registered but not assigned property
- `Active` - Currently residing in property
- `Vacated` - Left the property

### Bill Status Values
- `Pending` - Bill generated, awaiting payment
- `ReportedPaid` - Tenant marked as paid, awaiting verification
- `Paid` - Payment verified by admin
- `Overdue` - Past due date, unpaid

### Complaint Status Values
- `Open` - New complaint registered
- `InProgress` - Being addressed
- `Resolved` - Issue resolved

### Complaint Category Values
- `Electrical`
- `Water`
- `Cleaning`
- `Maintenance`
- `Other`

### VisitRequest Status Values
- `New` - Fresh request
- `Contacted` - Admin contacted the visitor
- `Completed` - Visit completed

---

## Relationship Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| Property → Tenant | 1 to Many | One property can house multiple tenants |
| Tenant → Bill | 1 to Many | One tenant can have multiple bills |
| Tenant → Complaint | 1 to Many | One tenant can raise multiple complaints |
| Property → VisitRequest | 1 to Many | One property can receive multiple visit requests |
| Admin → All | Management | Admin manages all entities |

---

*February 2026*
