/**
 * Vercel Speed Insights Middleware
 * 
 * This middleware injects the Vercel Speed Insights script into HTML responses.
 * Note: Speed Insights is designed for frontend applications that serve HTML.
 * This middleware will only work when your Express app serves HTML pages.
 * 
 * For API-only backends, Speed Insights is not applicable as it tracks
 * client-side performance metrics (Core Web Vitals).
 */

/**
 * Middleware to inject Speed Insights script into HTML responses
 * @returns {Function} Express middleware function
 */
export const injectSpeedInsights = () => {
  return (req, res, next) => {
    // Store the original send function
    const originalSend = res.send;

    // Override the send function
    res.send = function (data) {
      // Check if the response is HTML
      const contentType = res.get('Content-Type');
      
      if (contentType && contentType.includes('text/html') && typeof data === 'string') {
        // Inject Speed Insights script before closing body tag
        const speedInsightsScript = `
    <script>
      window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/speed-insights/script.js"></script>`;
        
        // Insert the script before the closing body tag
        if (data.includes('</body>')) {
          data = data.replace('</body>', `${speedInsightsScript}\n  </body>`);
        } else if (data.includes('</html>')) {
          // If no body tag, insert before closing html tag
          data = data.replace('</html>', `${speedInsightsScript}\n</html>`);
        }
      }

      // Call the original send function with modified data
      originalSend.call(this, data);
    };

    next();
  };
};

/**
 * Get Speed Insights script tag for manual injection
 * @returns {string} Speed Insights script tags
 */
export const getSpeedInsightsScript = () => {
  return `<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>`;
};
