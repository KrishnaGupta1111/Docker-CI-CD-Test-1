# Environment Setup Guide

## Required Environment Files

### Server Environment (.env)

Create `server/.env` with the following variables:

```env
# Server Environment Variables
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://admin:password123@mongodb:27017/imagify?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Razorpay Configuration (if using payment)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Frontend URL for CORS
FRONTEND_URL=http://localhost:80
```

### Client Environment (.env)

Create `client/.env` with the following variables:

```env
# Client Environment Variables
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Imagify
```

## Important Notes

1. **Never commit .env files** - They are already in .gitignore
2. **Change JWT_SECRET** in production to a strong, unique key
3. **Update FRONTEND_URL** to match your actual frontend domain
4. **Add Razorpay credentials** if you're using payment features

## Docker Setup

The docker-compose.yml file is configured to use these environment files automatically. Make sure both .env files exist before running:

```bash
docker-compose up --build
```
