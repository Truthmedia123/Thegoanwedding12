# 📋 Vendor CSV Upload Guide

## 📁 File Location
`vendor-upload-template.csv` - Use this as your template

---

## 📊 CSV Format Requirements

### **File Format:**
- **Encoding:** UTF-8
- **Delimiter:** Comma (,)
- **Text Qualifier:** Double quotes (")
- **Line Ending:** CRLF or LF

---

## 🔑 Field Definitions

### **REQUIRED FIELDS** ⭐

#### 1. `name` (Required)
- **Type:** Text (max 200 characters)
- **Description:** Vendor business name
- **Example:** `"Goa Wedding Photographers"`
- **Validation:** Cannot be empty

#### 2. `category` (Required)
- **Type:** Text (lowercase, hyphenated)
- **Description:** Vendor service category
- **Valid Values:**
  - `photographers`
  - `videographers`
  - `decorators`
  - `caterers`
  - `venues`
  - `dj`
  - `bands`
  - `makeup-artists`
  - `mehendi-artists`
  - `planners`
  - `florists`
  - `cards`
  - `cakes`
  - `choreographers`
  - `others`
- **Example:** `"photographers"`

#### 3. `location` (Required)
- **Type:** Text
- **Description:** Primary service location
- **Valid Values:**
  - `North Goa`
  - `South Goa`
  - `Panjim`
  - `Margao`
  - `Mapusa`
  - `Vasco`
  - `All Goa`
- **Example:** `"North Goa"`

#### 4. `phone` (Required)
- **Type:** Text
- **Description:** Primary contact number with country code
- **Format:** `+91XXXXXXXXXX`
- **Example:** `"+919876543210"`
- **Validation:** Must include country code

---

### **OPTIONAL FIELDS** 📝

#### 5. `description`
- **Type:** Text (max 1000 characters)
- **Description:** Detailed business description
- **Example:** `"Professional wedding photography services in Goa with 10+ years experience. Specializing in candid, traditional, and destination weddings."`
- **Tips:** Include specialties, experience, unique selling points

#### 6. `address`
- **Type:** Text
- **Description:** Full business address
- **Example:** `"Shop 5, Panjim Market, Panjim, Goa 403001"`
- **Format:** Include street, area, city, pincode

#### 7. `email`
- **Type:** Email
- **Description:** Business email address
- **Example:** `"contact@goaweddingphotos.com"`
- **Validation:** Must be valid email format

#### 8. `website`
- **Type:** URL
- **Description:** Business website URL
- **Example:** `"https://goaweddingphotos.com"`
- **Format:** Must include `http://` or `https://`

#### 9. `price_range`
- **Type:** Text
- **Description:** Service pricing range
- **Example:** `"₹50,000 - ₹2,00,000"` or `"₹800 per plate"`
- **Format:** Use ₹ symbol, be specific

#### 10. `availability`
- **Type:** Text
- **Description:** Service availability details
- **Example:** `"Available year-round"` or `"Booking required 3 months in advance"`

#### 11. `whatsapp`
- **Type:** Text
- **Description:** WhatsApp number (with country code)
- **Example:** `"+919876543210"`
- **Note:** Can be same as phone number

#### 12. `instagram`
- **Type:** Text
- **Description:** Instagram username (without @)
- **Example:** `"goaweddingphotos"`
- **Format:** Username only, no @ or URL

#### 13. `youtube`
- **Type:** Text
- **Description:** YouTube channel ID or handle
- **Example:** `"@UCxyz123"` or `"@GoaWeddingPhotos"`
- **Format:** Channel ID starting with @ or UC

#### 14. `facebook`
- **Type:** URL
- **Description:** Facebook page URL
- **Example:** `"https://facebook.com/goaweddingphotos"`
- **Format:** Full URL

#### 15. `google_maps_place_id`
- **Type:** Text
- **Description:** Google Maps Place ID for location
- **Example:** `"ChIJxyz123abc"`
- **How to Get:**
  1. Go to Google Maps
  2. Search for your business
  3. Copy Place ID from URL or use Place ID Finder
- **Benefits:** Auto-syncs location photos and address

---

### **FEATURED VENDOR FIELDS** 🌟

#### 16. `featured`
- **Type:** Boolean
- **Description:** Mark vendor as featured
- **Valid Values:** `TRUE` or `FALSE`
- **Example:** `TRUE`
- **Default:** `FALSE`
- **Note:** Featured vendors appear at top with rose gold badge

#### 17. `featured_priority`
- **Type:** Number (0-100)
- **Description:** Priority order for featured vendors
- **Example:** `100` (highest priority)
- **Default:** `0`
- **Note:** Higher number = appears first in featured section

---

### **RATING FIELD** ⭐

#### 18. `rating`
- **Type:** Decimal (0.0 - 5.0)
- **Description:** Vendor rating
- **Example:** `4.8`
- **Default:** `4.0`
- **Format:** One decimal place (e.g., 4.5, 4.8)

---

## 📝 CSV Format Example

```csv
name,description,category,location,address,phone,email,website,price_range,availability,whatsapp,instagram,youtube,facebook,google_maps_place_id,featured,featured_priority,rating
"Vendor Name","Description here","photographers","North Goa","Full address","+919876543210","email@example.com","https://website.com","₹50,000 - ₹2,00,000","Available year-round","+919876543210","instagram_handle","@YouTubeChannel","https://facebook.com/page","ChIJxyz123",TRUE,100,4.8
```

---

## ✅ Data Validation Rules

### **Phone Numbers:**
- ✓ Must start with country code (+91 for India)
- ✓ Format: `+91XXXXXXXXXX`
- ✗ No spaces or dashes
- ✗ No parentheses

### **URLs:**
- ✓ Must include protocol: `https://` or `http://`
- ✓ Valid domain name
- ✗ No spaces
- ✗ No invalid characters

### **Category:**
- ✓ Must match one of the predefined categories
- ✓ Lowercase with hyphens
- ✗ No spaces
- ✗ No custom categories

### **Featured:**
- ✓ `TRUE` or `FALSE` (case-insensitive)
- ✗ `Yes/No`, `1/0`, or other values

### **Rating:**
- ✓ Between 0.0 and 5.0
- ✓ One decimal place
- ✗ Negative numbers
- ✗ Greater than 5.0

---

## 🎯 Best Practices

### **1. Text Fields with Commas:**
Always wrap in double quotes:
```csv
"Shop 5, Panjim Market, Panjim, Goa"
```

### **2. Empty Fields:**
Leave empty but keep the comma:
```csv
"Vendor Name","Description",,"North Goa"
```

### **3. Special Characters:**
Use proper encoding (UTF-8) for:
- ₹ (Rupee symbol)
- Accented characters
- Emojis (not recommended)

### **4. Line Breaks in Description:**
Avoid line breaks. Use spaces instead:
```csv
"Professional services. Specializing in weddings."
```

### **5. Testing:**
- Start with 2-3 vendors
- Verify import success
- Then upload full list

---

## 📤 Upload Process

### **Step 1: Prepare CSV**
1. Download `vendor-upload-template.csv`
2. Fill in vendor data
3. Save as UTF-8 CSV

### **Step 2: Upload**
1. Go to Admin Panel → Vendors
2. Click "Import CSV" button
3. Select your CSV file
4. Choose import method:
   - **Replace All:** Deletes existing + imports new
   - **Add to Existing:** Keeps existing + adds new

### **Step 3: Verify**
1. Check vendor count
2. Verify featured vendors appear correctly
3. Test vendor profile pages
4. Check social media links

---

## ⚠️ Common Errors & Solutions

### **Error: "Invalid category"**
- **Cause:** Category doesn't match predefined list
- **Solution:** Use exact category names from list above

### **Error: "Invalid phone format"**
- **Cause:** Missing country code or invalid format
- **Solution:** Use `+91XXXXXXXXXX` format

### **Error: "Duplicate vendor name"**
- **Cause:** Vendor with same name already exists
- **Solution:** Make names unique or use "Replace All" mode

### **Error: "Invalid URL"**
- **Cause:** Missing protocol or invalid format
- **Solution:** Include `https://` in all URLs

### **Error: "CSV parsing failed"**
- **Cause:** Incorrect encoding or delimiter
- **Solution:** Save as UTF-8 CSV with comma delimiter

---

## 🎨 Featured Vendors Setup

### **To Feature a Vendor:**
1. Set `featured` = `TRUE`
2. Set `featured_priority` = `100` (or desired priority)
3. Optionally set `featured_until` date (not in CSV, set in admin)

### **Priority Guidelines:**
- **100:** Top priority (premium clients)
- **75-99:** High priority
- **50-74:** Medium priority
- **1-49:** Low priority
- **0:** Not featured

### **Featured Benefits:**
- 🌟 Rose gold badge with shimmer animation
- 📌 Top placement on category pages
- 🎨 Premium card styling
- 👁️ 3x more visibility

---

## 📊 Sample Data Included

The template includes 5 sample vendors:
1. **Goa Wedding Photographers** - Featured, Priority 100
2. **Elegant Decorators Goa** - Regular
3. **Spice Route Caterers** - Featured, Priority 90
4. **DJ Beats Goa** - Regular
5. **Bridal Bliss Makeup** - Regular

**Delete or modify these before uploading your actual data!**

---

## 🔧 Advanced Features

### **Auto-Sync Features:**
If you provide these fields, the system will auto-sync:
- **YouTube:** Gallery images from channel
- **Google Maps Place ID:** Location photos and address
- **Instagram:** Profile link (manual, not auto-sync)

### **Image Management:**
- Main images auto-update from YouTube sync
- Gallery populated from YouTube videos
- Profile image from first YouTube thumbnail

---

## 📞 Support

### **Need Help?**
- Check field definitions above
- Review sample data in template
- Test with 1-2 vendors first
- Contact admin if issues persist

### **Bulk Upload Tips:**
- Maximum 100 vendors per upload (recommended)
- For 500+ vendors, split into multiple files
- Upload during off-peak hours
- Backup existing data before "Replace All"

---

## ✅ Pre-Upload Checklist

- [ ] CSV saved as UTF-8 encoding
- [ ] All required fields filled (name, category, location, phone)
- [ ] Phone numbers include country code (+91)
- [ ] URLs include protocol (https://)
- [ ] Categories match predefined list
- [ ] Featured vendors marked correctly
- [ ] Rating values between 0.0 and 5.0
- [ ] No line breaks in text fields
- [ ] Special characters properly encoded
- [ ] Sample data removed or modified
- [ ] File tested with 2-3 vendors first

---

## 🎉 Ready to Upload!

Once your CSV is ready:
1. Go to `/admin/vendors`
2. Click "Import CSV"
3. Select your file
4. Choose import method
5. Confirm and upload
6. Verify results

**Good luck with your vendor uploads!** 🚀
