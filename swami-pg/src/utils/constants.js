// Application Constants

// Color Palette (from README)
export const COLORS = {
  primary: '#1E88E5',
  primaryDark: '#1565C0',
  success: '#2E7D32',
  warning: '#F9A825',
  danger: '#C62828',
  backgroundLight: '#F5F5F5',
  cardBackground: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0'
};

// Bill Statuses
export const BILL_STATUS = {
  PENDING: 'Pending',
  REPORTED_PAID: 'ReportedPaid',
  PAID: 'Paid',
  OVERDUE: 'Overdue'
};

// Complaint Statuses
export const COMPLAINT_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'InProgress',
  RESOLVED: 'Resolved'
};

// Complaint Categories
export const COMPLAINT_CATEGORIES = [
  'Electrical',
  'Water',
  'Cleaning',
  'Maintenance',
  'Other'
];

// Visit Request Statuses
export const VISIT_STATUS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  COMPLETED: 'Completed'
};

// Tenant Statuses
export const TENANT_STATUS = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  VACATED: 'Vacated'
};

// Visit Time Slots
export const VISIT_TIME_SLOTS = [
  'Morning 10:00 AM - 12:00 PM',
  'Afternoon 2:00 PM - 4:00 PM',
  'Evening 5:00 PM - 7:00 PM'
];

// Validation patterns
export const PATTERNS = {
  phone: /^[0-9]{10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Google Forms URLs
export const GOOGLE_FORMS = {
  newTenantOnboarding: 'https://forms.gle/cdxjA7mPaXkqYNsB6',
  paymentScreenshot: 'https://forms.gle/PcJkCWbptBymF9y69',
  // Google Sheet URL where payment screenshot responses are stored
  paymentResponsesSheet: 'https://docs.google.com/spreadsheets/d/1EUCnrAw6Y4-ItF6wM0xI690Zfh5d-NKwq-v7t8VjD78/edit'
};
