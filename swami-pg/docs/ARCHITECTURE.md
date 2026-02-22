# PG Management System Architecture

```mermaid
block-beta
    columns 5
    
    %% User Layer
    space User["USERS<br/>Public | Tenant | Admin"]:3 space
    
    %% Presentation Layer
    space:5
    block:presentation:5
        columns 3
        PL["PRESENTATION LAYER"]:3
        PublicUI["Public Portal<br/>Home<br/>Property View<br/>Visit Request"]
        TenantUI["Tenant Portal<br/>Dashboard<br/>Bills<br/>Complaints"]
        AdminUI["Admin Portal<br/>Properties<br/>Tenants<br/>Billing"]
    end
    
    %% Application Layer
    space:5
    block:application:5
        columns 3
        AL["APPLICATION LAYER"]:3
        Router["React Router<br/>Route Protection"]
        Context["Auth Context<br/>State Management"]
        Components["Shared Components<br/>UI Library"]
    end
    
    %% Service Layer  
    space:5
    block:service:5
        columns 3
        SL["SERVICE LAYER"]:3
        AuthSDK["Firebase Auth SDK"]
        FirestoreSDK["Firestore SDK"]
        StorageSDK["Storage SDK"]
    end
    
    %% Backend Layer
    space:5
    block:backend:5
        columns 3
        BL["FIREBASE BACKEND"]:3
        Auth["Authentication<br/>Email/Password"]
        DB["Firestore<br/>NoSQL Database"]
        Storage["Cloud Storage<br/>Files and Images"]
    end
    
    %% Data Layer
    space:5
    block:data:5
        columns 6
        DL["DATA COLLECTIONS"]:6
        admins["admins"]
        tenants["tenants"]
        properties["properties"]
        bills["bills"]
        complaints["complaints"]
        visits["visit_requests"]
    end

    %% Connections
    User --> presentation
    presentation --> application
    application --> service
    service --> backend
    DB --> data

    %% Styling
    style User fill:#e3f2fd,stroke:#1565c0
    style presentation fill:#fff8e1,stroke:#f57c00
    style application fill:#f3e5f5,stroke:#7b1fa2
    style service fill:#e0f7fa,stroke:#00838f
    style backend fill:#ffebee,stroke:#c62828
    style data fill:#e8f5e9,stroke:#388e3c
```

---

| Layer | Components | Responsibility |
|-------|------------|----------------|
| **Presentation** | Public, Tenant, Admin Portals | User interface and interactions |
| **Application** | Router, Context, Components | Business logic and state |
| **Service** | Firebase SDKs | API communication |
| **Backend** | Auth, Firestore, Storage | Data persistence and security |
| **Data** | 6 Collections | Domain entities storage |

---

*February 2026*
