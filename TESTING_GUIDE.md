# Testing Guide for StyleSync

## Setup Before Testing

### 1. Install Dependencies (if not done)
```bash
pnpm install
```

### 2. Create Test User in Firebase

To test the login functionality, you need to create a test user:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `style-sync-2c936`
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Click **Add user** button
6. Create a test user:
   - Email: `admin@stylesync.com`
   - Password: `Admin123!`
7. Click **Add user**

### 3. Enable Google Sign-In (Optional)

1. In Firebase Console → Authentication
2. Click **Sign-in method** tab
3. Click **Google** provider
4. Toggle **Enable**
5. Select a support email
6. Save

## Running the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Testing Checklist

### ✅ Landing Page Test (`/`)

1. Navigate to `http://localhost:3000`
2. **Expected Results:**
   - See animated PixelBlast background (purple pixels)
   - See "STYLESYNC" title in large white text
   - See "Modern Salon Management System" subtitle
   - See "Login to Dashboard" button
   - NO sidebar or navbar should be visible
   - Background should be interactive (click to create ripples)

3. **Interactions to Test:**
   - Click anywhere on the background → should see ripple effects
   - Hover mouse around → smooth animation
   - Click "Login to Dashboard" button → should navigate to `/login`

### ✅ Login Page Test (`/login`)

1. Navigate to `http://localhost:3000/login`
2. **Expected Results:**
   - See login form with email and password fields
   - See lock icon and STYLESYNC branding
   - See "Remember me" checkbox
   - See "Forgot password?" link
   - See Google and Microsoft login buttons
   - NO sidebar or navbar should be visible

3. **Test Email/Password Login:**
   - Enter email: `admin@stylesync.com`
   - Enter password: `Admin123!`
   - Click "Sign In" button
   - **Expected:** Success toast appears, redirects to `/pos`

4. **Test Wrong Credentials:**
   - Enter wrong email or password
   - Click "Sign In"
   - **Expected:** Error toast with message about invalid credentials

5. **Test Google Sign-In:**
   - Click "Google" button
   - Sign in with your Google account
   - **Expected:** Success toast, redirects to `/pos`

6. **Test Show/Hide Password:**
   - Type password in password field
   - Click eye icon
   - **Expected:** Password becomes visible/hidden

### ✅ Protected Pages Test

After logging in, you should be redirected to `/pos`

1. **Check Navigation:**
   - Sidebar should now be visible on the left
   - Navbar should be visible at the top
   - Can navigate to different pages:
     - POS
     - Inventory
     - Customers
     - Repairs
     - Finance
     - Reports
     - Invoices
     - Shipping

2. **Test Logout:**
   - Look for logout button in navbar (usually top right)
   - Click logout
   - **Expected:** Redirects to landing page (`/`)

### ✅ Auth Protection Test

1. **Try to access protected page without login:**
   - Log out (if logged in)
   - Try to navigate to `http://localhost:3000/pos`
   - **Expected:** Should redirect to `/login`

2. **Test multiple protected routes:**
   - Try `/inventory`, `/customers`, `/repairs`
   - **Expected:** All redirect to login if not authenticated

## Known Issues & Notes

### TypeScript Warning
- You may see a TypeScript warning about `PixelBlast.tsx` casing
- This is harmless and won't affect functionality
- It's due to Windows filesystem case-insensitivity

### First Load
- PixelBlast animation may take 1-2 seconds to initialize on first load
- This is normal for WebGL content

### Browser Compatibility
- Works best in modern browsers (Chrome, Firefox, Edge, Safari)
- Requires WebGL support for PixelBlast animation

## Common Issues & Solutions

### Issue: Login doesn't work
**Solution:** 
- Check Firebase credentials in `.env.local`
- Ensure test user exists in Firebase Console
- Check browser console for error messages

### Issue: Can't see PixelBlast animation
**Solution:**
- Check if browser supports WebGL
- Try a different browser
- Check browser console for errors

### Issue: Redirects in a loop
**Solution:**
- Clear browser cache and cookies
- Check auth state in browser DevTools → Application → Local Storage

### Issue: Google Sign-In doesn't work
**Solution:**
- Ensure Google provider is enabled in Firebase Console
- Check if running on localhost (Google OAuth requires proper domain setup)

## Performance Tips

1. **Development Mode:**
   - Run `pnpm dev` for hot reload during development
   - Changes will reflect immediately

2. **Production Build:**
   ```bash
   pnpm build
   pnpm start
   ```
   - Test performance in production mode before demo

## Demo Script for Owner

```
1. Start at landing page
   "Here's our new landing page with an interactive background"
   → Click around to show ripple effects

2. Click login button
   "This takes you to the secure login page"

3. Login with credentials
   "We support email/password and Google sign-in"
   → Show successful login

4. Show dashboard
   "After login, you're taken to the POS system"
   → Navigate through different pages

5. Show logout
   "Users can securely log out and return to the landing page"
```

## Questions?

If you encounter any issues during testing:
1. Check the browser console for errors (F12)
2. Verify Firebase configuration in `.env.local`
3. Ensure all dependencies are installed (`pnpm install`)
4. Try restarting the development server
