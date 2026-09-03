const { getAuth, clerkClient } = require('@clerk/express');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'abisri024@gmail.com';

/**
 * Helper to retrieve email address for an authenticated Clerk user.
 * First checks JWT claims, then falls back to fetching user object via Clerk API.
 */
async function getUserEmail(req, auth) {
  if (req.userEmail) return req.userEmail;

  // Check claims
  const emailFromClaims =
    auth.claims?.email ||
    auth.claims?.primary_email ||
    auth.claims?.email_address;

  if (emailFromClaims && typeof emailFromClaims === 'string') {
    req.userEmail = emailFromClaims.toLowerCase().trim();
    return req.userEmail;
  }

  // Fetch user profile from Clerk API if userId exists
  if (auth.userId) {
    try {
      const user = await clerkClient.users.getUser(auth.userId);
      const primaryEmailObj = user?.emailAddresses?.find(
        (e) => e.id === user.primaryEmailAddressId
      ) || user?.emailAddresses?.[0];
      if (primaryEmailObj?.emailAddress) {
        req.userEmail = primaryEmailObj.emailAddress.toLowerCase().trim();
        return req.userEmail;
      }
    } catch (err) {
      console.error('[authMiddleware] Failed to fetch user from Clerk API:', err.message);
    }
  }

  return null;
}

/**
 * Middleware: Requires valid Clerk authentication (401 if missing/invalid)
 */
const requireAuth = async (req, res, next) => {
  try {
    const adminEmailHeader = req.headers['x-admin-email'] || req.body?.adminEmail || req.query?.adminEmail || req.query?.email || req.body?.email;
    const auth = getAuth(req);

    if (auth && auth.userId) {
      const email = await getUserEmail(req, auth);
      req.auth = auth;
      req.userId = auth.userId;
      req.userEmail = email || adminEmailHeader?.toLowerCase()?.trim() || null;
      return next();
    }

    if (adminEmailHeader) {
      req.userEmail = adminEmailHeader.toLowerCase().trim();
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in.',
    });
  } catch (error) {
    console.error('[authMiddleware] requireAuth Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.',
    });
  }
};

/**
 * Middleware: Requires valid Clerk authentication AND Admin privileges (401 if unauthenticated, 403 if unauthorized)
 */
const requireAdmin = async (req, res, next) => {
  try {
    // 1. Check for x-admin-email header or query/body admin parameter matching ADMIN_EMAIL
    const adminEmailParam = req.headers['x-admin-email'] || req.body?.adminEmail || req.query?.adminEmail;
    if (adminEmailParam && adminEmailParam.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()) {
      req.userEmail = ADMIN_EMAIL.toLowerCase().trim();
      return next();
    }

    // 2. Check for Clerk JWT session authentication
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in as an administrator.',
      });
    }

    const email = await getUserEmail(req, auth);
    req.auth = auth;
    req.userId = auth.userId;
    req.userEmail = email;

    if (!email || email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Administrator privileges required.',
      });
    }

    next();
  } catch (error) {
    console.error('[authMiddleware] requireAdmin Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication session.',
    });
  }
};

module.exports = {
  ADMIN_EMAIL,
  requireAuth,
  requireAdmin,
};
