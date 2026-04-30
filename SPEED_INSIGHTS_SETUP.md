# Vercel Speed Insights Setup Guide

## Overview

Vercel Speed Insights has been installed and configured for this project. However, it's important to understand that **Speed Insights is designed primarily for frontend applications** that serve HTML pages to track client-side performance metrics (Core Web Vitals).

## What Was Installed

1. **Package**: `@vercel/speed-insights` (v2.0.0)
2. **Middleware**: `src/middleware/speed-insights.middleware.js`
3. **Integration**: Added to `src/app.js`

## Important Notes

### About This Project

This is a **Node.js/Express backend API** that primarily serves JSON responses. Vercel Speed Insights is designed to track frontend performance metrics such as:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to First Byte (TTFB)

These metrics only apply to HTML pages rendered in a browser, not API endpoints.

### When Speed Insights Will Work

The Speed Insights middleware has been configured to automatically inject the tracking script into **any HTML responses** from this server. This means:

✅ **Will work for:**
- The root route (`/`) which now serves an HTML page
- Any future routes that serve HTML content
- Server-side rendered pages if you add them

❌ **Will NOT work for:**
- JSON API endpoints (`/api/v1/auth/*`, `/api/v1/materials/*`)
- Other non-HTML responses
- Backend performance metrics

## Implementation Details

### 1. Middleware (`src/middleware/speed-insights.middleware.js`)

The middleware provides two utilities:

#### `injectSpeedInsights()`
An Express middleware that automatically injects the Speed Insights script into HTML responses:

```javascript
import { injectSpeedInsights } from './middleware/speed-insights.middleware.js';
app.use(injectSpeedInsights());
```

#### `getSpeedInsightsScript()`
A utility function to manually get the script tag if needed:

```javascript
import { getSpeedInsightsScript } from './middleware/speed-insights.middleware.js';
const script = getSpeedInsightsScript();
```

### 2. App Configuration (`src/app.js`)

The middleware is applied globally to all routes. The root route (`/`) has been updated to serve an HTML page instead of plain text, demonstrating how Speed Insights works.

## How to Use

### Option 1: Automatic (Current Setup)
The middleware automatically injects Speed Insights into all HTML responses. No additional configuration needed.

### Option 2: Manual Injection
If you prefer manual control, you can:

1. Remove the middleware from `src/app.js`
2. Use `getSpeedInsightsScript()` to inject the script manually in specific routes

```javascript
import { getSpeedInsightsScript } from './middleware/speed-insights.middleware.js';

app.get('/custom-page', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>Custom Page</title></head>
      <body>
        <h1>Content</h1>
        ${getSpeedInsightsScript()}
      </body>
    </html>
  `);
});
```

## Vercel Dashboard Setup

To see Speed Insights data in your Vercel dashboard:

1. Deploy this application to Vercel
2. Go to your project in the Vercel dashboard
3. Navigate to the "Speed Insights" tab
4. Enable Speed Insights for your project

Note: Speed Insights data only appears for routes that serve HTML content and are accessed by real users in browsers.

## For Frontend Applications

If you plan to add a separate frontend application (React, Next.js, Vue, etc.), you should:

1. Install `@vercel/speed-insights` in the frontend project
2. Use the framework-specific integration from the official docs
3. Remove the middleware from this backend (it's not needed for API-only backends)

### Framework-Specific Installations

**Next.js (13.5+):**
```javascript
import { SpeedInsights } from '@vercel/speed-insights/next';
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**React:**
```javascript
import { SpeedInsights } from '@vercel/speed-insights/react';
function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights />
    </>
  );
}
```

## Recommendations

For a **pure API backend** like this project:
- Speed Insights provides limited value since most responses are JSON
- Consider using Vercel's other observability tools for backend monitoring
- If you serve HTML pages regularly, keep this integration
- If this is strictly an API, you may want to remove Speed Insights and use alternative monitoring solutions

## Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Vercel Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart)
- [Vercel Observability](https://vercel.com/docs/observability)
