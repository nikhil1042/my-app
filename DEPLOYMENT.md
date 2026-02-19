# Angular Project Deployment Guide

## ✅ Setup Complete!

All URLs updated to production (Render.com backend).

## Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Build Project:**
```bash
cd "d:\File share hub\Angular\my-app"
ng build --configuration production
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Follow prompts:**
   - Link to existing project or create new
   - Set build output directory: `dist/my-app/browser`

### Option 2: Netlify

1. **Build:**
```bash
ng build --configuration production
```

2. **Deploy via Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/my-app/browser
```

### Option 3: Firebase Hosting

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

2. **Build & Deploy:**
```bash
ng build --configuration production
firebase deploy
```

## Important Notes

### Backend (Already on Render.com)
- ✅ Backend URL: `https://backend-i8c3.onrender.com`
- ⚠️ **Image Upload Issue**: Render uses ephemeral storage
  - Files will be deleted on server restart
  - **Solution**: Use Cloudinary or AWS S3 for file storage

### Frontend URLs Updated
- ✅ Environment files configured
- ✅ Dashboard URLs point to Render backend
- ✅ vercel.json already configured

## Quick Deploy (Vercel)

```bash
cd "d:\File share hub\Angular\my-app"
ng build --configuration production
vercel --prod
```

## After Deployment

1. Update CORS in backend to allow your frontend domain
2. Test login/upload/download functionality
3. Consider adding Cloudinary for persistent file storage

## Files Modified
- ✅ `src/environments/environment.ts`
- ✅ `src/environments/environment.prod.ts`
- ✅ `developer-dashboard.ts`
- ✅ `user-dashboard.ts`
- ✅ `vercel.json` (already exists)
