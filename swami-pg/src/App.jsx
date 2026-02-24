import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout, TenantLayout, AdminLayout } from './components/layout';
import { ProtectedRoute } from './components/auth';
import { HomePage, PropertyDetailPage, RequestVisitPage, RulesPage } from './pages/public';
import { TenantLoginPage, TenantSignUpPage, TenantDashboard, TenantProfilePage, BillsListPage, BillDetailPage, ComplaintsListPage, NewComplaintPage, ComplaintDetailPage } from './pages/tenant';
import { AdminLoginPage, AdminDashboard, PropertiesListPage, PropertyFormPage, TenantsListPage, TenantFormPage, TenantDetailPage, UtilitiesEntryPage, BillsOverviewPage, VisitRequestsPage, ComplaintsAdminPage } from './pages/admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
            <Route path="/request-visit" element={<RequestVisitPage />} />
            <Route path="/rules" element={<RulesPage />} />
          </Route>

          {/* Tenant Auth Routes */}
          <Route path="/tenant/login" element={<TenantLoginPage />} />
          <Route path="/tenant/signup" element={<TenantSignUpPage />} />

          {/* Protected Tenant Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="tenant">
                <TenantLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/tenant/dashboard" element={<TenantDashboard />} />
            <Route path="/tenant/bills" element={<BillsListPage />} />
            <Route path="/tenant/bills/:billId" element={<BillDetailPage />} />
            <Route path="/tenant/complaints" element={<ComplaintsListPage />} />
            <Route path="/tenant/complaints/new" element={<NewComplaintPage />} />
            <Route path="/tenant/complaints/:complaintId" element={<ComplaintDetailPage />} />
            <Route path="/tenant/profile" element={<TenantProfilePage />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<PropertiesListPage />} />
            <Route path="/admin/properties/new" element={<PropertyFormPage />} />
            <Route path="/admin/properties/:propertyId/edit" element={<PropertyFormPage />} />
            <Route path="/admin/tenants" element={<TenantsListPage />} />
            <Route path="/admin/tenants/new" element={<TenantFormPage />} />
            <Route path="/admin/tenants/:tenantId" element={<TenantDetailPage />} />
            <Route path="/admin/bills" element={<UtilitiesEntryPage />} />
            <Route path="/admin/bills/overview" element={<BillsOverviewPage />} />
            <Route path="/admin/visits" element={<VisitRequestsPage />} />
            <Route path="/admin/complaints" element={<ComplaintsAdminPage />} />
            {/* More admin routes will be added here */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
