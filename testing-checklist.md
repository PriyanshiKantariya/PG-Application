## Testing Checklist

### Public Website
- [ ] All properties are listed on home page
- [ ] Area filter works correctly
- [ ] Available beds are calculated correctly
- [ ] Property detail page shows all information
- [ ] Call and WhatsApp buttons work
- [ ] Request visit form validates inputs
- [ ] Visit request is saved to database
- [ ] Confirmation message appears after submission

### Tenant Portal
- [ ] Tenant can log in with credentials
- [ ] Dashboard shows correct current month bill
- [ ] Bill status is displayed with correct color
- [ ] "I HAVE PAID" button opens Google Form
- [ ] Bills list shows all bills for tenant
- [ ] Year filter works on bills list
- [ ] Bill detail shows correct breakdown
- [ ] Total amount calculation is correct
- [ ] Complaints list shows ALL complaints for the property
- [ ] Other tenants' complaints are visible
- [ ] New complaint form validates inputs
- [ ] Complaint is saved with correct property_id
- [ ] Complaint appears immediately in list
- [ ] Profile shows correct tenant information
- [ ] House rules are displayed correctly

### Admin Panel - Properties
- [ ] Admin can log in
- [ ] Dashboard shows correct metrics
- [ ] Properties list displays all properties
- [ ] Available beds are calculated correctly
- [ ] Add new property form validates inputs
- [ ] New property is saved to database
- [ ] Edit property form pre-fills data
- [ ] Property updates are saved correctly

### Admin Panel - Tenants
- [ ] Tenants list displays all tenants
- [ ] Filter by property works
- [ ] Filter by status (Active/Vacated) works
- [ ] Search by name/phone/code works
- [ ] Add tenant form validates inputs
- [ ] New tenant is saved with correct data
- [ ] Tenant code is unique
- [ ] View tenant details shows all information
- [ ] Mark as Vacated updates status and date
- [ ] Bed availability increases when tenant vacates
- [ ] No future bills are generated for vacated tenant

### Admin Panel - Billing
- [ ] Utilities entry form accepts electricity and gas bills
- [ ] Active tenants count is correct
- [ ] Bill generation creates bills for all active tenants
- [ ] Bills are NOT created for vacated tenants
- [ ] Utility share calculation is correct (total / active_tenants)
- [ ] Total amount = rent + electricity_share + gas_share + late_fee
- [ ] Bill status is set to "Pending"
- [ ] Due date is set correctly (7th of month)
- [ ] Bills appear in Bills Overview
- [ ] Filters work correctly (property, month, year, status)
- [ ] Bills appear in tenant portal immediately

### Admin Panel - Payment Verification
- [ ] Bills with status "ReportedPaid" are listed
- [ ] Link to Google Sheet opens correctly
- [ ] Verify button changes status to "Paid"
- [ ] Paid_at timestamp is set
- [ ] Bill disappears from verification list
- [ ] Tenant sees "Paid" status in their portal
- [ ] Reject button changes status back to "Pending"

### Admin Panel - Complaints
- [ ] All complaints are listed
- [ ] Filter by property works
- [ ] Filter by status works
- [ ] Filter by category works
- [ ] View complaint details shows all information
- [ ] Update status works (Open → In Progress → Resolved)
- [ ] Admin notes can be added
- [ ] Resolved_at timestamp is set when status = Resolved
- [ ] Status change is visible to tenants immediately

### Admin Panel - Visit Requests
- [ ] All visit requests are listed
- [ ] Filter by property works
- [ ] Filter by status works
- [ ] View details shows all information
- [ ] Update status works
- [ ] Admin notes can be added
- [ ] Call and WhatsApp buttons work

### Integration Tests
- [ ] **New Tenant Flow**:
  1. Tenant fills Google Form
  2. Admin adds tenant from Sheet data
  3. Tenant login is created
  4. Tenant can log in
  5. Bed availability decreases
- [ ] **Bill Payment Flow**:
  1. Admin generates bills
  2. Tenant sees bill in dashboard
  3. Tenant clicks "I HAVE PAID"
  4. Tenant submits Google Form with screenshot
  5. Bill status changes to "ReportedPaid"
  6. Admin verifies in admin panel
  7. Bill status changes to "Paid"
  8. Tenant sees "Paid" status
- [ ] **Complaint Flow**:
  1. Tenant A creates complaint
  2. Complaint appears for Tenant A
  3. Complaint appears for Tenant B (same property)
  4. Admin sees complaint in admin panel
  5. Admin changes status to "In Progress"
  6. Both tenants see updated status
  7. Admin resolves complaint
  8. Both tenants see "Resolved" status
- [ ] **Tenant Vacation Flow**:
  1. Admin marks tenant as Vacated
  2. Bed availability increases immediately
  3. No bills are generated for next month
  4. Tenant can still log in (optional: disable login)

### Performance & Security
- [ ] Pages load in under 2 seconds
- [ ] Database queries are optimized (use indexes)
- [ ] Firestore security rules are implemented
- [ ] Only authenticated users can access tenant portal
- [ ] Only admin can access admin panel
- [ ] Tenants can only see their own bills
- [ ] Tenants can see all complaints for their property
- [ ] File uploads (via Google Forms) work reliably
- [ ] Form validations prevent invalid data
- [ ] Error messages are user-friendly

---
