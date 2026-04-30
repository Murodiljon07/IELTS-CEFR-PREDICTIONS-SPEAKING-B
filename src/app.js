import e from "express";
import cors from "cors";
import { injectSpeedInsights } from "./middleware/speed-insights.middleware.js";

const app = e();

/* CORS */
app.use(cors("*"));

/* middlewares */
app.use(e.json());

/* Vercel Speed Insights Middleware */
// Note: Speed Insights is designed for frontend applications serving HTML pages.
// This middleware will inject the Speed Insights script into any HTML responses.
// For pure API endpoints (JSON responses), Speed Insights is not applicable.
app.use(injectSpeedInsights());

/* routes */
import authRoutes from "./modules/auth/auth.routes.js";
import materialRoutes from "./modules/material/material.route.js";

app.get("/", (req, res) => {
  // For demonstration: serving an HTML page with Speed Insights
  res.set('Content-Type', 'text/html');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IELTS CEFR Predictions - Speaking API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #333; }
    .endpoint { 
      background: #f4f4f4; 
      padding: 10px; 
      margin: 10px 0; 
      border-left: 4px solid #0070f3;
    }
    code { 
      background: #f4f4f4; 
      padding: 2px 6px; 
      border-radius: 3px; 
    }
  </style>
</head>
<body>
  <h1>Welcome to IELTS Server API</h1>
  <p>This API provides endpoints for IELTS CEFR predictions and speaking assessments.</p>
  
  <h2>Available Endpoints:</h2>
  <div class="endpoint">
    <strong>Authentication:</strong><br>
    <code>POST /api/v1/auth/*</code> - Authentication endpoints
  </div>
  <div class="endpoint">
    <strong>Materials:</strong><br>
    <code>GET/POST /api/v1/materials/*</code> - Material management endpoints
  </div>
  
  <p><em>Note: Vercel Speed Insights is enabled and will track performance metrics when deployed on Vercel.</em></p>
</body>
</html>
  `);
});

/* use routes */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/materials", materialRoutes);

export default app;
