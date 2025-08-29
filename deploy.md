# 🚀 Deployment Guide

## Frontend Deployment (Netlify)

### 1. Prepare the Frontend
```bash
# Build the production version
npm --prefix client run build
```

### 2. Deploy to Netlify

#### Option A: Drag & Drop (Quick)
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag and drop the `client/dist` folder to deploy
4. Set your site name
5. Configure environment variables in Netlify dashboard

#### Option B: Git Integration (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm --prefix client run build`
3. Set publish directory: `client/dist`
4. Add environment variable: `VITE_API_URL` = your backend URL

### 3. Configure Environment Variables
In Netlify dashboard:
- Go to Site Settings > Environment Variables
- Add: `VITE_API_URL` = `https://your-backend-url.herokuapp.com`

## Backend Deployment

### Option 1: Heroku
```bash
# Install Heroku CLI
# Create a new Heroku app
heroku create your-todo-backend

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-connection-string"

# Deploy
git push heroku main
```

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the server folder
4. Set environment variables
5. Deploy

### Option 3: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set root directory to `server`
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Use in your backend deployment

### Option 2: Continue with Docker (Development)
```bash
# Keep MongoDB running locally
docker run -d --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v mongo_data:/data/db \
  mongo:6.0
```

## Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.herokuapp.com
```

### Backend (Heroku/Railway/Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app
PORT=4000
```

## Update Frontend API URL

After deploying the backend, update the frontend environment variable:
1. Go to Netlify dashboard
2. Site Settings > Environment Variables
3. Update `VITE_API_URL` to your actual backend URL
4. Redeploy

## Testing Deployment

1. Test frontend: Your Netlify URL
2. Test backend API: `https://your-backend-url.herokuapp.com/api/health`
3. Test full functionality: Add, edit, delete todos

## Troubleshooting

### CORS Issues
- Ensure backend allows requests from your Netlify domain
- Check CORS configuration in server

### API Connection Issues
- Verify environment variables are set correctly
- Check backend is running and accessible
- Test API endpoints directly

### Build Issues
- Check build logs in Netlify
- Ensure all dependencies are installed
- Verify build command is correct
