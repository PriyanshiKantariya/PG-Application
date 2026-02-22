# PG Management System Flowchart

## Application User Flow

```mermaid
flowchart TD
    Start([User Visits Website]) --> Home[Home Page]
    
    Home --> Browse{Browse Properties?}
    Browse -->|Yes| PropList[View Property Listings]
    PropList --> PropDetail[Property Details]
    PropDetail --> ReqVisit[Request Visit Form]
    ReqVisit --> VisitSubmit[Submit Visit Request]
    VisitSubmit --> Home
    
    Browse -->|No| LoginChoice{Login?}
    
    LoginChoice -->|Tenant| TenantLogin[Tenant Login Page]
    LoginChoice -->|Admin| AdminLogin[Admin Login Page]
    LoginChoice -->|New User| TenantSignup[Tenant Signup]
    
    TenantSignup --> TenantLogin
    
    %% Tenant Flow
    TenantLogin --> AuthCheck1{Auth Valid?}
    AuthCheck1 -->|No| TenantLogin
    AuthCheck1 -->|Yes| TenantDash[Tenant Dashboard]
    
    TenantDash --> TenantActions{Select Action}
    TenantActions --> ViewBills[View Bills]
    TenantActions --> ViewComplaints[View Complaints]
    TenantActions --> ViewProfile[View Profile]
    TenantActions --> TenantLogout[Logout]
    
    ViewBills --> BillDetail[Bill Details]
    BillDetail --> ReportPayment[Report Payment]
    ReportPayment --> ViewBills
    
    ViewComplaints --> NewComplaint[Create Complaint]
    ViewComplaints --> ComplaintDetail[Complaint Details]
    NewComplaint --> ViewComplaints
    ComplaintDetail --> ViewComplaints
    
    ViewProfile --> TenantDash
    TenantLogout --> Home
    
    %% Admin Flow
    AdminLogin --> AuthCheck2{Auth Valid?}
    AuthCheck2 -->|No| AdminLogin
    AuthCheck2 -->|Yes| AdminDash[Admin Dashboard]
    
    AdminDash --> AdminActions{Select Action}
    AdminActions --> ManageProps[Manage Properties]
    AdminActions --> ManageTenants[Manage Tenants]
    AdminActions --> ManageBills[Manage Bills]
    AdminActions --> ManageVisits[Manage Visit Requests]
    AdminActions --> ManageComplaints[Manage Complaints]
    AdminActions --> AdminLogout[Logout]
    
    ManageProps --> AddProp[Add Property]
    ManageProps --> EditProp[Edit Property]
    AddProp --> ManageProps
    EditProp --> ManageProps
    
    ManageTenants --> AddTenant[Add Tenant]
    ManageTenants --> TenantDetail[Tenant Details]
    AddTenant --> ManageTenants
    TenantDetail --> ManageTenants
    
    ManageBills --> EnterUtilities[Enter Utility Readings]
    ManageBills --> BillsOverview[Bills Overview]
    EnterUtilities --> ManageBills
    BillsOverview --> ManageBills
    
    ManageVisits --> UpdateVisit[Update Visit Status]
    UpdateVisit --> ManageVisits
    
    ManageComplaints --> ReplyComplaint[Reply to Complaint]
    ManageComplaints --> ResolveComplaint[Resolve Complaint]
    ReplyComplaint --> ManageComplaints
    ResolveComplaint --> ManageComplaints
    
    AdminLogout --> Home
```

---

## Legend

| Symbol | Meaning |
|--------|---------|
| Rounded rectangle | Start/End point |
| Rectangle | Process/Page |
| Diamond | Decision point |
| Arrow | Flow direction |

---

*February 2026*
