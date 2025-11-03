# 🚀 Cloudflare R2 + YouTube Complete Implementation

## 📹 **PART 1: YouTube Video Upload**

---

### **Option A: Manual Upload (Recommended for Simplicity)** ⭐

#### **How It Works:**
```
Vendor → Upload to YouTube → Set as Unlisted → Copy URL → Paste in Admin Form
```

#### **Admin Form Implementation:**

```typescript
// In VendorsPage.tsx - Add to form

{/* Manual Videos Section */}
<div>
  <Label className="flex items-center gap-2 mb-2">
    <i className="fas fa-video text-red-500"></i>
    YouTube Videos
    <span className="text-xs font-normal text-gray-500">
      ({(formData.manual_videos || []).length} videos)
    </span>
  </Label>
  
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
    <p className="text-sm text-blue-800 mb-2">
      <strong>How to add YouTube videos:</strong>
    </p>
    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
      <li>Upload video to YouTube</li>
      <li>Set visibility to "Unlisted"</li>
      <li>Copy video URL (https://www.youtube.com/watch?v=...)</li>
      <li>Paste URL below and click Add</li>
    </ol>
  </div>
  
  {/* Add Video Input */}
  <div className="flex gap-2 mb-3">
    <Input
      type="url"
      value={newVideoUrl}
      onChange={(e) => setNewVideoUrl(e.target.value)}
      placeholder="https://www.youtube.com/watch?v=abc123 or https://youtu.be/abc123"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddVideo();
        }
      }}
    />
    <Button
      type="button"
      onClick={handleAddVideo}
      disabled={!newVideoUrl.trim()}
      variant="outline"
    >
      <i className="fas fa-plus mr-2"></i>
      Add
    </Button>
  </div>

  {/* Video List with Preview */}
  {formData.manual_videos && formData.manual_videos.length > 0 && (
    <div className="space-y-3">
      {formData.manual_videos.map((videoUrl, index) => {
        const videoId = extractYouTubeId(videoUrl);
        return (
          <div key={index} className="bg-white border rounded-lg p-3">
            <div className="flex items-start gap-3">
              {/* Video Thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt="Video thumbnail"
                className="w-32 h-20 object-cover rounded"
              />
              
              {/* Video Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <i className="fas fa-video text-red-500"></i>
                  <span className="text-sm font-medium">Video {index + 1}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{videoUrl}</p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View on YouTube →
                </a>
              </div>
              
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemoveVideo(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

// Helper function to extract YouTube video ID
const extractYouTubeId = (url: string): string => {
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return '';
};
```

#### **Display on Vendor Profile:**

```typescript
// In VendorProfile.tsx

{/* Videos Section */}
{vendor.manual_videos && vendor.manual_videos.length > 0 && (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Videos</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vendor.manual_videos.map((videoUrl, index) => {
        const videoId = extractYouTubeId(videoUrl);
        return (
          <div key={index} className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`Video ${index + 1}`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      })}
    </div>
  </section>
)}
```

---

### **Option B: YouTube API Upload (Advanced)**

**For uploading videos directly from your admin panel to YouTube.**

#### **Setup YouTube API:**

