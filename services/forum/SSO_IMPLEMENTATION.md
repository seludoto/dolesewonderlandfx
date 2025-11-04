# Single Sign-On (SSO) Implementation Guide

Enable seamless login between your main platform and the forum using Discourse SSO.

## Overview

With SSO enabled:
- Users log in once on your main platform
- Automatically logged into the forum
- User data synchronized (email, username, avatar)
- Centralized account management

## Architecture

```
User → Main Platform (app.dolesewonderlandfx.me)
         ↓
      Login & Auth
         ↓
      SSO Token Generated
         ↓
Forum (forum.dolesewonderlandfx.me) ← SSO Token
         ↓
      User Authenticated
```

## Backend Implementation

### 1. Add SSO Route to Backend

Create `backend/src/routes/sso.js`:

```javascript
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { authenticateToken } = require('../middleware/auth');

// SSO Secret (shared with Discourse)
const SSO_SECRET = process.env.DISCOURSE_SSO_SECRET;

// SSO Endpoint
router.get('/sso', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    
    // Get SSO payload and signature from Discourse
    const sso = req.query.sso;
    const sig = req.query.sig;
    
    if (!sso || !sig) {
      return res.status(400).json({ error: 'Missing SSO parameters' });
    }
    
    // Verify signature
    const hmac = crypto.createHmac('sha256', SSO_SECRET);
    const computedSig = hmac.update(sso).digest('hex');
    
    if (sig !== computedSig) {
      return res.status(403).json({ error: 'Invalid SSO signature' });
    }
    
    // Decode payload
    const payload = Buffer.from(sso, 'base64').toString('utf8');
    const params = new URLSearchParams(payload);
    const nonce = params.get('nonce');
    const returnUrl = params.get('return_sso_url');
    
    if (!nonce || !returnUrl) {
      return res.status(400).json({ error: 'Invalid SSO payload' });
    }
    
    // Build return payload
    const returnPayload = new URLSearchParams({
      nonce: nonce,
      email: user.email,
      external_id: user.id,
      username: user.email.split('@')[0], // or user.username if you have it
      name: user.name || user.email.split('@')[0],
      avatar_url: user.avatarUrl || '',
      avatar_force_update: 'true',
      bio: user.bio || '',
      admin: user.role === 'admin' ? 'true' : 'false',
      moderator: user.role === 'admin' || user.role === 'instructor' ? 'true' : 'false',
    });
    
    // Encode and sign return payload
    const returnSso = Buffer.from(returnPayload.toString()).toString('base64');
    const returnHmac = crypto.createHmac('sha256', SSO_SECRET);
    const returnSig = returnHmac.update(returnSso).digest('hex');
    
    // Redirect back to Discourse
    const redirectUrl = `${returnUrl}?sso=${encodeURIComponent(returnSso)}&sig=${returnSig}`;
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error('SSO error:', error);
    res.status(500).json({ error: 'SSO failed' });
  }
});

module.exports = router;
```

### 2. Register SSO Route

Add to `backend/src/app.js`:

```javascript
const ssoRoutes = require('./routes/sso');

// ... other routes

app.use('/auth', ssoRoutes);
```

### 3. Update Environment Variables

Add to `backend/.env`:

```bash
DISCOURSE_SSO_SECRET=your_shared_secret_key_here_min_32_chars
```

## Discourse Configuration

### 1. Enable SSO in Discourse

Access your forum admin panel:

1. Go to **Admin** → **Settings** → **Login**
2. Enable **enable sso**
3. Set **sso url** to: `https://app.dolesewonderlandfx.me/auth/sso`
4. Set **sso secret** to: (same as DISCOURSE_SSO_SECRET)
5. Enable **sso overrides email**
6. Enable **sso overrides username**
7. Enable **sso overrides name**
8. Enable **sso overrides avatar**
9. Save changes

### 2. Configure SSO Provider

Update `services/forum/.env`:

```bash
ENABLE_SSO=true
SSO_URL=https://app.dolesewonderlandfx.me/auth/sso
SSO_SECRET=your_shared_secret_key_here_min_32_chars
```

Restart Discourse:
```bash
docker-compose restart discourse
```

## Frontend Integration

### Add Forum Link with SSO

Update `apps/app-frontend/components/Navigation.js`:

```javascript
<a
  href="https://forum.dolesewonderlandfx.me/session/sso"
  target="_blank"
  rel="noopener noreferrer"
  className="nav-link"
>
  Community Forum
</a>
```

### Automatic Forum Login

Create a forum button that automatically logs users in:

