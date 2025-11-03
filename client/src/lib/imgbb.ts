import imageCompression from 'browser-image-compression';

// ImgBB API configuration
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
}

interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

/**
 * Compress image before upload
 */
export async function compressImage(
  file: File,
  options?: Partial<CompressionOptions>
): Promise<File> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    console.log('✅ Image compressed:', {
      original: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      compressed: `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      reduction: `${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`,
    });
    return compressedFile;
  } catch (error) {
    console.error('❌ Compression error:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Upload image to ImgBB
 */
export async function uploadToImgBB(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API key not configured. Please add VITE_IMGBB_API_KEY to .env file');
  }

  try {
    // Create form data
    const formData = new FormData();
    formData.append('image', file);

    // Upload with progress tracking
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response: ImgBBResponse = JSON.parse(xhr.responseText);
            if (response.success) {
              console.log('✅ Image uploaded to ImgBB:', response.data.url);
              resolve(response.data.display_url);
            } else {
              reject(new Error('Upload failed: Invalid response'));
            }
          } catch (error) {
            reject(new Error('Upload failed: Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: HTTP ${xhr.status}`));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Send request
      xhr.open('POST', `${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`);
      xhr.send(formData);
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

/**
 * Compress and upload image to ImgBB
 */
export async function compressAndUpload(
  file: File,
  compressionOptions?: Partial<CompressionOptions>,
  onProgress?: (stage: 'compressing' | 'uploading', progress: number) => void
): Promise<string> {
  try {
    // Stage 1: Compress
    if (onProgress) onProgress('compressing', 0);
    const compressedFile = await compressImage(file, compressionOptions);
    if (onProgress) onProgress('compressing', 100);

    // Stage 2: Upload
    if (onProgress) onProgress('uploading', 0);
    const url = await uploadToImgBB(compressedFile, (progress) => {
      if (onProgress) onProgress('uploading', progress);
    });

    return url;
  } catch (error) {
    console.error('❌ Compress and upload error:', error);
    throw error;
  }
}

/**
 * Batch upload multiple images
 */
export async function batchUploadToImgBB(
  files: File[],
  compressionOptions?: Partial<CompressionOptions>,
  onProgress?: (index: number, stage: 'compressing' | 'uploading', progress: number) => void
): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const url = await compressAndUpload(
        file,
        compressionOptions,
        (stage, progress) => {
          if (onProgress) onProgress(i, stage, progress);
        }
      );
      urls.push(url);
    } catch (error) {
      console.error(`❌ Failed to upload file ${i + 1}:`, error);
      throw new Error(`Failed to upload ${file.name}: ${error}`);
    }
  }

  return urls;
}

/**
 * Get recommended compression settings for different image types
 */
export const compressionPresets = {
  profile: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  },
  cover: {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  },
  gallery: {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  },
};
