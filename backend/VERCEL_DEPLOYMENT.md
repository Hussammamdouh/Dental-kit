# Vercel Backend Deployment Guide

This guide will help you deploy the backend to Vercel as serverless functions.

## 📋 Prerequisites

1. A Vercel account ([sign up here](https://vercel.com))
2. Vercel CLI installed (`npm i -g vercel`)
3. All environment variables configured

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel Dashboard

1. **Connect your repository to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the `backend` folder as the root directory

2. **Configure the project**
   - Framework Preset: **Other**
   - Root Directory: `backend`
   - Build Command: `npm run vercel-build` (or leave empty)
   - Output Directory: (leave empty - not needed for serverless)

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `env.example`
   - Make sure to set `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your deployment URL (e.g., `https://your-project.vercel.app`)

### Option 2: Deploy via CLI

```bash
cd backend
vercel login
vercel
```

Follow the prompts to configure your project.

## 🔧 Environment Variables

Add all required environment variables in Vercel Dashboard:

### Required Variables

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Other required variables from env.example
```

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`, make sure to include the entire key including `\n` characters
- Use Vercel's environment variable interface to add multi-line values properly
- Set variables for Production, Preview, and Development environments as needed

## 📝 Important Considerations

### Socket.io Limitations

⚠️ **Socket.io is NOT supported in Vercel serverless functions.**

- WebSocket connections are not supported in Vercel's serverless environment
- Real-time features (order updates, notifications via Socket.io) will not work
- The app will function normally for all REST API endpoints
- If you need real-time features, consider:
  - Using a separate service for WebSocket connections
  - Using Server-Sent Events (SSE) as an alternative
  - Using polling for real-time updates

### File Uploads

✅ **File uploads are handled via Cloudinary**, which works perfectly with serverless functions.

- Local file storage (`/uploads` directory) is **not available** in Vercel serverless
- All file uploads should go through Cloudinary (which is already configured)
- The static file serving route (`/uploads`) will not work in serverless
- Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set

### Function Timeout

- Default timeout: **10 seconds** (Hobby plan)
- Configured timeout: **30 seconds** (Pro plan and above)
- Maximum timeout: **60 seconds** (Enterprise plan)

If your functions exceed the timeout, consider:
- Optimizing database queries
- Using background jobs for long-running tasks
- Breaking down complex operations

### Cold Starts

- Serverless functions may experience "cold starts" on first request
- Subsequent requests will be faster
- Consider using Vercel Pro plan for better performance

## 🔍 Testing the Deployment

After deployment, test your API:

```bash
# Health check
curl https://your-project.vercel.app/health

# API health check
curl https://your-project.vercel.app/api/health

# Test endpoint
curl https://your-project.vercel.app/api/test-products
```

## 🔗 Updating Frontend

After deploying the backend, update your frontend's `VITE_API_URL`:

1. **In Vercel Dashboard (Frontend Project):**
   - Go to Settings → Environment Variables
   - Update `VITE_API_URL` to: `https://your-backend-project.vercel.app/api`
   - Redeploy the frontend

2. **Or in your `.env` file:**
   ```env
   VITE_API_URL=https://your-backend-project.vercel.app/api
   ```

## 📊 Monitoring

- Check Vercel Dashboard for function logs
- Monitor function execution times
- Set up alerts for errors
- Use Vercel Analytics for performance insights

## 🐛 Troubleshooting

### Function Timeout Errors

- Check function execution time in Vercel logs
- Optimize slow database queries
- Consider increasing timeout limit (Pro plan)

### Environment Variable Issues

- Ensure all required variables are set
- Check for typos in variable names
- Verify multi-line values (like `FIREBASE_PRIVATE_KEY`) are properly formatted

### CORS Errors

- CORS is configured in `vercel.json`
- If issues persist, check the `corsOptions` in `app.js`

### Database Connection Issues

- Verify Firebase credentials are correct
- Check Firebase project permissions
- Ensure Firebase Admin SDK is properly initialized

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch (Production)
- Push to other branches (Preview)
- Pull requests (Preview)

## 📚 Additional Resources

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel Limits](https://vercel.com/docs/platform/limits)

## ✅ Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Backend deployed successfully
- [ ] Health check endpoint working (`/health`)
- [ ] API health check working (`/api/health`)
- [ ] Test API endpoint working (`/api/test-products`)
- [ ] Frontend `VITE_API_URL` updated
- [ ] Frontend redeployed with new API URL
- [ ] All API endpoints tested
- [ ] Error monitoring set up

---

**Note:** Remember that Socket.io features will not work in this serverless setup. All REST API endpoints will function normally.

