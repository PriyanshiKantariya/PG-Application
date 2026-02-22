
---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Configuration](#configuration)
8. [Running the Application](#running-the-application)
9. [User Roles and Access](#user-roles-and-access)
10. [Module Documentation](#module-documentation)
11. [Firebase Setup](#firebase-setup)
12. [Deployment](#deployment)
13. [Contributing](#contributing)
14. [License](#license)

---

## Overview

Swami PG Management System is a single-page application built to digitize and automate the management of PG accommodations. The system supports multiple properties, provides separate interfaces for administrators and tenants, and includes a public-facing website for property listings.

### Key Objectives

- Centralize property and tenant data management
- Automate monthly bill generation with utility calculations
- Provide tenants with self-service access to bills and complaint submission
- Enable property owners to manage visit requests and track occupancy
- Present properties to prospective tenants through a public homepage

---

## Features

### Public Portal
- Property listings with images and availability status
- Property detail pages with gallery, rent information, and house rules
- Visit request submission form
- Contact options via phone and WhatsApp

### Admin Panel
- **Dashboard**: Overview of properties, tenants, and pending actions
- **Properties Management**: Create, edit, and delete properties with image uploads
- **Tenant Management**: Add tenants, assign to properties/flats, track status
- **Utilities Entry**: Record monthly electricity, water, and gas readings per flat
- **Bills Overview**: View and manage generated bills across all properties
- **Complaints Management**: Review and respond to tenant complaints
- **Visit Requests**: Process and schedule property visits

### Tenant Portal
- **Dashboard**: View current bill status and property information
- **Bills History**: Access current and past bills with payment status
- **Complaints**: Submit new complaints and track resolution status

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Frontend Framework | React 19.2 |
| Build Tool | Vite 7.2 |
| Styling | Tailwind CSS 4.1 |
| Routing | React Router DOM 7.13 |
| Backend Services | Firebase (Authentication, Firestore, Storage) |
| Language | JavaScript (ES Modules) |

---

## Project Structure

```
PG-App/
├── README.md
├── swami-pg/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── common/          # Reusable UI components
│   │   │   ├── layout/          # Layout wrappers (Admin, Tenant, Public)
│   │   │   └── property/        # Property-related components
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state management
│   │   ├── firebase/
│   │   │   └── config.js        # Firebase initialization
│   │   ├── hooks/
│   │   │   └── useProperties.js # Custom hooks for data fetching
│   │   ├── pages/
│   │   │   ├── admin/           # Admin panel pages
│   │   │   ├── public/          # Public website pages
│   │   │   └── tenant/          # Tenant portal pages
│   │   ├── utils/
│   │   │   ├── constants.js     # Application constants
│   │   │   └── helpers.js       # Utility functions
│   │   ├── App.jsx              # Root component with routing
│   │   ├── main.jsx             # Application entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
```

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (included with Node.js)
- **Git**: For version control
- **Firebase Account**: Required for backend services

---

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/PriyanshiKantariya/PG-Application.git
   cd PG-Application/swami-pg
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

---

## Configuration

### Environment Variables

Create a `.env` file in the `swami-pg` directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

These values can be obtained from the Firebase Console under Project Settings.

---

## Running the Application

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Build output will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

---

## User Roles and Access

The application supports three distinct user roles:

| Role | Access Level | Authentication |
|------|--------------|----------------|
| Public User | Homepage, property listings, visit request form | None required |
| Tenant | Tenant portal (bills, complaints, dashboard) | Email/Password |
| Admin | Full admin panel access | Email/Password |

### Default Routes

- **Public**: `/`, `/property/:id`, `/request-visit`
- **Tenant**: `/tenant/login`, `/tenant/dashboard`, `/tenant/bills`, `/tenant/complaints`
- **Admin**: `/admin/login`, `/admin/dashboard`, `/admin/properties`, `/admin/tenants`, `/admin/utilities`, `/admin/bills`, `/admin/complaints`, `/admin/visits`

---

## Module Documentation

### Properties Module

Properties represent individual PG locations. Each property contains:

- Basic information (name, area, address, landmark)
- Capacity details (total beds, total flats)
- Financial defaults (rent amount, deposit amount)
- House rules (displayed to prospective tenants)
- Images (uploaded via admin panel, displayed on homepage)
- Visibility toggle (show/hide from public homepage)

### Tenants Module

Tenant records include:

- Personal details (name, phone, email, emergency contact)
- Assignment (property, flat number, bed number)
- Financial terms (custom rent, deposit paid)
- Status tracking (Active, Vacated, Notice Period)
- Document references (ID proof, address proof)

### Utilities Module

Monthly utility readings are recorded per flat:

- Electricity: Previous and current meter readings
- Water: Fixed or metered charges
- Gas: Cylinder count or metered usage
- Billing period (month/year)

### Bills Module

Bills are generated based on:

- Base rent (property default or tenant-specific)
- Calculated utility charges
- Any additional charges or adjustments
- Payment status tracking (Pending, Paid, Overdue)

### Complaints Module

Tenant complaint workflow:

- Categories: Maintenance, Electrical, Plumbing, Cleaning, Other
- Priority levels: Low, Medium, High, Urgent
- Status progression: Open, In Progress, Resolved, Closed
- Admin response and resolution notes

### Visit Requests Module

Prospective tenant inquiries:

- Contact information
- Preferred visit date/time
- Property of interest
- Status: Pending, Scheduled, Completed, Cancelled
- Admin notes and follow-up tracking

---

## Firebase Setup

### Required Services

1. **Authentication**: Enable Email/Password sign-in method
2. **Cloud Firestore**: Create database in production or test mode
3. **Cloud Storage**: Enable for property image uploads

### Firestore Collections

The application uses the following collections:

| Collection | Purpose |
|------------|---------|
| `properties` | Property records |
| `tenants` | Tenant records |
| `flats` | Flat-level data including utility readings |
| `bills` | Generated monthly bills |
| `complaints` | Tenant complaints |
| `visit_requests` | Property visit inquiries |
| `admins` | Admin user records |

### Security Rules

For production deployment, configure appropriate security rules in Firebase Console. Example Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only collections
    match /properties/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Tenant access to own data
    match /tenants/{tenantId} {
      allow read, write: if request.auth.uid == tenantId;
    }
    
    match /bills/{billId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage CORS Configuration

For image uploads to work from localhost during development, configure CORS:

1. Create `cors.json` in project root:

   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
       "maxAgeSeconds": 3600,
       "responseHeader": ["Content-Type", "Content-Length"]
     }
   ]
   ```

2. Apply using gsutil:

   ```bash
   gsutil cors set cors.json gs://your-bucket-name.appspot.com
   ```

---

## Deployment

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

3. Build and deploy:

   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Alternative Platforms

The application can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

Ensure environment variables are configured in the hosting platform's settings.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Code Standards

- Follow ESLint configuration for code style
- Use meaningful component and variable names
- Document complex logic with comments
- Test changes locally before submitting

---

## License

This project is proprietary software developed for Swami PG accommodations. All rights reserved.

---

## Support

For technical support or inquiries, contact the development team or raise an issue in the GitHub repository.