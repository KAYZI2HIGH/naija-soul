# Backend API Troubleshooting Guide

## Issue: Connection Timeout to naija-soul.onrender.com

### What's Happening

The app is trying to call `https://naija-soul.onrender.com/simulate-review` but getting a connection timeout. This typically means:

1. **Render Service is Sleeping** (Most Common for Free Tier)
   - Free tier Render services spin down after 15 minutes of inactivity
   - Takes 30-60 seconds to wake up when accessed
   - Solution: Manually wake it up by visiting the URL in your browser first

2. **Backend Service is Down**
   - The service crashed or failed to deploy
   - Solution: Check the Render dashboard for error logs

3. **Wrong Endpoint URL**
   - The endpoint path might be different
   - Solution: Verify the exact endpoint with your backend team

4. **CORS Issues**
   - Backend isn't allowing requests from your domain
   - Solution: Check backend CORS configuration

---

## Quick Diagnostics

### Step 1: Check if the Domain Resolves

```bash
nslookup naija-soul.onrender.com
```

Expected output: Should show IP addresses (216.24.57.7 or similar)

### Step 2: Test the Backend Directly

Visit this in your browser:

```
https://naija-soul.onrender.com/simulate-review
```

You might see:

- **GET request not allowed** → Backend is up but doesn't accept GET requests (good!)
- **Connection timeout** → Service is sleeping or down
- **Error 404** → Wrong URL, check the endpoint

### Step 3: Wake Up the Service (if on Free Tier)

If the service is sleeping, visit it in your browser to wake it up, then try the app again.

---

## Testing with Mock API (for UI Development)

If the backend is unavailable, you can test the UI with mock data:

### Option A: Use Environment Variable

Create `.env.local`:

```
NEXT_PUBLIC_USE_MOCK_API=true
```

Then restart your dev server:

```bash
npm run dev
```

### Option B: Temporarily Swap the Server Action

In `hooks/use-simulate-review.ts`, change:

```typescript
import { mockSimulateReview } from "@/app/actions/mock-simulate-review";
// Change the mutation to use mockSimulateReview instead
```

---

## Expected Behavior Once Backend is Working

1. Click "Send" button in the form
2. Button shows loading spinner
3. Dialog opens with the generated review
4. Display shows product info and generated review text

---

## Backend Team: Required Setup

For the backend service:

1. Endpoint: `POST /simulate-review`
2. Accept JSON with fields: `user_id`, `user_persona`, `product_name`, `product_category`, `product_description`, `business_name`
3. Return: `{ success: boolean, data: {...}, error?: string }`
4. Add CORS headers to allow requests from your frontend domain
5. Add request timeout handling (30+ seconds recommended)

---

## Logs to Check

### Frontend (Browser Console)

- "🚀 Calling API with payload:" - Shows what's being sent
- "✅ API response received" - Connection worked
- "❌ Fetch error:" - Connection failed

### Backend (Render Dashboard)

- Check the service logs for any errors during POST requests
- Check if the service went into "Killed" or "Crashed" state

---

## Next Steps

1. **Immediate**: Visit `https://naija-soul.onrender.com` in your browser to wake up the service
2. **Verify**: Check that you get a response (even if it's an error page)
3. **Test**: Try the form submission again
4. **If still failing**: Check Render dashboard logs or contact backend team
5. **For UI testing**: Use mock API mode with the environment variable above
