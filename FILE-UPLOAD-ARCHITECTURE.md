# 📤 File Upload Architecture Guide

## 🎯 **Overview**

Complete guide for uploading actual image and video files (not just URLs) for vendors.

---

## 🏗️ **Architecture Options**

### **Option 1: Admin Form File Upload** ⭐ **RECOMMENDED**
- Upload files directly through admin panel
- Drag-and-drop interface
- Automatic upload to cloud storage
- No CSV needed for images/videos

### **Option 2: CSV with Pre-Uploaded Files**
- Upload files to hosting service first
- Get URLs from hosting service
- Put URLs in CSV
- Import CSV with URLs

### **Option 3: Bulk File Upload API**
- Upload ZIP file with images/videos
- CSV maps files to vendors
- API processes and uploads all files

---

## ⭐ **OPTION 1: Admin Form File Upload (Best)**

### **How It Works:**

```
User Flow:
1. Admin opens vendor form
2. Clicks "Upload Image" or drags file
3. File uploads to Supabase Storage/Cloudinary
4. URL automatically saved to database
5. Image appears in gallery immediately
```

### **Implementation:**

#### **Step 1: Choose Storage Provider**

**A. Supabase Storage** (Free tier: 1GB)
- Already integrated with your database
- Simple API
- Free SSL and CDN
- Image transformations available

**B. Cloudinary** (Free tier: 25GB)
- Powerful image optimization
- Automatic format conversion
- Responsive images
- Video support

**C. ImgBB** (Free, unlimited)
- No account needed for basic use
- Simple API
- Direct upload
- Good for testing

---

### **IMPLEMENTATION: Supabase Storage** ⭐

#### **1. Setup Supabase Storage Bucket**

```sql
-- Create storage bucket for vendor images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-images', 'vendor-images', true);

-- Create storage bucket for vendor videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-videos', 'vendor-videos', true);

-- Set up storage policies (allow authenticated uploads)
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-images');

CREATE POLICY "Allow public access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-images');

-- Same for videos
CREATE POLICY "Allow authenticated video uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-videos');

CREATE POLICY "Allow public video access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vendor-videos');
```

#### **2. Add File Upload Component**

Create `client/src/components/FileUpload.tsx`:

```typescript
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  bucket?: string;
  folder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  accept = 'image/*',
  maxSize = 10,
  bucket = 'vendor-images',
  folder = 'uploads'
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setProgress(percent);
          }
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('✅ File uploaded:', publicUrl);
      onUploadComplete(publicUrl);
      
      // Reset
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`
            flex items-center justify-center gap-2 px-4 py-2 
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
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading... {Math.round(progress)}%</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Click to upload or drag and drop</span>
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
        <div className="text-sm text-red-600 flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Max file size: {maxSize}MB. Supported: {accept}
      </p>
    </div>
  );
};
```

#### **3. Add Drag-and-Drop Component**

Create `client/src/components/DragDropUpload.tsx`:

```typescript
import React, { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface DragDropUploadProps {
  onUploadComplete: (urls: string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  bucket?: string;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onUploadComplete,
  multiple = true,
  accept = 'image/*',
  maxFiles = 10,
  bucket = 'vendor-images'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];

    for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
      const file = files[i];
      
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        urls.push(publicUrl);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    setUploadedFiles(urls);
    onUploadComplete(urls);
    setUploading(false);
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          transition-colors cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
          </p>
          <p className="text-sm text-gray-500">
            {multiple ? `Upload up to ${maxFiles} files` : 'Upload a single file'}
          </p>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {uploadedFiles.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✓ Uploaded</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### **4. Update VendorForm to Use File Upload**

Modify `client/src/pages/admin/VendorsPage.tsx`:

```typescript
import { FileUpload } from '@/components/FileUpload';
import { DragDropUpload } from '@/components/DragDropUpload';

// Inside VendorForm component, replace URL inputs with file uploads:

{/* Profile Image - File Upload */}
<div>
  <Label className="flex items-center gap-2">
    <i className="fas fa-user-circle text-blue-500"></i>
    Profile Image
  </Label>
  
  <FileUpload
    onUploadComplete={(url) => setFormData({ ...formData, profile_image_url: url })}
    accept="image/*"
    maxSize={5}
    bucket="vendor-images"
    folder="profiles"
  />
  
  {formData.profile_image_url && (
    <div className="mt-2">
      <img 
        src={formData.profile_image_url} 
        alt="Profile" 
        className="w-32 h-32 object-cover rounded-lg border"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setFormData({ ...formData, profile_image_url: '' })}
        className="mt-1"
      >
        <X className="w-4 h-4 mr-1" />
        Remove
      </Button>
    </div>
  )}
</div>

{/* Gallery Images - Drag & Drop */}
<div>
  <Label className="flex items-center gap-2 mb-2">
    <i className="fas fa-images text-green-500"></i>
    Gallery Images
    <span className="text-xs font-normal text-gray-500">
      ({(formData.images || []).length} images)
    </span>
  </Label>
  
  <DragDropUpload
    onUploadComplete={(urls) => {
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...urls]
      });
    }}
    multiple={true}
    accept="image/*"
    maxFiles={20}
    bucket="vendor-images"
  />
  
  {/* Display uploaded gallery */}
  {formData.images && formData.images.length > 0 && (
    <div className="grid grid-cols-4 gap-3 mt-4">
      {formData.images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`Gallery ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
```

---

## 📊 **OPTION 2: CSV with Pre-Uploaded Files**

### **Workflow:**

```
Step 1: Upload files to hosting service
  ├─ Upload to Cloudinary/ImgBB/Imgur
  ├─ Get public URLs for each file
  └─ Copy URLs to spreadsheet

Step 2: Create CSV with URLs
  ├─ Column: profile_image_url
  ├─ Column: cover_image_url
  ├─ Column: images (comma-separated URLs)
  └─ Column: manual_videos (comma-separated URLs)

Step 3: Import CSV
  └─ URLs saved to database
```

### **CSV Structure:**

```csv
name,category,profile_image_url,cover_image_url,images,manual_videos
"Vendor 1","photographers","https://storage.com/profile1.jpg","https://storage.com/cover1.jpg","https://storage.com/img1.jpg|https://storage.com/img2.jpg","https://youtube.com/watch?v=abc"
"Vendor 2","decorators","https://storage.com/profile2.jpg","https://storage.com/cover2.jpg","https://storage.com/img3.jpg|https://storage.com/img4.jpg|https://storage.com/img5.jpg",""
```

### **Bulk Upload Services:**

**1. Cloudinary Bulk Upload:**
```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli

# Upload folder
cloudinary upload_dir ./vendor-images --folder vendors
```

**2. ImgBB Bulk Upload Script:**
```javascript
// upload-to-imgbb.js
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

const API_KEY = 'your_imgbb_api_key';

async function uploadImage(filePath) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));
  
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${API_KEY}`,
    { method: 'POST', body: form }
  );
  
  const data = await response.json();
  return data.data.url;
}

// Usage
const url = await uploadImage('./vendor1-profile.jpg');
console.log(url);
```

---

## 🎬 **Video Upload**

### **For Large Videos:**

**Use Video Hosting Platforms:**
- YouTube (upload privately, get link)
- Vimeo (free tier: 500MB/week)
- Cloudinary (video support)

### **For Small Videos (<100MB):**

**Upload to Supabase Storage:**
```typescript
const uploadVideo = async (file: File) => {
  const fileName = `${Date.now()}.mp4`;
  const filePath = `videos/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('vendor-videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: 'video/mp4'
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('vendor-videos')
    .getPublicUrl(filePath);
  
  return publicUrl;
};
```

---

## 📋 **Complete File Upload Flow**

```
┌─────────────────────────────────────────────────┐
│ ADMIN PANEL - Add/Edit Vendor                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ Profile Image:                                  │
│ ┌─────────────────────────────────────────┐    │
│ │  📤 Click to upload or drag and drop    │    │
│ │     (Max 5MB - JPG, PNG, GIF)           │    │
│ └─────────────────────────────────────────┘    │
│ [Preview: 132x132px]                           │
│                                                 │
│ Cover Image:                                    │
│ ┌─────────────────────────────────────────┐    │
│ │  📤 Click to upload or drag and drop    │    │
│ └─────────────────────────────────────────┘    │
│ [Preview: Full width]                          │
│                                                 │
│ Gallery Images:                                 │
│ ┌─────────────────────────────────────────┐    │
│ │  📤 Drop multiple files here            │    │
│ │     or click to browse (Max 20 files)   │    │
│ └─────────────────────────────────────────┘    │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│ │ 1  │ │ 2  │ │ 3  │ │ 4  │                   │
│ └────┘ └────┘ └────┘ └────┘                   │
│                                                 │
│ Videos:                                         │
│ ┌─────────────────────────────────────────┐    │
│ │  📤 Upload video file (Max 100MB)       │    │
│ └─────────────────────────────────────────┘    │
│ • video1.mp4 [Remove]                          │
│ • video2.mp4 [Remove]                          │
│                                                 │
│ [Save Vendor]                                   │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ UPLOAD PROCESS                                  │
├─────────────────────────────────────────────────┤
│ 1. File selected/dropped                        │
│ 2. Validate file (size, type)                   │
│ 3. Generate unique filename                     │
│ 4. Upload to Supabase Storage                   │
│ 5. Get public URL                               │
│ 6. Save URL to database                         │
│ 7. Display preview                              │
└─────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────┐
│ SUPABASE STORAGE STRUCTURE                      │
├─────────────────────────────────────────────────┤
│ vendor-images/                                  │
│ ├─ profiles/                                    │
│ │  ├─ 1730234567-abc123.jpg                    │
│ │  └─ 1730234568-def456.jpg                    │
│ ├─ covers/                                      │
│ │  ├─ 1730234569-ghi789.jpg                    │
│ │  └─ 1730234570-jkl012.jpg                    │
│ └─ uploads/                                     │
│    ├─ 1730234571-0.jpg                         │
│    ├─ 1730234571-1.jpg                         │
│    └─ 1730234571-2.jpg                         │
│                                                 │
│ vendor-videos/                                  │
│ └─ uploads/                                     │
│    ├─ 1730234572.mp4                           │
│    └─ 1730234573.mp4                           │
└─────────────────────────────────────────────────┘
```

---

## 💾 **Storage Comparison**

| Provider | Free Tier | Pros | Cons |
|----------|-----------|------|------|
| **Supabase** | 1GB | Integrated, CDN, Simple | Limited free storage |
| **Cloudinary** | 25GB | Powerful, Transforms | Complex pricing |
| **ImgBB** | Unlimited | Simple, Free | Less features |
| **Imgur** | Unlimited | Popular, Reliable | Rate limits |
| **AWS S3** | 5GB (12mo) | Scalable, Fast | Complex setup |

---

## ✅ **Recommended Setup**

### **For Your Use Case (500-1000 vendors):**

**Images:**
- **Supabase Storage** for profile/cover images
- **Cloudinary** for gallery images (better optimization)
- Average: 5 images per vendor × 500 vendors = 2,500 images
- Storage needed: ~5-10GB (well within Cloudinary free tier)

**Videos:**
- **YouTube** for video hosting (unlimited, free)
- Store YouTube URLs in database
- Alternative: Vimeo for private videos

---

## 🚀 **Next Steps**

1. **Set up Supabase Storage buckets** (run SQL above)
2. **Create FileUpload component** (copy code above)
3. **Update VendorForm** with file upload UI
4. **Test with sample images**
5. **Deploy and use!**

Would you like me to implement the file upload components in your codebase?
