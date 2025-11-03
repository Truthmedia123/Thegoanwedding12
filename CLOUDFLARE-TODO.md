# ☁️ Cloudflare Pages - TODO

## ⚠️ ACTION REQUIRED

Add ImgBB API key to Cloudflare Pages for production uploads to work!

---

## 🚀 Steps:

### 1. Go to Cloudflare Dashboard
- URL: https://dash.cloudflare.com
- Navigate to: Workers & Pages → thegoanwedding12

### 2. Add Environment Variable
- Go to: Settings → Environment variables
- Click: "Add variable" under Production
- Add:
  ```
  Name: VITE_IMGBB_API_KEY
  Value: bcbfa00a046a39447bbc4108a4992f71
  ```
- Click: Save

### 3. Redeploy
```bash
git add .
git commit -m "Add ImgBB upload"
git push origin main
```

---

## ✅ Status

**Local:** ✅ Ready (API key in .env)  
**Production:** ⚠️ Needs Cloudflare config

---

## 📖 Full Docs

- `IMGBB-YOUTUBE-SETUP.md` - Complete guide
- `QUICK-START-IMGBB.md` - Quick start
- `CLOUDFLARE-PAGES-IMGBB-CONFIG.md` - Detailed Cloudflare setup
