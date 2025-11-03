import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: number; // in MB
  bucket?: string;
  folder?: string;
  label?: string;
  previewClassName?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentUrl,
  accept = 'image/*',
  maxSize = 5,
  bucket = 'vendor-images',
  folder = 'uploads',
  label = 'Upload File',
  previewClassName = 'w-32 h-32',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
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
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('✅ File uploaded:', publicUrl);
      
      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      
      // Complete progress
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }

    // Reset input
    event.target.value = '';
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete('');
  };

  return (
    <div className="space-y-3">
      {!previewUrl ? (
        <>
          <div className="relative">
            <input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id={`file-upload-${folder}`}
            />
            <label
              htmlFor={`file-upload-${folder}`}
              className={`
                flex flex-col items-center justify-center gap-2 px-4 py-6 
                border-2 border-dashed rounded-lg cursor-pointer
                transition-colors
                ${uploading 
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                }
              `}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="text-sm font-medium">Uploading... {Math.round(progress)}%</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-blue-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to browse or drag and drop
                    </p>
                  </div>
                </>
              )}
            </label>
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 flex items-center gap-2 bg-red-50 p-2 rounded">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500">
            Max file size: {maxSize}MB. Supported: {accept}
          </p>
        </>
      ) : (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className={`${previewClassName} object-cover rounded-lg border-2 border-gray-200`}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=Error';
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id={`file-replace-${folder}`}
            />
            <label
              htmlFor={`file-replace-${folder}`}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer underline"
            >
              Replace image
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
