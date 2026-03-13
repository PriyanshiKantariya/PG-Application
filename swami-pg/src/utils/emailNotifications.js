import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const STATUS_LABELS = {
  Open: 'Open',
  InProgress: 'In Progress',
  Resolved: 'Resolved',
};

/**
 * Sends a complaint update notification email to the tenant via EmailJS.
 *
 * Template variables used (set these in your EmailJS template):
 *   {{tenant_name}}     - Tenant's full name
 *   {{tenant_email}}    - Tenant's email address (used as "To Email" in EmailJS)
 *   {{complaint_title}} - Title of the complaint
 *   {{old_status}}      - Previous status (e.g. "Open")
 *   {{new_status}}      - Updated status (e.g. "In Progress")
 *   {{admin_notes}}     - Admin note content (or "No additional notes.")
 *   {{status_changed}}  - "yes" or "no" — use in template conditionals if needed
 */
export async function sendComplaintUpdateEmail({
  tenantName,
  tenantEmail,
  complaintTitle,
  oldStatus,
  newStatus,
  adminNotes,
}) {
  if (!tenantEmail) {
    console.warn('EmailJS: tenant email missing, skipping notification.');
    return;
  }

  const statusChanged = oldStatus !== newStatus;
  const noteChanged = (adminNotes || '').trim().length > 0;

  // Only send if something actually changed
  if (!statusChanged && !noteChanged) return;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      tenant_name: tenantName || 'Tenant',
      tenant_email: tenantEmail,
      complaint_title: complaintTitle,
      old_status: STATUS_LABELS[oldStatus] || oldStatus,
      new_status: STATUS_LABELS[newStatus] || newStatus,
      admin_notes: adminNotes?.trim() || 'No additional notes.',
      status_changed: statusChanged ? 'yes' : 'no',
    },
    PUBLIC_KEY
  );
}