```javascript
// apps/app-frontend/components/ForumButton.js
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ForumButton() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleForumAccess = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login?redirect=/forum';
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate SSO token on your backend
      const response = await fetch('/api/forum/sso-token', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const { url } = await response.json();
      
      // Open forum with SSO
      window.open(url, '_blank');
    } catch (error) {
      console.error('Forum access error:', error);
      alert('Failed to access forum');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleForumAccess}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? 'Opening Forum...' : 'Access Forum'}
    </button>
  );
}
```

## Testing SSO

### 1. Test SSO Flow

1. Log in to your main platform
2. Click "Community Forum" link
3. Should automatically log you into forum
4. Verify user details are synchronized

### 2. Test User Sync

Check that these fields are synced:
- ✅ Email address
- ✅ Username
- ✅ Display name
- ✅ Avatar image
- ✅ Admin/moderator status

### 3. Test Logout

1. Log out from main platform
2. Try accessing forum
3. Should be redirected to login

## User Roles Mapping

Map platform roles to forum roles:

```javascript
// In SSO endpoint
const roleMapping = {
  admin: { admin: true, moderator: true },
  instructor: { admin: false, moderator: true },
  student: { admin: false, moderator: false },
};

const roles = roleMapping[user.role] || { admin: false, moderator: false };

returnPayload.set('admin', roles.admin ? 'true' : 'false');
returnPayload.set('moderator', roles.moderator ? 'true' : 'false');
```

## Custom User Fields

Sync additional user data:

```javascript
// Add custom fields to SSO payload
returnPayload.set('custom.user_field_1', user.tradingExperience || '');
returnPayload.set('custom.user_field_2', user.accountType || '');
returnPayload.set('custom.user_field_3', user.preferredPairs || '');
```

Configure custom fields in Discourse:
1. Admin → Customize → User Fields
2. Add fields matching your custom data

## Security Considerations

### 1. Secret Key Management

- ✅ Use strong random secret (32+ characters)
- ✅ Store in environment variables
- ✅ Never commit to git
- ✅ Rotate periodically

Generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. HTTPS Required

- ✅ Use HTTPS for all SSO endpoints
- ✅ Configure SSL certificates
- ✅ Enable HSTS headers

### 3. Signature Verification

Always verify HMAC signatures:
```javascript
const hmac = crypto.createHmac('sha256', SSO_SECRET);
const computedSig = hmac.update(sso).digest('hex');

if (sig !== computedSig) {
  throw new Error('Invalid signature');
}
```

## Troubleshooting

### SSO Not Working

**Check logs:**
```bash
# Backend logs
pm2 logs dolesefx-backend

# Discourse logs
docker-compose logs discourse
```

**Common issues:**
1. Secret mismatch → Verify SSO_SECRET matches
2. URL mismatch → Check SSO_URL is correct
3. HTTPS required → Enable SSL
4. Signature invalid → Check HMAC algorithm

### User Not Syncing

**Verify payload:**
```javascript
console.log('SSO Payload:', returnPayload.toString());
```

**Check required fields:**
- ✅ nonce
- ✅ email
- ✅ external_id
- ✅ username

### Redirect Loop

**Causes:**
1. Invalid return URL
2. Missing authentication
3. CORS issues

**Solution:**
```javascript
// Add CORS headers
res.header('Access-Control-Allow-Origin', 'https://forum.dolesewonderlandfx.me');
res.header('Access-Control-Allow-Credentials', 'true');
```

## Advanced Features

### 1. Automatic Group Sync

Sync user groups/subscriptions:

```javascript
// Add groups to SSO payload
const groups = [];
if (user.subscription === 'pro') groups.push('pro_members');
if (user.subscription === 'vip') groups.push('vip_members');

returnPayload.set('add_groups', groups.join(','));
```

### 2. Profile Updates

Sync profile changes from platform to forum:

```javascript
// Webhook on profile update
app.post('/api/users/:id/profile', async (req, res) => {
  // Update user profile
  await updateUserProfile(req.params.id, req.body);
  
  // Trigger Discourse sync
  await syncUserToDiscourse(req.params.id);
  
  res.json({ success: true });
});
```

### 3. Two-Way Sync

Sync forum activity back to platform:

```javascript
// Discourse webhook endpoint
app.post('/webhooks/discourse', async (req, res) => {
  const { event, user, post } = req.body;
  
  switch (event) {
    case 'post_created':
      await trackUserActivity(user.external_id, 'forum_post');
      break;
    case 'topic_created':
      await trackUserActivity(user.external_id, 'forum_topic');
      break;
  }
  
  res.sendStatus(200);
});
```

## Support

For SSO issues:
- Check Discourse Meta: https://meta.discourse.org/t/official-single-sign-on-for-discourse-sso/13045
- Join #forum-support on Discord
- Email: support@dolesewonderlandfx.me

---

**Last Updated**: November 4, 2025  
**SSO Protocol**: Discourse SSO (OAuth 2.0 compatible)
