import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { batchUploadToImgBB, compressionPresets } from '@/lib/imgbb';

interface ImgBBMultiUploadProps {
  onUploadComplete: (urls: string[]) => void;
  currentUrls?: string[];
  onRemove?: (index: number) => void;
  accept?: string;
  maxFiles?: number;
  preset?: 'profile' | 'cover' | 'gallery';
}

export const ImgBBMultiUpload: React.FC<ImgBBMultiUploadProps> = ({
  onUploadComplete,
  currentUrls = [],
  onRemove,
  accept = 'image/*',
  maxFiles = 20,
  preset = 'gallery',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: { stage: 'compressing' | 'uploading'; progress: number };
  }>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check max files limit
    if (currentUrls.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed. You can upload ${maxFiles - currentUrls.length} more.`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select only image files');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress({});

    try {
      // Batch upload with progress tracking
      const urls = await batchUploadToImgBB(
        files,
        compressionPresets[preset],
        (index, stage, progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [index]: { stage, progress }
          }));
        }
      );

      console.log(`✅ ${urls.length} images uploaded successfully`);
      onUploadComplete(urls);
      
      // Reset
      setTimeout(() => {
        setUploading(false);
        setUploadProgress({});
      }, 500);

    } catch (err: any) {
      console.error('Batch upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress({});
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const totalProgress = Object.keys(uploadProgress).length > 0
    ? Object.values(uploadProgress).reduce((sum, item) => sum + item.progress, 0) / Object.keys(uploadProgress).length
    : 0;

  const uploadingCount = Object.keys(uploadProgress).length;
  const currentStage = uploadingCount > 0 
    ? uploadProgress[0]?.stage || 'uploading'
    : null;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFilesSelect}
          disabled={uploading || currentUrls.length >= maxFiles}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading || currentUrls.length >= maxFiles}
          className={`
            w-full flex flex-col items-center justify-center gap-3 px-6 py-8 
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
                <p className="text-sm font-medium">
                  {currentStage === 'compressing' ? 'Optimizing images...' : 'Uploading images...'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadingCount} of {uploadingCount} files • {Math.round(totalProgress)}%
                </p>
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
                  Upload up to {maxFiles - currentUrls.length} more images
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Images are automatically optimized
                </p>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{currentStage === 'compressing' ? 'Optimizing' : 'Uploading'}</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
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
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