1. Go to https://console.cloud.google.com
2. Create new project: "Wedding Vendors Platform"
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/youtube/callback`

#### **Install Dependencies:**

```bash
npm install googleapis
```

#### **Create YouTube Upload Service:**

```typescript
// server/services/youtube.ts
import { google } from 'googleapis';
import fs from 'fs';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Set credentials (get from OAuth flow)
oauth2Client.setCredentials({
  access_token: process.env.YOUTUBE_ACCESS_TOKEN,
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export const uploadVideoToYouTube = async (
  filePath: string,
  title: string,
  description: string
): Promise<string> => {
  try {
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'unlisted', // Not searchable, but accessible via link
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    const videoId = response.data.id;
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    console.error('YouTube upload error:', error);
    throw error;
  }
};
```

#### **Create Upload Component:**

```typescript
// client/src/components/YouTubeUpload.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload } from 'lucide-react';

interface YouTubeUploadProps {
  onUploadComplete: (videoUrl: string) => void;
}

export const YouTubeUpload: React.FC<YouTubeUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title || file.name);
      formData.append('description', 'Vendor portfolio video');

      const response = await fetch('/api/youtube/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onUploadComplete(data.videoUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video to YouTube');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={uploading}
          className="hidden"
          id="youtube-upload"
        />
        <label htmlFor="youtube-upload" className="cursor-pointer">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Uploading to YouTube... {progress}%</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p>Click to upload video to YouTube</p>
              <p className="text-xs text-gray-500 mt-1">
                Video will be uploaded as "Unlisted"
              </p>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
```

---

## 📦 **PART 2: Cloudflare R2 Image Upload**

---

### **Setup Cloudflare R2:**

#### **Step 1: Create R2 Bucket**

1. Go to https://dash.cloudflare.com
2. Navigate to R2 → Create bucket
3. Bucket name: `vendor-media`
4. Create bucket

#### **Step 2: Get API Credentials**

1. R2 → Manage R2 API Tokens
2. Create API Token
3. Copy:
   - Access Key ID
   - Secret Access Key
   - Account ID

#### **Step 3: Enable Public Access**

1. Go to your bucket settings
2. Enable "Public Access"
3. Copy public URL: `https://pub-YOUR_ID.r2.dev`

---

### **Install Dependencies:**

```bash
npm install @aws-sdk/client-s3
```

---

### **Create R2 Upload Service:**

```typescript
// server/services/r2.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = 'vendor-media';
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // https://pub-YOUR_ID.r2.dev

export const uploadToR2 = async (
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await r2Client.send(command);
    
    // Return public URL
    return `${PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error('R2 upload error:', error);
    throw error;
  }
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('R2 delete error:', error);
    throw error;
  }
};
```

---

### **Create R2 Upload Component:**

```typescript
// client/src/components/R2Upload.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

interface R2UploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSize?: number; // MB
  folder?: string;
}

