# Swami PG Management System

A full-stack web application for managing PG (Paying Guest) accommodations. It provides a **public-facing website** for property listings, a **tenant portal** for bills & complaints, and an **admin panel** for end-to-end property management — all backed by Firebase.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)
8. [Available Scripts](#available-scripts)
9. [User Roles & Routes](#user-roles--routes)
10. [Module Documentation](#module-documentation)
11. [Firebase Setup](#firebase-setup)
12. [Firestore Security Rules](#firestore-security-rules)
13. [Deployment](#deployment)
14. [Contributing](#contributing)
15. [Assumptions & Limitations](#assumptions--limitations)
16. [License](#license)
17. [Support](#support)

---

## Overview

**Swami PG Management System** is a single-page application built to digitize and automate the day-to-day management of PG accommodations in Vadodara, Gujarat. It supports multiple properties, provides separate interfaces for administrators and tenants, and includes a public-facing website for prospective tenants.

### Key Objectives

- Centralize property and tenant data management
- Automate monthly bill generation with utility calculations
- Provide tenants with self-service access to bills, complaint submission, and profile management
- Enable property owners to manage visit requests, verify payments, and track occupancy
- Present properties to prospective tenants through an attractive public homepage

---

## Features

### Public Portal

- Property listings with images, rent range, and live availability (beds remaining)
- Individual property detail pages with image gallery, amenities, and house rules
- "All Properties" page with area-based filtering
- Visit request submission form with preferred time slots
- House rules page
- Contact options via phone and WhatsApp

### Admin Panel

| Module | Description |
|--------|-------------|
| **Dashboard** | Overview of properties, active tenants, pending bills, and complaints |
| **Properties** | Create, edit, and delete properties with Cloudinary image uploads and homepage visibility toggle |
| **Tenants** | Add tenants, assign to properties/flats, track status (Pending → Active → Vacated) |
| **Utilities & Bills** | Record monthly electricity, water, and gas readings per flat; auto-generate bills |
| **Bills Overview** | View and manage generated bills across all properties |
| **Payment Verification** | Review tenant-reported payments and approve/reject them |
| **Complaints** | Review, respond to, and resolve tenant complaints |
| **Visit Requests** | Process property visit inquiries from prospective tenants |

### Tenant Portal

| Module | Description |
|--------|-------------|
| **Dashboard** | Current bill status, property info, and quick actions |
| **Bills** | View current and past bills; report payments as paid |
| **Complaints** | Submit new complaints, track resolution status, view responses |
| **Profile** | View personal and assignment details |
| **Sign Up** | Self-service registration for new tenants |

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Frontend Framework | React | 19.2 |
| Build Tool | Vite | 7.2 |
| Styling | Tailwind CSS (Vite plugin) | 4.1 |
| Routing | React Router DOM | 7.13 |
| Authentication & Database | Firebase (Auth + Firestore) | 12.8 |
| Image Hosting | Cloudinary (REST API, no SDK) | — |
| Language | JavaScript (ES Modules) | — |
| Font | Inter (Google Fonts) | — |
| Linting | ESLint + react-hooks + react-refresh plugins | 9.39 |

> **Note:** Firebase Storage is **not** used. All image uploads (property photos, utility bill photos) go through **Cloudinary's** unsigned upload API.

---

## Project Structure

```
PG-App/
├── README.md                          # This file
├── swami-pg/                          # Application root
│   ├── public/
│   │   └── logo.svg                   # Application logo / favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── ProtectedRoute.jsx # Role-based route guard (admin / tenant)
│   │   │   │   └── index.js
│   │   │   ├── common/
│   │   │   │   ├── LoadingSpinner.jsx  # Shared loading indicator
│   │   │   │   ├── StatusBadge.jsx     # Color-coded status badges
│   │   │   │   └── index.js
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.jsx     # Admin sidebar + top bar
│   │   │   │   ├── TenantLayout.jsx    # Tenant sidebar + top bar
│   │   │   │   ├── PublicLayout.jsx    # Public header + footer wrapper
│   │   │   │   ├── Header.jsx          # Public navigation header
│   │   │   │   ├── Footer.jsx          # Public footer
│   │   │   │   └── index.js
│   │   │   └── property/
│   │   │       ├── PropertyCard.jsx    # Property listing card
│   │   │       └── index.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Auth state + role detection (admin/tenant)
│   │   ├── firebase/
│   │   │   └── config.js              # Firebase app, auth, and Firestore init
│   │   ├── hooks/
│   │   │   └── useProperties.js       # useProperties, useProperty, useAreas hooks
│   │   ├── pages/
│   │   │   ├── admin/                 # 12 admin pages (see Routes section)
│   │   │   ├── public/                # 5 public pages
│   │   │   └── tenant/                # 9 tenant pages
│   │   ├── utils/
│   │   │   ├── cloudinary.js          # Cloudinary unsigned upload utility
│   │   │   ├── constants.js           # App-wide constants and enums
│   │   │   └── helpers.js             # Formatting, validation, link generators
│   │   ├── App.jsx                    # Root component with all route definitions
│   │   ├── main.jsx                   # Application entry point
│   │   └── index.css                  # Global styles + Tailwind imports
│   ├── docs/                          # UML and architecture diagrams (Mermaid)
│   │   ├── ARCHITECTURE.md
│   │   ├── CLASS_DIAGRAM.md
│   │   ├── FLOWCHART.md
│   │   ├── SEQUENCE_DIAGRAM.md
│   │   └── USE_CASE_DIAGRAM.md
│   ├── firebase.json                  # Firebase Hosting + Firestore config
│   ├── firestore.rules                # Firestore security rules
│   ├── .env.example                   # Environment variable template
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
```

---

## Prerequisites

| Requirement | Minimum Version |
|-------------|-----------------|
| Node.js | 18.0+ |
| npm | 9.0+ (ships with Node) |
| Git | Any recent version |
| Firebase account | Free Spark plan is sufficient |
| Cloudinary account | Free plan (25 credits/month) |

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/PriyanshiKantariya/PG-Application.git
   cd PG-Application/swami-pg
   ```

2. **Install dependencies**L

   ```bash
   npm install
   ```

3. **Set up environment variables** — see the next section

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   The app will be available at **http://localhost:5173**.

---

## Environment Variables

Create a `.env` file inside the `swami-pg/` directory. Use `.env.example` as a template:

```env
# ── Firebase ─────────────────────────────────────────────
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# ── Cloudinary (image uploads) ──────────────────────────
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

| Variable | Source | Purpose |
|----------|--------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings | Identifies the Firebase project |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings | Auth redirect domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console → Project Settings | Firestore project identifier |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings | Storage bucket reference (kept for config compatibility) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings | FCM sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase Console → Project Settings | Firebase app identifier |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard | Your Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload → Upload presets | Unsigned upload preset name |

> **Important:** Never commit `.env` files to version control. They are already ignored in `.gitignore`.

---

## Available Scripts

All commands should be run from the `swami-pg/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR at `http://localhost:5173` |
| `npm run build` | Create optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all `.js` and `.jsx` files |

---

## User Roles & Routes

### Roles

| Role | Access Level | Authentication |
|------|--------------|----------------|
| **Public** | Homepage, property listings, property details, visit request form, house rules | None required |
| **Tenant** | Tenant portal — dashboard, bills, complaints, profile | Email / Password |
| **Admin** | Full admin panel access | Email / Password |

### Route Map

#### Public Routes (wrapped in `PublicLayout`)

| Path | Page |
|------|------|
| `/` | HomePage |
| `/properties` | AllPropertiesPage |
| `/property/:propertyId` | PropertyDetailPage |
| `/request-visit` | RequestVisitPage |
| `/rules` | RulesPage |

#### Tenant Auth Routes (no layout wrapper)

| Path | Page |
|------|------|
| `/tenant/login` | TenantLoginPage |
| `/tenant/signup` | TenantSignUpPage |

#### Protected Tenant Routes (wrapped in `TenantLayout`)

| Path | Page |
|------|------|
| `/tenant/dashboard` | TenantDashboard |
| `/tenant/bills` | BillsListPage |
| `/tenant/bills/:billId` | BillDetailPage |
| `/tenant/complaints` | ComplaintsListPage |
| `/tenant/complaints/new` | NewComplaintPage |
| `/tenant/complaints/:complaintId` | ComplaintDetailPage |
| `/tenant/profile` | TenantProfilePage |

#### Admin Auth Route

| Path | Page |
|------|------|
| `/admin/login` | AdminLoginPage |

#### Protected Admin Routes (wrapped in `AdminLayout`)

| Path | Page |
|------|------|
| `/admin/dashboard` | AdminDashboard |
| `/admin/properties` | PropertiesListPage |
| `/admin/properties/new` | PropertyFormPage |
| `/admin/properties/:propertyId/edit` | PropertyFormPage (edit mode) |
| `/admin/tenants` | TenantsListPage |
| `/admin/tenants/new` | TenantFormPage |
| `/admin/tenants/:tenantId` | TenantDetailPage |
| `/admin/bills` | UtilitiesEntryPage |
| `/admin/bills/overview` | BillsOverviewPage |
| `/admin/visits` | VisitRequestsPage |
| `/admin/complaints` | ComplaintsAdminPage |
| `/admin/payment-verification` | PaymentVerificationPage |

---

## Module Documentation

### Properties

Each property record stores:

- **Basic info:** name, area, full address, landmark
- **Capacity:** total beds, total flats
- **Financials:** rent range (min/max rent), deposit (1.5× monthly rent)
- **House rules:** text displayed to prospective tenants
- **Images:** uploaded to Cloudinary, URLs stored in Firestore
- **Visibility:** `showOnHomepage` toggle to control public listing

### Tenants

Tenant records include:

- **Personal:** name, phone, email, emergency contact
- **Assignment:** property ID, flat number, bed number
- **Financials:** custom rent (overrides property default), deposit paid
- **Status:** `Pending` → `Active` → `Vacated`
- **Documents:** ID proof and address proof references
- **Auth link:** matched via document ID, `auth_uid` field, or case-insensitive email

### Utilities

Monthly utility readings recorded per flat (stored in `utility_bills` collection):

- **Electricity:** previous and current meter readings with photo upload
- **Water:** fixed or metered charges
- **Gas:** cylinder count or metered usage
- **Billing period:** month and year

### Bills

Generated bills include:

- Base rent (property default or tenant-specific)
- Calculated utility charges
- Additional charges or adjustments
- **Status:** `Pending` → `ReportedPaid` → `Paid` | `Overdue`

> Tenants can self-report payment (Pending → ReportedPaid). Admins verify and approve via the Payment Verification page.

### Complaints

| Field | Values |
|-------|--------|
| **Categories** | Electrical, Water, Cleaning, Maintenance, Other |
| **Status** | Open → InProgress → Resolved |

Includes admin response/resolution notes.

### Visit Requests

Prospective tenant inquiries from the public visit request form:

| Field | Values |
|-------|--------|
| **Time Slots** | Morning 10–12, Afternoon 2–4, Evening 5–7 |
| **Status** | New → Contacted → Completed |

### External Integrations

The app links to two external Google Forms (configured in `utils/constants.js`):

- **New Tenant Onboarding Form** — for tenant document collection
- **Payment Screenshot Form** — tenants upload payment proof; responses are stored in a linked Google Sheet

---

## Firebase Setup

### Required Services

| Service | Purpose | Required Plan |
|---------|---------|---------------|
| **Authentication** | Email/Password sign-in for tenants and admins | Free (Spark) |
| **Cloud Firestore** | NoSQL database for all application data | Free (Spark) |

> Firebase Storage is **not required**. Image uploads use Cloudinary.

### Firestore Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| `properties` | Property records (name, address, capacity, images) | Public read, admin write |
| `tenants` | Tenant personal and assignment records | Public read (for bed counts), admin write |
| `bills` | Monthly generated bills | Admin + own tenant read; admin write; tenant limited update |
| `complaints` | Tenant complaints and resolutions | Admin + property-tenant read; tenant create; admin update |
| `visit_requests` | Public visit inquiries | Public create, admin manage |
| `admins` | Admin user records (for role verification) | Authenticated read, admin write |
| `utility_bills` | Monthly utility meter readings per flat | Admin only |

### Admin User Setup

To create the first admin user:

1. Create a user via Firebase Auth (Email/Password)
2. In Firestore, create a document in the `admins` collection with the **document ID set to the user's UID**
3. The `AuthContext` checks for this document to grant admin privileges

---

## Firestore Security Rules

The project includes production-ready security rules in `swami-pg/firestore.rules`. Key highlights:

- **Properties / Tenants:** public read (needed for homepage listings), admin-only write
- **Bills:** admin + own-tenant read; tenants can only update status from `Pending` → `ReportedPaid` (and nothing else)
- **Complaints:** admin has full access; tenants can read complaints for their property and create new ones
- **Visit Requests:** anyone can create (public form); only admins can read/update/delete
- **Admins:** authenticated users can read (for role check in AuthContext); only admins can write
- **Utility Bills:** admin-only read and write

To deploy rules:

```bash
firebase deploy --only firestore:rules
```

---

## Deployment

### Vercel (Recommended)

The project is configured for Vercel deployment (`.vercel/` directory present):

1. Connect the repository to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `swami-pg`
3. Vercel auto-detects Vite; default settings work out of the box
4. Add all environment variables in Vercel → Project Settings → Environment Variables
5. Deploy

### Firebase Hosting

1. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:

   ```bash
   firebase login
   firebase init hosting
   ```

   - Set public directory to `dist`
   - Configure as single-page app: **Yes**

3. Build and deploy:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Other Platforms

The app is a standard Vite SPA — it can be deployed to **Netlify**, **AWS S3 + CloudFront**, **GitHub Pages**, or any static hosting. Ensure:

- The build output directory is `dist`
- All routes redirect to `index.html` (SPA fallback)
- Environment variables are configured in the platform's settings

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Standards

- Follow the ESLint configuration (`eslint.config.js`)
- Use meaningful component and variable names
- Keep components focused and reusable
- Document complex logic with comments
- Test changes locally before submitting

---

## Assumptions & Limitations

| Category | Details |
|----------|---------|
| **Target users** | PG accommodation owners in Vadodara, Gujarat (India). Currency is INR. |
| **Authentication** | Email/Password only — no social login or phone auth |
| **State management** | React Context only (no Redux/Zustand); suitable for current scale |
| **Image uploads** | Unsigned Cloudinary uploads (suitable for low-traffic apps; consider signed uploads for production at scale) |
| **No backend server** | Fully serverless — all business logic runs in the browser; no custom API endpoints |
| **Bill generation** | Bills are generated from the admin UI, not automatically by a cron job |
| **Database** | Firestore free tier limits apply (50K reads, 20K writes, 20K deletes per day) |
| **Tenant matching** | AuthContext uses a multi-step fallback (UID → auth_uid field → case-insensitive email) to link auth users to tenant records |
| **Single admin role** | No granular admin permissions — all admins have full access |

---

## License

This project is proprietary software developed for Swami PG accommodations. All rights reserved.

---

## Support

For technical support or inquiries, contact the development team or raise an issue in the [GitHub repository](https://github.com/PriyanshiKantariya/PG-Application).