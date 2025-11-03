import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Check } from 'lucide-react';
import { compressAndUpload, compressionPresets } from '@/lib/imgbb';

interface ImgBBUploadProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  preset?: 'profile' | 'cover' | 'gallery';
  label?: string;
  previewClassName?: string;
}

export const ImgBBUpload: React.FC<ImgBBUploadProps> = ({
  onUploadComplete,
  currentUrl,
  accept = 'image/*',
  preset = 'gallery',
  label = 'Upload Image',
  previewClassName = 'w-32 h-32',
}) => {
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState<'compressing' | 'uploading' | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);
    setStage('compressing');

    try {
      // Compress and upload with progress tracking
      const url = await compressAndUpload(
        file,
        compressionPresets[preset],
        (currentStage, currentProgress) => {
          setStage(currentStage);
          setProgress(currentProgress);
        }
      );

      setPreviewUrl(url);
      onUploadComplete(url);
      setStage(null);
      
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
      setStage(null);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {!previewUrl ? (
        <>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className={`
                w-full flex flex-col items-center justify-center gap-2 px-4 py-6 
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
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {stage === 'compressing' ? 'Optimizing...' : 'Uploading...'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                  </div>
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
            </button>
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
            Images are automatically optimized before upload
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
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer underline"
            >
              Replace image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