export const R2Upload: React.FC<R2UploadProps> = ({
  onUploadComplete,
  accept = 'image/*',
  maxSize = 10,
  folder = 'uploads',
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload/r2', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('✅ File uploaded to R2:', data.url);
      
      onUploadComplete(data.url);
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          disabled={uploading}
          className="hidden"
          id="r2-upload"
        />
        <label
          htmlFor="r2-upload"
          className={`
            flex items-center justify-center gap-2 px-4 py-3 
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
        Max file size: {maxSize}MB
      </p>
    </div>
  );
};
```

---

### **Create API Endpoint:**

```typescript
// server/routes.ts
import { Hono } from 'hono';
import { uploadToR2 } from './services/r2';

app.post('/api/upload/r2', async (c) => {
  try {
    // Check authentication
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get file from form data
    const body = await c.req.parseBody();
    const file = body.file as File;
    const folder = body.folder as string || 'uploads';

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const key = `${folder}/${fileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const url = await uploadToR2(buffer, key, file.type);

    return c.json({
      success: true,
      url,
      key,
    });

  } catch (error: any) {
    console.error('R2 upload error:', error);
    return c.json({ error: error.message || 'Upload failed' }, 500);
  }
});
```

---

### **Environment Variables:**

```env
# .env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_PUBLIC_URL=https://pub-YOUR_ID.r2.dev

# Optional: YouTube API (if using Option B)
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:5000/auth/youtube/callback
YOUTUBE_ACCESS_TOKEN=your_access_token
YOUTUBE_REFRESH_TOKEN=your_refresh_token
```

---

### **Update VendorForm with R2 Upload:**

```typescript
// In VendorsPage.tsx

import { R2Upload } from '@/components/R2Upload';

{/* Profile Image - R2 Upload */}
<div>
  <Label className="flex items-center gap-2">
    <i className="fas fa-user-circle text-blue-500"></i>
    Profile Image
  </Label>
  
  <R2Upload
    onUploadComplete={(url) => setFormData({ ...formData, profile_image_url: url })}
    accept="image/*"
    maxSize={5}
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

{/* Cover Image - R2 Upload */}
<div>
  <Label className="flex items-center gap-2">
    <i className="fas fa-image text-purple-500"></i>
    Cover Image
  </Label>
  
  <R2Upload
    onUploadComplete={(url) => setFormData({ ...formData, cover_image_url: url })}
    accept="image/*"
    maxSize={10}
    folder="covers"
  />
  
  {formData.cover_image_url && (
    <div className="mt-2">
      <img 
        src={formData.cover_image_url} 
        alt="Cover" 
        className="w-full h-32 object-cover rounded-lg border"
      />
    </div>
  )}
</div>

{/* Gallery Images - R2 Multiple Upload */}
<div>
  <Label className="flex items-center gap-2 mb-2">
    <i className="fas fa-images text-green-500"></i>
    Gallery Images
    <span className="text-xs font-normal text-gray-500">
      ({(formData.images || []).length} images)
    </span>
  </Label>
  
  <R2Upload
    onUploadComplete={(url) => {
      setFormData({
        ...formData,
        images: [...(formData.images || []), url]
      });
    }}
    accept="image/*"
    maxSize={10}
    folder="gallery"
  />
  
  {/* Display gallery */}
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

## 📊 **R2 Storage Structure**

```
vendor-media/ (R2 Bucket)
├─ profiles/
│  ├─ 1730234567-abc123.jpg
│  ├─ 1730234568-def456.jpg
│  └─ ...
├─ covers/
│  ├─ 1730234569-ghi789.jpg
│  ├─ 1730234570-jkl012.jpg
│  └─ ...
└─ gallery/
   ├─ 1730234571-mno345.jpg
   ├─ 1730234572-pqr678.jpg
   └─ ...
```

---

## ✅ **Complete Workflow**

### **Adding a Vendor with Images & Videos:**

```
1. Admin opens "Add Vendor" form
2. Fills in basic info (name, category, etc.)
3. Uploads profile image → R2 → URL saved
4. Uploads cover image → R2 → URL saved
5. Uploads 5 gallery images → R2 → URLs saved
6. Adds YouTube video URLs → Saved to database
7. Clicks "Save Vendor"
8. All data saved to Supabase database
```

### **Database Structure:**

```json
{
  "id": 123,
  "name": "Goa Wedding Photographers",
  "profile_image_url": "https://pub-abc.r2.dev/profiles/123.jpg",
  "cover_image_url": "https://pub-abc.r2.dev/covers/123.jpg",
  "images": [
    "https://pub-abc.r2.dev/gallery/123-1.jpg",
    "https://pub-abc.r2.dev/gallery/123-2.jpg",
    "https://pub-abc.r2.dev/gallery/123-3.jpg"
  ],
  "manual_videos": [
    "https://www.youtube.com/watch?v=abc123",
    "https://www.youtube.com/watch?v=def456"
  ]
}
```

---

## 🚀 **Quick Start Checklist**

### **R2 Setup:**
- [ ] Create Cloudflare account
- [ ] Create R2 bucket: `vendor-media`
- [ ] Get API credentials
- [ ] Enable public access
- [ ] Add credentials to `.env`

### **YouTube Setup:**
- [ ] Decide: Manual URLs or API upload?
- [ ] If manual: Just add URL input field ✅
- [ ] If API: Set up OAuth credentials

### **Code Implementation:**
- [ ] Install `@aws-sdk/client-s3`
- [ ] Create R2 upload service
- [ ] Create R2Upload component
- [ ] Create API endpoint `/api/upload/r2`
- [ ] Update VendorForm with R2Upload
- [ ] Add YouTube URL input
- [ ] Test uploads

---

## 💰 **Cost Breakdown**

```
Cloudflare R2:
├─ Storage: 10GB FREE
├─ Bandwidth: FREE (no egress charges)
└─ Operations: 1M reads/month FREE

YouTube:
└─ Storage: UNLIMITED FREE

Total: $0/month ✅
```

---

## 🎯 **Recommendation**

**For simplicity, use:**
- ✅ **R2** for all images (profile, cover, gallery)
- ✅ **YouTube manual URLs** for videos (no API needed)

This gives you:
- 10GB free storage for images
- Unlimited free video hosting
- Simple implementation
- No API complexity

**Would you like me to implement this in your codebase?** 🚀
