import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { LoadingSpinner } from '../../components/common';

// SVG Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const MoveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

export default function PropertyFormPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(propertyId);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    area: '',
    address: '',
    landmark: '',
    total_flats: '',
    default_rent: '',
    default_deposit: '',
    images: [], // Array of { url, path, isPrimary }
    showOnHomepage: true
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(''); // Progress text
  const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete on save

  useEffect(() => {
    if (isEditMode && propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  async function fetchProperty() {
    try {
      const docRef = doc(db, 'properties', propertyId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          area: data.area || '',
          address: data.address || '',
          landmark: data.landmark || '',
          total_flats: data.total_flats?.toString() || '',
          default_rent: data.default_rent?.toString() || '',
          default_deposit: data.default_deposit?.toString() || '',
          images: data.images || [],
          showOnHomepage: data.showOnHomepage !== false // Default true
        });
      } else {
        setError('Property not found');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }

  // Fast image compression - more aggressive for speed
  async function compressImage(file, maxWidth = 800, quality = 0.6) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Resize if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          quality
        );
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 15 * 1024 * 1024; // 15MB before compression

    const invalidFiles = files.filter(f => !validTypes.includes(f.type) || f.size > maxSize);
    if (invalidFiles.length > 0) {
      setError('Only JPG, PNG, WebP images under 15MB are allowed');
      return;
    }

    // Limit total images to 10
    if (formData.images.length + files.length > 10) {
      setError('Maximum 10 images allowed per property');
      return;
    }

    setUploadingImages(true);
    setUploadProgress('Compressing images...');
    setError('');

    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Processing ${i + 1}/${files.length}...`);
        
        // Compress the image (800px max, 60% quality for fast upload)
        const compressedBlob = await compressImage(file, 800, 0.6);
        
        setUploadProgress(`Uploading ${i + 1}/${files.length}...`);
        
        const timestamp = Date.now();
        const fileName = `${timestamp}_${i}.jpg`;
        const storagePath = `properties/${propertyId || 'temp'}/${fileName}`;
        const storageRef = ref(storage, storagePath);

        await uploadBytes(storageRef, compressedBlob);
        const url = await getDownloadURL(storageRef);

        uploadedImages.push({
          url,
          path: storagePath,
          isPrimary: formData.images.length === 0 && i === 0
        });
        
        // Update UI immediately after each upload
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadedImages[uploadedImages.length - 1]]
        }));
      }

    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
      setUploadProgress('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleRemoveImage(index) {
    const imageToRemove = formData.images[index];
    
    // Track for deletion on save (only if it's already in storage)
    if (imageToRemove.path) {
      setImagesToDelete(prev => [...prev, imageToRemove.path]);
    }

    // Remove from local state
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      
      // If we removed the primary image, make the first one primary
      if (imageToRemove.isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      
      return { ...prev, images: newImages };
    });
  }

  function handleSetPrimary(index) {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  }

  function handleMoveImage(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.images.length) return;

    setFormData(prev => {
      const newImages = [...prev.images];
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      return { ...prev, images: newImages };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Property name is required');
      return;
    }
    if (!formData.area.trim()) {
      setError('Area is required');
      return;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return;
    }

    if (!formData.total_flats || parseInt(formData.total_flats) <= 0) {
      setError('Total flats must be a positive number');
      return;
    }
    if (!formData.default_rent || parseFloat(formData.default_rent) <= 0) {
      setError('Default rent must be a positive number');
      return;
    }

    setSaving(true);

    try {
      // Delete removed images from storage
      for (const imagePath of imagesToDelete) {
        try {
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn('Could not delete image:', imagePath, err);
        }
      }

      const propertyData = {
        name: formData.name.trim(),
        area: formData.area.trim(),
        address: formData.address.trim(),
        landmark: formData.landmark.trim(),
        total_flats: parseInt(formData.total_flats),
        default_rent: parseFloat(formData.default_rent),
        default_deposit: parseFloat(formData.default_deposit) || 0,
        images: formData.images,
        showOnHomepage: formData.showOnHomepage,
        updated_at: serverTimestamp()
      };

      if (isEditMode) {
        // Update existing property
        const docRef = doc(db, 'properties', propertyId);
        await updateDoc(docRef, propertyData);
      } else {
        // Create new property
        propertyData.created_at = serverTimestamp();
        await addDoc(collection(db, 'properties'), propertyData);
      }

      navigate('/admin/properties');
    } catch (err) {
      console.error('Error saving property:', err);
      setError('Failed to save property. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/admin/properties"
          className="inline-flex items-center gap-2 text-[#4a4a4a] hover:text-[#5B9BD5] transition-colors mb-4"
        >
          <ArrowLeftIcon />
          Back to Properties
        </Link>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          {isEditMode ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p className="text-[#4a4a4a] mt-1">
          {isEditMode ? 'Update property details and images' : 'Enter details for the new PG property'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 space-y-6">
          
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#1a1a1a]">
                Property Images
                <span className="text-[#4a4a4a] font-normal ml-2">({formData.images.length}/10)</span>
              </label>
              {formData.images.length > 0 && (
                <span className="text-xs text-[#4a4a4a]">
                  ★ = Primary image shown on homepage
                </span>
              )}
            </div>

            {/* Image Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden border-2 ${
                      image.isPrimary ? 'border-amber-400' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    
                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-1 left-1 bg-amber-400 text-[#1a1a1a] px-1.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                        <StarIcon />
                        Primary
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(index)}
                          className="p-1.5 bg-amber-500/20 text-amber-600 rounded hover:bg-amber-500/30 transition-colors"
                          title="Set as primary"
                        >
                          <StarIcon />
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, -1)}
                          className="p-1.5 bg-gray-200 text-[#1a1a1a] rounded hover:bg-gray-200 transition-colors"
                          title="Move left"
                        >
                          <MoveIcon />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 bg-red-500/20 text-red-600 rounded hover:bg-red-500/30 transition-colors"
                        title="Remove"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div
              onClick={() => !uploadingImages && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#5B9BD5]/30 hover:bg-[#F5F5F5] transition-all ${
                uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImages}
              />
              {uploadingImages ? (
                <div className="flex flex-col items-center gap-2">
                  <LoadingSpinner size="medium" />
                  <span className="text-[#5B9BD5] font-medium">{uploadProgress || 'Processing...'}</span>
                  <span className="text-[#4a4a4a] text-sm">Images appear as they upload</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadIcon />
                  <span className="text-[#1a1a1a] font-medium">Click to upload images</span>
                  <span className="text-[#4a4a4a] text-sm">JPG, PNG, WebP � Auto-compressed for fast upload</span>
                </div>
              )}
            </div>
          </div>

          {/* Show on Homepage Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="showOnHomepage"
              name="showOnHomepage"
              checked={formData.showOnHomepage}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 bg-gray-200 text-[#5B9BD5] focus:ring-[#5B9BD5]/50"
            />
            <label htmlFor="showOnHomepage" className="text-[#1a1a1a] font-medium cursor-pointer">
              Show this property on the public homepage
            </label>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Property Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Property Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Swami PG � Gotri"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
            />
          </div>

          {/* Area */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Area <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g., Gotri, Akota, Alkapuri"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Full Address <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="Complete property address"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] resize-none"
            />
          </div>

          {/* Landmark */}
          <div>
            <label htmlFor="landmark" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="e.g., Near XYZ College"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
            />
          </div>

          {/* Number of Flats per Property */}
          <div>
            <label htmlFor="total_flats" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Number of Flats per Property <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="total_flats"
              name="total_flats"
              value={formData.total_flats}
              onChange={handleChange}
              min="1"
              placeholder="e.g., 10"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
            />
            <p className="text-xs text-[#4a4a4a] mt-1">Total number of flats in this property</p>
          </div>

          {/* Default Rent & Deposit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="default_rent" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
                Default Rent <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="default_rent"
                name="default_rent"
                value={formData.default_rent}
                onChange={handleChange}
                min="0"
                step="100"
                placeholder="e.g., 6500"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
              />
            </div>
            <div>
              <label htmlFor="default_deposit" className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
                Default Deposit
              </label>
              <input
                type="number"
                id="default_deposit"
                name="default_deposit"
                value={formData.default_deposit}
                onChange={handleChange}
                min="0"
                step="100"
                placeholder="e.g., 3000"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[#1a1a1a] placeholder:text-[#4a4a4a] focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
              />
            </div>
          </div>


        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-[#F5F5F5] border-t border-gray-200 rounded-b-xl flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Link
            to="/admin/properties"
            className="px-6 py-2.5 border border-gray-300 bg-gray-200 text-[#1a1a1a] rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || uploadingImages}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#5B9BD5] to-[#4A8AC4] text-[#1a1a1a] rounded-lg font-medium hover:from-[#4A8AC4] hover:to-[#5B9BD5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? (
              <>
                <LoadingSpinner size="small" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon />
                {isEditMode ? 'Update Property' : 'Save Property'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
