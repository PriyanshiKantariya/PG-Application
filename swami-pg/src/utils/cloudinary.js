// Cloudinary Upload Utility (uses REST API — no SDK needed)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a file (Blob or File) to Cloudinary.
 * @param {Blob|File} file  - The image file or blob to upload
 * @param {string}    folder - Cloudinary folder path (e.g. "properties" or "utility_bills")
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, folder = 'swami-pg') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return {
        url: data.secure_url,
        publicId: data.public_id,
    };
}
