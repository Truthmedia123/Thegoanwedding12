import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface MultiFileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  currentUrls?: string[];
  onRemove?: (index: number) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  bucket?: string;
  folder?: string;
}

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onUploadComplete,
  currentUrls = [],
  onRemove,
  accept = 'image/*',
  maxSize = 10,
  maxFiles = 10,
  bucket = 'vendor-images',
  folder = 'gallery',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const handleFilesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check max files limit
    if (currentUrls.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You can upload ${maxFiles - currentUrls.length} more.`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Some files exceed ${maxSize}MB limit`);
      return;
    }

    setUploading(true);
    setError(null);
    const uploadedUrls: string[] = [];

    try {
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileKey = `file-${i}`;
        
        // Update progress
        setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }));

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileKey]: Math.min((prev[fileKey] || 0) + 15, 90)
          }));
        }, 100);

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        clearInterval(progressInterval);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        
        // Complete progress for this file
        setUploadProgress(prev => ({ ...prev, [fileKey]: 100 }));
      }

      console.log(`✅ ${uploadedUrls.length} files uploaded successfully`);
      onUploadComplete(uploadedUrls);
      
      // Reset
      setTimeout(() => {
        setUploading(false);
        setUploadProgress({});
      }, 500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress({});
    }

    // Reset input
    event.target.value = '';
  };

  const totalProgress = Object.values(uploadProgress).length > 0
    ? Object.values(uploadProgress).reduce((a, b) => a + b, 0) / Object.values(uploadProgress).length
    : 0;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple
          onChange={handleFilesUpload}
          disabled={uploading || currentUrls.length >= maxFiles}
          className="hidden"
          id={`multi-file-upload-${folder}`}
        />
        <label
          htmlFor={`multi-file-upload-${folder}`}
          className={`
            flex flex-col items-center justify-center gap-3 px-6 py-8 
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${uploading || currentUrls.length >= maxFiles
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
            }
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              <div className="text-center">
                <p className="text-sm font-medium">Uploading files...</p>
                <p className="text-xs text-gray-500 mt-1">{Math.round(totalProgress)}% complete</p>
              </div>
            </>
          ) : currentUrls.length >= maxFiles ? (
            <>
              <ImageIcon className="w-10 h-10 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Maximum files reached</p>
                <p className="text-xs text-gray-500 mt-1">Remove some files to upload more</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-blue-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload up to {maxFiles - currentUrls.length} more files (Max {maxSize}MB each)
                </p>
              </div>
            </>
          )}
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Uploaded Files Grid */}
      {currentUrls.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images ({currentUrls.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-4 gap-3">
            {currentUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
