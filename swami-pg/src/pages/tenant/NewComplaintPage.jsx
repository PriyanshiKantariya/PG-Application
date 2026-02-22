import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/common';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';

// SVG Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SubmitIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default function NewComplaintPage() {
  const navigate = useNavigate();
  const { tenantData } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image_url: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (formData.image_url.trim()) {
      try {
        new URL(formData.image_url);
      } catch {
        newErrors.image_url = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    if (!tenantData?.id || !tenantData?.property_id) {
      setSubmitError('Tenant information not found. Please try logging in again.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const now = Timestamp.now();
      
      const complaintData = {
        tenant_id: tenantData.id,
        tenant_name: tenantData.name || 'Unknown',
        property_id: tenantData.property_id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        status: 'Open',
        image_url: formData.image_url.trim() || null,
        admin_notes: '',
        created_at: now,
        resolved_at: null,
        updated_at: now
      };
      
      await addDoc(collection(db, 'complaints'), complaintData);
      
      navigate('/tenant/complaints', { 
        state: { message: 'Complaint submitted successfully!' } 
      });
      
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setSubmitError('Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/tenant/complaints"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 font-medium transition-colors"
      >
        <BackIcon />
        <span className="ml-1">Back to Complaints</span>
      </Link>

      {/* Form Card */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-6 text-white">
          <h1 className="text-2xl font-bold">New Complaint</h1>
          <p className="text-cyan-100 mt-1">
            Report an issue at {tenantData?.property_name || 'your property'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              maxLength={100}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                errors.title 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-700 focus:ring-cyan-500 focus:border-cyan-500'
              } focus:outline-none focus:ring-2 transition-all text-white placeholder-slate-500`}
            />
            <div className="flex justify-between mt-2">
              {errors.title ? (
                <p className="text-red-400 text-sm">{errors.title}</p>
              ) : (
                <span></span>
              )}
              <p className="text-slate-500 text-xs">{formData.title.length}/100</p>
            </div>
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-white mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                errors.category 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-700 focus:ring-cyan-500 focus:border-cyan-500'
              } focus:outline-none focus:ring-2 transition-all text-white`}
            >
              <option value="" className="bg-slate-800">Select a category</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-2">{errors.category}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail. Include location, when it started, etc."
              rows={5}
              className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                errors.description 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-700 focus:ring-cyan-500 focus:border-cyan-500'
              } focus:outline-none focus:ring-2 transition-all resize-none text-white placeholder-slate-500`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2">{errors.description}</p>
            )}
          </div>

          {/* Image URL Field */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-semibold text-white mb-2">
              Photo URL <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <div className="space-y-3">
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800 border ${
                  errors.image_url 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-700 focus:ring-cyan-500 focus:border-cyan-500'
                } focus:outline-none focus:ring-2 transition-all text-white placeholder-slate-500`}
              />
              {errors.image_url && (
                <p className="text-red-400 text-sm">{errors.image_url}</p>
              )}
              
              {/* Image Preview */}
              {formData.image_url && !errors.image_url && (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-xl border border-slate-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setErrors(prev => ({ ...prev, image_url: 'Could not load image. Please check the URL.' }));
                    }}
                  />
                </div>
              )}
              
              {/* Helper Text */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-sm text-slate-400">
                  <span className="font-medium text-slate-300">Tip:</span> Upload your photo to a service like 
                  <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 ml-1">
                    imgbb.com
                  </a> or 
                  <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 ml-1">
                    imgur.com
                  </a>
                  , then paste the image URL here.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                <>
                  <SubmitIcon />
                  <span className="ml-2">Submit Complaint</span>
                </>
              )}
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
            <p className="text-sm text-cyan-300">
              <span className="font-medium">Note:</span> Your complaint will be visible to all tenants in your PG. 
              The admin will review and respond as soon as possible.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
