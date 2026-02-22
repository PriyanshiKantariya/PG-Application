// Utility helper functions

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date to readable format
 * Handles Date objects, Firestore Timestamps, and strings
 */
export function formatDate(date) {
  if (!date) return '';
  
  let d;
  // Handle Firestore Timestamp (has seconds and nanoseconds)
  if (date && typeof date === 'object' && 'seconds' in date) {
    d = new Date(date.seconds * 1000);
  } else if (date instanceof Date) {
    d = date;
  } else {
    d = new Date(date);
  }
  
  // Check if date is valid
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format month and year
 */
export function formatMonthYear(month, year) {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Get status badge classes based on status type
 * Using Swami PG brand colors
 */
export function getStatusBadgeClass(status) {
  const statusClasses = {
    // Bill statuses (per README color palette)
    'Paid': 'bg-[#2E7D32] text-white',
    'Pending': 'bg-[#F9A825] text-gray-900',
    'ReportedPaid': 'bg-[#FF6F00] text-white',
    'Overdue': 'bg-[#C62828] text-white',
    
    // Complaint statuses
    'Open': 'bg-[#C62828] text-white',
    'InProgress': 'bg-[#F9A825] text-gray-900',
    'Resolved': 'bg-[#2E7D32] text-white',
    
    // Visit request statuses
    'New': 'bg-[#1E88E5] text-white',
    'Contacted': 'bg-[#F9A825] text-gray-900',
    'Completed': 'bg-[#2E7D32] text-white',
    
    // Tenant statuses
    'Active': 'bg-[#2E7D32] text-white',
    'Vacated': 'bg-[#757575] text-white'
  };

  return statusClasses[status] || 'bg-[#757575] text-white';
}

/**
 * Validate phone number (10 digits)
 */
export function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

/**
 * Validate email
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generate WhatsApp link
 */
export function getWhatsAppLink(phone, message = '') {
  const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`;
}

/**
 * Generate phone call link
 */
export function getCallLink(phone) {
  return `tel:+91${phone}`;
}

/**
 * Generate Google Maps link from address
 */
export function getGoogleMapsLink(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Get current month and year
 */
export function getCurrentMonthYear() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear()
  };
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date) {
  const d = date instanceof Date ? date : new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}
